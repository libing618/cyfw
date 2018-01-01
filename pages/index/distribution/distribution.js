// pages/marketing/distribution/distribution.js分销策略
const AV = require('../../../libs/leancloud-storage.js');
const weutil = require('../../../util/util.js');
var app = getApp()
Page({
  data:{
    reqData:[
      { gname: "channel", p:'渠道分成比例%',t: "dg",f:"mCost"},
      { gname: "extension", p:'推广分成比例%',t: "dg",f:"mCost"},
      {gname: "mCost", p: '销售管理总占比', t: "ed"}
    ],
    sProObjectId: ""
  },
  onLoad:function(options){
    var that = this;
    if (app.globalData.user.userRolName=='admin' && app.uUnit.afamily>0) {
      wetuil.updateData(true,3).then(pData=>{
        let sproportions=[],mproportions=[];
        new AV.Query('proportions').equalTo('unitId',app.uUnit.objectId).find(manufactor=>{
          if (manufactor) {
            manufactor.forEach(proportion=>{
              prodata = proportion.toJSON();
              pData.sData[prodata.objectId] = prodata;
              pData.mPage[0].forEach(mData=>{
                if (prodata.objectId==mData.objectId){
                  sproportions.push(prodata.objectId);
                } else {mproportions.push(mData.objectId)}
              })
            })
            pData.sPage = sproportions;
            pData.mPage[0] = mproportions;
          }
          that.setData(pData);
        }).catch(console.error);
      }).catch(console.error);
    } else {
      wx.showToast({ title: '权限不足，请检查！', duration: 2500 });
      setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
    };
  },

  f_sProObjectId:function(options){
    this.setData({sProObjectId:e.target.id});
  },

  fSave:function(e){
    var that = this;
    let newmf=new AV.Object.extend('proportions');
    newmf.set('unitId',app.uUnit.objectId);
    newmf.set('prObjectId',that.data.sProObjectId);
    newmf.set('channel',e.detail.value.channel);
    newmf.set('extension',e.detail.value.extension);
    newmf.set('mCost',e.detail.value.mCost);
    newmf.save().then(()=>{
      wx.showToast({ title: '分销信息已发布！', duration: 2500 });
      setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
    }).catch( console.error );
  }
})

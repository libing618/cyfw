//分销策略
const AV = require('../../../libs/leancloud-storage.js');
const proportions = require('../../../model/proportions');
const { updateData } = require('../../../util/util.js');
var app = getApp();

Page({
  data:{
    reqData:[
      { gname: "channel", p:'渠道分成比例%',t: "dg",f:"mCost"},
      { gname: "extension", p:'推广分成比例%',t: "dg",f:"mCost"},
      {gname: "mCost", p: '销售管理总占比', t: "fg"}
    ],
    vData:{"channel":7, "extension":10,"mCost":70},
    sProObjectId: ""
  },
  onLoad:function(options){
    var that = this;
    if ( app.globalData.user.userRolName == 'admin' && app.globalData.user.emailVerified ) {
      updateData(true,3).then(pData=>{
        let sproportions=[],mproportions=[];
        new AV.Query(proportions).equalTo('unitId', app.uUnit.objectId).find(manufactor=>{
          if (manufactor) {
            manufactor.forEach(prodata=>{
        //      prodata = proportion.toJSON();
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

  f_mCost:function(e){
    let n = parseInt(e.currentTarget.id.substring(3));      //数组下标
    inmcost = Number(e.detail.value);
    let vdSet = {};
    if (isNaN(inmcost)){
      vdSet['vData.'+this.data.reqData[n].gname] = 0;
    } else {
      vdSet['vData.'+this.data.reqData[n].gname] = inmcost>30 ? 30 : inmcost ;
    }
    vdSet.vData.mCost = 85-inmcost-Number(n==1 ? that.data.vData.channel : that.data.vData.extension)
    this.setData( vdSet );
  },
  fSave:function(e){
    var that = this;
    new proportions({unitId:'0',
      prObjectId:that.data.sProObjectId,
      channel:e.detail.value.channel,
      extension:e.detail.value.extension,
      mCost:e.detail.value.mCost
    }).save().then((prodata)=>{
      that.data.sData[prodata.objectId] = prodata;
      that.data.sPage.unshift(prodata.objectId);
      let mwz = that.data.mPage[0].indexOf(prodata.objectId);
      if (mwz>=0){that.data.mPage[0].splice(mwz,1)};
      that.data.sProObjectId = '';
      that.setData(that.data);
    }).catch( console.error );
  }
})

//帐务中心
const AV = require('../../../libs/leancloud-storage.js');
const orders = require('../../../model/orders');
const { updateData } = require('../../../util/util.js');
var app = getApp();

Page({
  data:{
    seDateReq:{ gname:"start_end", p:'起止日期', t:"sedate",endif:false},
    seDate: []
  },
  onLoad:function(options){
    var that = this;
    if ( app.globalData.user.userRolName == 'admin' && app.globalData.user.emailVerified) {
      updateData(true,3).then(proData=>{
        if (proData){
          that.data.mPage = proData.mPage[0];
          that.data.pageData = proData.pageData;
          updateData(true,4).then(specData=>{
            if(specData){
              that.data.specData = specData.pageData;
              let shelves={};
              that.data.mPage.forEach(proObjectId=>{
                shelves[proObjectId] = specData.mPage.filter(spec => {spec==proObjectId})
              })
              that.data.specPage = shelves;
            }
          }).catch(console.error);
        }
      }).catch(console.error);
    } else {
      wx.showToast({ title: '权限不足，请检查！', duration: 2500 });
      setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
    };
  },

  sumOrders:function(options){
    var that = this;
    new AV.Query(orders).equalTo('unitId', app.uUnit.objectId).find(manufactor=>{
      if (manufactor) {
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
  }

})

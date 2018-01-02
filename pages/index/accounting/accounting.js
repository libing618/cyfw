//帐务中心
const AV = require('../../../libs/leancloud-storage.js');
const orders = require('../../../model/orders');
const { updateData } = require('../../../util/util.js');
var app = getApp();

Page({
  data:{
    seDateReq:{ gname:"start_end", p:'预订起止日期', t:"sedate",endif:false},
    seDate: []
  },
  onLoad:function(options){
    var that = this;
    if ( app.globalData.user.userRolName == 'admin' && app.globalData.user.emailVerified) {
      updateData(true,3).then(pData=>{
        let sproportions=[],mproportions=[];
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
        }).catch(console.error);
      }).catch(console.error);
    } else {
      wx.showToast({ title: '权限不足，请检查！', duration: 2500 });
      setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
    };
  },

  f_sProObjectId:function(options){
    this.setData({sProObjectId:e.target.id});
  }

})

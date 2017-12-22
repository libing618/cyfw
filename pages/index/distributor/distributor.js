// pages/marketing/distributor/distributor.js分销招募
const AV = require('../../../libs/leancloud-storage.js');
var app = getApp()
Page({
  data:{
    reqData:[
      { gname: "agreement", p:'招募说明',t: "p"},
      {gname: "desc", p: '单位描述', t: "p"},
      {gname: "thumbnail", p: '图片简介', t: "thumb" },
      {gname: "aGeoPoint", p: '选择地理位置', t: "chooseAd" },
      {gname: "address", p: '详细地址', t: "ed"}
    ],
    shops: app.uUnit.shops
  },
  onLoad:function(options){
    var that = this;
    if (app.globalData.user.userRolName=='admin' && app.uUnit.afamily>0) {
      new AV.Query('manufactor').equalTo('unitId',app.uUnit.objectId).first(manufactor=>{
        if (manufactor) { that.setData({ vData: manufactor.toJSON() }) }
      }).catch(console.error);
    } else {
      wx.showToast({ title: '权限不足，请检查！', duration: 2500 });
      setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
    };
  },

  fSave:function(e){
    var that = this;
    let newmf=new AV.Object.extend('manufactor');
    newmf.set('unitId',app.uUnit.objectId);
    newmf.set('uName',app.uUnit.uName);
    newmf.set('adminPhone', app.globalData.user.mobilePhoneNumber);
    newmf.set('nick', app.uUnit.nick);
    newmf.set('title', app.uUnit.title);
    newmf.set('afamily', app.uUnit.afamily);
    newmf.set('desc', app.uUnit.desc);
    newmf.set('thumbnail', app.uUnit.thumbnail);
    newmf.set('aGeoPoint', app.uUnit.aGeoPoint);
    newmf.set('address', app.uUnit.address);
    newmf.set('agreement',e.detail.value.agreement);
    newmf.save().then(()=>{
      wx.showToast({ title: '分销信息已发布！', duration: 2500 });
      setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
    }).catch( console.error );
  }
})

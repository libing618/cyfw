//分销招募
const AV = require('../../libs/leancloud-storage.js');
const { checkRols } =  require('../../model/initForm');;
const { i_thumb,i_chooseAd } = require('../import/impedit');
var app = getApp()
Page({
  data:{
    navBarTitle: app.roleData.uUnit.uName+'的分销商',
    pw: app.sysinfo.pw,
    reqData:[
      {gname: "agreement", p:'招募文件',t: "p"},
      {gname: "desc", p: '单位描述', t: "p"},
      {gname: "thumbnail", p: '图片简介', t: "thumb" },
      {gname: "aGeoPoint", p: '选择地理位置', t: "chooseAd" },
      {gname: "address", p: '详细地址', t: "ed"}
    ],
    vData: app.roleData.uUnit
  },
  distributorLog:{},
  onLoad:function(options){
    var that = this;
    if (checkRols(9,app.roleData.user)) {
      new AV.Query('manufactor').equalTo('unitId',app.roleData.uUnit.objectId).first().then(manufactor=>{
        if (manufactor) {
          that.setData({ vData: manufactor.toJSON() });
          that.distributorLog = manufactor;
        }
      }).catch( console.error);
    };
  },
  i_thumb:i_thumb,
  i_chooseAd:i_chooseAd,
  fSave:function(e){
    var that = this;
    var sObject = AV.Object.extend('manufactor');
    let newmf = new sObject();
    if (that.distributorLog) {
      newmf.id = that.distributorLog.id;
      delete that.distributorLog.id;
    };
    newmf.set('unitId',app.roleData.uUnit.objectId);
    newmf.set('uName',app.roleData.uUnit.uName);
    newmf.set('adminPhone', app.roleData.user.mobilePhoneNumber);
    newmf.set('nick', app.roleData.uUnit.nick);
    newmf.set('title', app.roleData.uUnit.title);
    newmf.set('afamily', app.roleData.uUnit.afamily);
    newmf.set('desc', e.detail.value.desc);
    newmf.set('thumbnail', e.detail.value.thumbnail);
    newmf.set('aGeoPoint', e.detail.value.aGeoPoint);
    newmf.set('address', e.detail.value.address);
    newmf.set('agreement',e.detail.value.agreement);
    newmf.save().then(()=>{
      if ( that.distributorLog ){
        let dLog = AV.Object.extend('distributorLog');
        let saveLog = new dLog();
        saveLog.set(that.distributorLog);
        saveLog.save();
      }
      wx.showToast({ title: '分销信息已发布', duration: 2500 });
      setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
    }).catch( console.error );
  }
})

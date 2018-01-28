// 浏览pages
const {readShowFormat}=require('../../model/initupdate');
var app=getApp()
Page({
  data:{
    uEV: false,
    vData: {},
    reqData: []
  },
  pno:0,
  inFamily:false,
  cName:'',
  onLoad: function(options) {
    var that = this ;
    let cUnitName = app.globalData.user.emailVerified ? app.uUnit.uName : '体验用户';     //用户已通过单位和职位审核
    that.pno = Number(options.pNo);
    let artid = Number(options.artId);
    if (!isNaN(pno) && isNaN(artid)) {             //检查参数
      let pClass = require('../../model/procedureclass.js')[that.pno];
      that.cName = pClass.pModle;
      if ( that.pno==1 ){                             //已发布的文章信息只有发布单位能修改
        that.data.uEV = app.globalData.user.emailVerified && app.uUnit.objectId==app.aData.articles[options.artId].unitId;
        that.data.vData = app.aData.articles[options.artId];
      } else {
        that.data.uEV = app.globalData.user.emailVerified;
        that.data.vData = app.aData[that.cName][app.uUnit.objectId][options.artId];
      }
      that.inFamily = typeof pClass.afamily != 'undefined';
      readShowFormat(pClass.pSuccess).then(req=>{
        that.data.reqData=req;
        that.setData(that.data);
      });
      wx.setNavigationBarTitle({
        title: cUnitName+ '的' + that.data.inFamily ? pClass.afamily[that.data.vData.afamily] : pClass.pName ,
      })
    } else {
      wx.showToast({ title: '数据传输有误！',icon:'loading', duration: 2500 });
      setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
    }
  },

  fEditProcedure: function(e){
    var that = this;
    var url='/inputedit/fprocedure/fprocedure?pNo='+that.pno;
    switch (e.currentTarget.id){
      case 'fModify' :
        url += '&artId='+that.data.vData.objectId;
        break;
      case 'fTemplate' :
        if (that.pno==1) {
          url += '&artId='+that.data.vData.afamily;
          app.aData.articles['articles'+that.data.vData.afamily] = that.data.vData;
        } else {
          if (that.inFamily) {
            url += '&artId='+that.data.vData.afamily;
            app.aData[that.cName][app.uUnit.objectId][that.cName+that.data.vData.afamily] = that.data.vData;
          } else {
            app.aData[that.cName][app.uUnit.objectId][that.cName] = that.data.vData;
          }
        };
        break;
    };
    wx.navigateTo({ url: url});
  }

})

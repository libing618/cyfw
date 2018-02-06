// 浏览pages
const { readShowFormat } = require('../../model/initForm.js');
const { isAllData } = require('../../model/initupdate.js');
var app=getApp()
Page({
  data:{
    uEV: app.globalData.user.emailVerified,
    enUpdate: false,
    vData: {},
    reqData: []
  },
  pno:0,
  isAll:false,
  inFamily:false,
  unitId:'',
  cName:'',
  onLoad: function(options) {
    var that = this ;
    let cUnitName = app.globalData.user.emailVerified ? app.roleData.uUnit.uName : '体验用户';     //用户已通过单位和职位审核
    that.pno = Number(options.pNo);
    that.isAll = isAllData(that.pno);
    let artid = Number(options.artId);
    if (!isNaN(that.pno) && isNaN(artid)) {             //检查参数
      let pClass = require('../../model/procedureclass.js')[that.pno];
      that.cName = pClass.pModel;
      that.inFamily = typeof pClass.afamily != 'undefined';
      that.unitId = options.uId ? options.uId : app.roleData.uUnit.objectId;
      that.data.vData = that.isAll ? app.aData[that.cName][options.artId] : app.aData[that.cName][that.unitId][options.artId];
      let showFormat = pClass.pSuccess;
      switch (that.pno) {
        case 6:
          showFormat = [
            {gname:"pics", p:'图片集',t:"pics"},
            {gname:"uName", p:'名称', t:"h1" },
            {gname:"title", p:'简介',t:"h2" },
            {gname:"tvidio", p:'视频简介',t: "vidio" },
            {gname:"desc", p:'描述',t:"p" },
            {gname:"specstype", p:'规格类型', inclose:false,t:"listsel", aList:['单品','套餐']},
            {gname:"specs", p:'规格',t:"specsel",csc:"specsel" },
            {gname:"details", p:'详情',t:"eDetail" }]
          break;
      };
      readShowFormat(showFormat, that.data.vData).then(req=>{
        that.data.reqData=req;
        that.data.enUpdate = that.unitId==that.unitId && typeof pClass.suRoles!='undefined';  //本单位信息且流程有上级审批的才允许修改
        that.setData(that.data);
      });
      wx.setNavigationBarTitle({
        title: cUnitName+ '的' + that.inFamily ? pClass.afamily[that.data.vData.afamily] : pClass.pName ,
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
        url += that.inFamily ? '&artId='+that.data.vData.afamily : '';
        let newRecord = that.inFamily ? that.cName+that.data.vData.afamily : that.cName;
        if (that.isAll) {
          app.aData[that.cName][newRecord] = that.data.vData;
        } else {
          app.aData[that.cName][that.unitId][newRecord] = that.data.vData;
        };
        break;
    };
    wx.navigateTo({ url: url});
  }

})

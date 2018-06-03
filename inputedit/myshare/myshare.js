//共享信息管理
const { checkRols } =  require('../../model/initForm');
const { initupdate } =  require('../../model/initupdate');
const {f_modalRecordView} = require('../../model/controlModal');
const { initData } = require('../import/unitEdit');
const oClass = require('../../model/procedureclass.js').share;
var app = getApp()
Page({
  data: {
    pNo: 'share',                       //流程
    pw: app.sysinfo.pw,
    ht:{
      navTabs: oClass.afamily,
      fLength: oClass.afamily.length,
      pageCk: 0
    },
    mPage: [],
    pageData: {},
    sPages: [{
      pageName: 'tabPanel'
    }],
    showModalBox: false,
    animationData: {},
    reqData:oClass.pSuccess
  },

  onLoad: function (options) {
    var that = this;
    if (checkRols(1,app.roleData.user)) {       //单位名等于用户ID则为创始人
      updateData(true,'service');
    };
  },

  fSubmit: fSubmit

})

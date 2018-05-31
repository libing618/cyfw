//调整当日成品生产计划
const AV = require('../../libs/leancloud-storage.js');
const { checkRols } =  require('../../model/initForm');;
const {hTabClick} = require('../../libs/util.js');
const {f_modalRecordView} = require('../../model/controlModal');
const oClass = require('../../model/procedureclass.js').prodesign;
var app = getApp();

Page({
  data: {
    pNo: 'prodesign',                       //流程的序号
    pw: app.sysinfo.pw,
    ht:{
      navTabs: oClass.afamily,
      fLength: 2,
      pageCk: 0
    },
    cPage: [[],[]],
    pageData: {},
    sPages: [{
      pageName: 'tabPanel'
    }],
    showModalBox: false,
    animationData: {},
    reqData:oClass.pSuccess
  },

  onLoad: function (ops) {        //传入参数为pNo,不得为空
    var that = this;
    if (checkRols(1,app.roleData.user)) {  //检查用户操作权限
      updateTodo(that,'prodesign');
    };
  },

  onReady: function () {
                           //更新缓存以后有变化的数据
  },
  onPullDownRefresh: function () {
    updateTodo(this,'prodesign');;
  },
  onReachBottom: function () {
    updateTodo(this,'prodesign');;
  },
  onShareAppMessage: require('../../model/initForm').shareMessage
})

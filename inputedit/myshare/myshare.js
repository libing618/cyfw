//共享信息管理
const { checkRols } =  require('../../model/initForm');
const { initupdate } =  require('../../model/initupdate');
const {f_modalRecordView,f_modalSwitchBox} = require('../../model/controlModal');
const { initData } = require('../import/unitEdit');
const oClass = require('../../model/procedureclass.js').share;
var app = getApp()
Page({
  data: {
    pNo: 'share',                       //流程
    pw: app.sysinfo.pw,
    ht:{
      navTabs: oClass.afamily,
      modalBtn: ['可以开始','等待订单','停止服务'],
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
      updateData(true,'share').then(()=>{
        let pageData = {};
        oClass.afamily.forEach((afamily,i)=>{
          app.mData.share[app.roleData.uUnit.objectId][i].forEach(ufod=>{
            pageData[ufod] = {uName:app.aData.share[ufod].uName,thumbnail:app.aData.share[ufod].thumbnail};
            pageData[ufod].title = pageSuccess[1].p+app.aData.unfinishedorder[ufod].amount +'/'+ pageSuccess[2].p+app.aData.unfinishedorder[ufod].amount;
          })
        })
        that.setData({
          cPage: app.mData.share[app.roleData.uUnit.objectId],
          pageData: pageData
        });
      }).catch( console.error );
    };
  },

  hTabClick: hTabClick,

  f_modalSwitchBox: f_modalSwitchBox,

  fRegisterShare: function({currentTarget:{id}}){
    var that = this;
    switch (id) {
      case 'fSave':
        updateData(true,'asset').then(()=>{
          let services = new Set();
          app.mData.asset[app.roleData.uUnit.objectId].forEach(asId=>{
            services.add(app.aData.asset[asId].manageParty)
          });
          services = services.map(suId=>{ return updateData(true,'service'),suId});
          return new Promise.all(services).then(()=>{

          })
        })
        break;
      default:
        wx.navigateBack({ delta: 1 });
    }
  }

})

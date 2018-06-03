//共享信息管理
const { checkRols } =  require('../../model/initForm');
const {f_modalRecordView} = require('../../model/controlModal');
const { initData } = require('../import/unitEdit');
const oClass = require('../../model/procedureclass.js').service;
var app = getApp()
Page({
  data: {
    pNo: 'service',                       //流程
    pw: app.sysinfo.pw,
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
    if (checkRols(3,app.roleData.user)) {       //单位名等于用户ID则为创始人
      let reqDatas = require('../../model/procedureclass.js')[0].pSuccess;
      let aList = require('../../model/procedureclass.js')[0].afamily;
      reqDatas.unshift({ gname: "afamily", p: '单位类型', t: "listsel", aList: aList })
      wx.setNavigationBarTitle({ title: app.roleData.uUnit.uName + '的信息', })
      new AV.Query('sengpi')
        .equalTo('unitId', app.roleData.uUnit.objectId)
        .equalTo('dProcedure', 0)
        .select(['dObject', 'cInstance', 'dObjectId', 'cManagers'])
        .descending('createdAt')
        .first().then((rdata) => {
          if (rdata) {
            var spdata = rdata.toJSON();
            that.data.vData = spdata.dObject;
            that.data.unEdit = spdata.cInstance > 0 && spdata.cInstance < spdata.cManagers.length;        //流程起点或已结束才能提交
          };
          that.data.dObjectId = app.roleData.user.unit;
          initData(reqDatas, that.data.vData).then(({ reqData, vData, funcArr }) => {
            funcArr.forEach(functionName => { that[functionName] = wImpEdit[functionName] });
            that.data.reqData = reqData;
            that.data.vData = vData;
            that.setData(that.data);
          });
        }).catch(console.error)
    };
  },

  updateService: function(pNo) {    //更新页面显示数据
    var that = this;
    return new Promise((resolve, reject) => {
      var umdata = new Array(oClass.afamily.length);
      umdata.fill([]);
      var readProcedure = new AV.Query('service');                                      //进行数据库初始化操作
      var unitId = uId ? uId : app.roleData.uUnit.objectId;
      readProcedure.equalTo('unitId', unitId);                //除权限和文章类数据外只能查指定单位的数据
      readProcedure.greaterThan('startDate', new Date());
      readProcedure.lessThan('endDate', new Date());          //查询本地最新时间后修改的记录
      readProcedure.ascending('updatedAt');           //按更新时间升序排列
      readProcedure.limit(1000);                      //取最大数量
      readProcedure.find().then(results => {
        var lena = results.length;
        if (lena > 0) {
          let aProcedure,aData = {};
          for (let i = 0; i < lena; i++) {
            aProcedure = results[i].toJSON();
            umdata[aProcedure.afamily].unshift(aProcedure.objectId);
            aData[aProcedure.objectId] = aProcedure;                        //将数据对象记录到本机
          };
          that.setData({
            cPage: umdata,
            pageData: aData
          })
        };
        resolve(lena > 0);               //数据更新状态
      }).catch(error => {
        if (!that.netState) { wx.showToast({ title: '请检查网络！' }) }
      });
    }).catch(console.error);
  },

  fSubmit: fSubmit

})

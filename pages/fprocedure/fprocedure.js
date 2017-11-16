// 通用的内容编辑pages
const weImp = require('../../libs/weimport.js');
var app = getApp()
var sPage = {
  data: {
    selectd: -1,                       //详情项选中字段序号
    enMenu: 'none',                  //‘插入、删除、替换’菜单栏关闭
    enIns: true,                  //插入grid菜单组关闭
    pNo: 1,                       //流程的序号
    targetId: '0',              //流程申请表的ID
    dObjectId: '0',             //已建数据的ID作为修改标志，0则为新建
    vData: {},
    reqData: []
  },
  titleName: '的',
  onLoad: function (options) {        //传入参数为tgId或artId,不得为空
    var that = this;
    let aaData;
    that.data.uEV = app.globalData.user.emailVerified;            //用户已通过单位和职位审核
    return new Promise((resolve, reject) => {
      if (typeof options.tgId == 'string') {                   //传入参数含审批流程ID，则为编辑审批中的数据
        if (app.procedures[options.tgId].length>0) {
          aaData = app.procedures[options.tgId].dObject;
          that.data.targetId = options.tgId;
          resolve({pNo:app.procedures[options.tgId].dProcedure,pId:app.procedures[options.tgId].dObjectId});
        } else { reject() };
      } else {
        let pno = Number(options.pNo);
        let artid = Number(options.artId);
        if (isNaN(pno)) {
          reject();
        } else {
          resolve({ pNo: pno, pId: isNaN(artid) ? options.artId : artid });
        };
      }
    }).then(ops=>{
      var pClass = require('../../libs/procedureclass.js')[ops.pNo];
      that.data.reqData = pClass.pSuccess;
      that.data.reqData.forEach(upSuccess => {
        let functionName = 'i_' + upSuccess.t;             //每个输入类型定义的字段长度大于2则存在对应处理过程
        if (functionName.length > 4) {
          that[functionName] = weImp[functionName];
          if (functionName == 'i_eDetail') {
            that.farrData = weImp.farrData;
            that.i_insdata = weImp.i_insdata;
          }
        };
      })
      that.data.pNo = ops.pNo;
      switch (typeof ops.pId){
        case 'number':           //传入参数为一位数字的代表类型
          that.data.dObjectId = pClass.pModle + ops.pId;      //根据类型建缓存KEY
          that.data.vData.afamily = ops.pId;       //未提交或新建的类型
          that.titleName += pClass.afamily[ops.pId]
          break;
        case 'string':                   //传入参数为已发布ID，重新编辑已发布的数据
          that.data.dObjectId = ops.pId;
          that.titleName += pClass.pName;
          break;
        case 'undefined':               //未提交或新建的数据KEY为审批流程pModle的值
          that.data.dObjectId = pClass.pModle;
          that.titleName += pClass.pName;
          break;
      }
      aaData = typeof aaData == 'undefined' ? app.aData[ops.pNo][that.data.dObjectId] : aaData;
      weImp.initData(that,aaData);
    }).catch((error)=>{
      console.log(error)
      wx.showToast({ title: '数据传输有误，请联系客服！', duration: 2500 });
   //   setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
    });
  },

  onReady: function(){
    let cUnitName = this.data.targetId == '0' ? app.globalData.user.emailVerified ? app.uUnit.nick : '体验用户' : app.procedures[this.data.targetId].unitName;               //申请单位名称
    wx.setNavigationBarTitle({
      title: cUnitName + this.titleName,
    })
  }
};
sPage['fSubmit'] = weImp.fSubmit;

Page(sPage)

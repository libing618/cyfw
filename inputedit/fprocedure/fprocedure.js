// 通用的内容编辑pages
const wImpEdit = require('../import/impedit.js');
<<<<<<< HEAD
const { initData, appDataExist} = require('../../model/initupdate');
=======
const {initData} = require('../../model/initupdate');
>>>>>>> 73d0481123a594e248fe4f76b0c8fb58f01e9602
var app = getApp()
Page({
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
<<<<<<< HEAD

=======
>>>>>>> 73d0481123a594e248fe4f76b0c8fb58f01e9602
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
      var pClass = require('../../model/procedureclass.js')[ops.pNo];
<<<<<<< HEAD
      let titleName = '的'               //申请项目名称
=======
      let cUnitName = '的'               //申请单位名称
>>>>>>> 73d0481123a594e248fe4f76b0c8fb58f01e9602
      switch (typeof ops.pId){
        case 'number':           //传入参数为一位数字的代表该类型新建数据或读缓存数据
          that.data.dObjectId = pClass.pModle + ops.pId;      //根据类型建缓存KEY
<<<<<<< HEAD
          aaData = appDataExist(pClass.pModle, app.uUnit.objectId, that.data.dObjectId) ? app.aData[pClass.pModle][app.uUnit.objectId][pClass.pModle + ops.pId] : {};
=======
          that.data.vData.afamily = ops.pId;       //未提交或新建的类型
          aaData = app.aData[pClass.pModle][app.uUnit.id][pClass.pModle + ops.pId] ;
>>>>>>> 73d0481123a594e248fe4f76b0c8fb58f01e9602
          titleName += pClass.afamily[ops.pId]
          break;
        case 'string':                   //传入参数为已发布ID，重新编辑已发布的数据
          that.data.dObjectId = ops.pId;
<<<<<<< HEAD
          if (typeof aaData == 'undefined') { aaData = appDataExist(pClass.pModle, app.uUnit.objectId, that.data.dObjectId) ? app.aData[pClass.pModle][app.uUnit.objectId][that.data.dObjectId] : {};}
=======
          if (typeof aaData == 'undefined'){ aaData = app.aData[pClass.pModle][app.uUnit.id][that.data.dObjectId] ;}
>>>>>>> 73d0481123a594e248fe4f76b0c8fb58f01e9602
          titleName += pClass.pName;
          break;
        case 'undefined':               //未提交或新建的数据KEY为审批流程pModle的值
          that.data.dObjectId = pClass.pModle;
<<<<<<< HEAD
          aaData = appDataExist(pClass.pModle, app.uUnit.objectId, pClass.pModle) ? app.aData[pClass.pModle][app.uUnit.objectId][pClass.pModle] : {} ;
          titleName += pClass.pName;
          break;
      }//require('../../test/cp.js')
      initData(pClass.pSuccess, aaData).then(dInit=>{
        dInit.funcArr.forEach(functionName => {
=======
          aaData = app.aData[pClass.pModle][app.uUnit.id][pClass.pModle] ;
          titleName += pClass.pName;
          break;
      }
      initData(pClass.pSuccess,require('../../test/cp.js').then({that.data.reqData,that.data.vData,funcArr}=>{
        funcArr.forEach(functionName => {
>>>>>>> 73d0481123a594e248fe4f76b0c8fb58f01e9602
          that[functionName] = wImpEdit[functionName];
          if (functionName == 'i_eDetail') {             //每个输入类型定义的字段长度大于2则存在对应处理过程
            that.farrData = wImpEdit.farrData;
            that.i_insdata = wImpEdit.i_insdata;
          }
        });
        that.data.pNo = ops.pNo;
<<<<<<< HEAD
        that.data.reqData = dInit.req;
        that.data.vData = dInit.vData;
        that.setData(that.data);
        titleName = (typeof options.tgId == 'string') ? app.procedures[that.data.targetId].unitName : (app.globalData.user.emailVerified ? app.uUnit.nick : '体验用户') + titleName;
        wx.setNavigationBarTitle({ title: titleName });
      })
=======
        that.setData(that.data) ;
        wx.setNavigationBarTitle({
          title: typeof options.tgId == 'string' ? app.procedures[this.data.targetId].unitName : (app.globalData.user.emailVerified ? app.uUnit.nick : '体验用户)' + titleName,
        })
      });
>>>>>>> 73d0481123a594e248fe4f76b0c8fb58f01e9602
    }).catch((error)=>{
      console.log(error)
      wx.showToast({ title: '数据传输有误',icon:'loading', duration: 2500 });
      setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
    });
<<<<<<< HEAD
  },

  fSubmit: wImpEdit.fSubmit
=======
  }

};
sPage['fSubmit'] = wImpEdit.fSubmit;
>>>>>>> 73d0481123a594e248fe4f76b0c8fb58f01e9602

})

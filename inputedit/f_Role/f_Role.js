//单位信息编辑
const AV = require('../../libs/leancloud-storage.js');
<<<<<<< HEAD
const { initData } = require('../../model/initupdate');
=======
const {initData} = require('../../model/initupdate');
>>>>>>> 73d0481123a594e248fe4f76b0c8fb58f01e9602
const wImpEdit = require('../import/impedit');
var app = getApp()
Page({
  data: {
    pNo: 0,                       //流程的序号
    targetId: '0',              //流程申请表的ID
    dObjectId: '0',             //已建数据的ID作为修改标志，0则为新建
    vData: {},                 //编辑值的对象
    unEdit: false,           //新建信息页面,可以提交和保存
    reqData: []
  },

  onLoad: function (options) {
    var that = this;
<<<<<<< HEAD
    if (app.uUnit.name == app.globalData.user.objectId) {       //单位名等于用户ID则为创始人
      reqDatas = require('../../../model/procedureclass.js')[0].pSuccess;
      let aList = require('../../../model/procedureclass.js')[0].afamily;
      reqDatas.unshift({ gname: "afamily", p: '单位类型', t: "arrsel", alist: aList })
      wx.setNavigationBarTitle({ title: app.uUnit.nick + '的信息', })
      new AV.Query('sengpi')
        .equalTo('unitId', app.uUnit.objectId)
        .equalTo('dProcedure', 0)
        .select(['dObject', 'cInstance', 'dObjectId', 'cManagers'])
        .descending('createdAt')
        .first().then((rdata) => {
          if (rdata) {
            var spdata = rdata.toJSON();
            that.data.dObjectId = spdata.dObjectId
            that.data.vData = spdata.dObject;
            that.data.unEdit = spdata.cInstance > 0 && spdata.cInstance < spdata.cManagers.length;        //流程起点或已结束才能提交
          };
          initData(reqDatas, that.data.vData).then((reqData, vData, funcArr)=>{
            funcArr.forEach(functionName => { that[functionName] = wImpEdit[functionName] });
            that.setData({ reqData,vData });
          });
      }).catch(console.error )
    } else {
    wx.showToast({ title: '您不是单位创始人，请在《我的信息》页创建单位！', icon: 'none', duration: 2500 });
    setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
=======
    if (app.uUnit.name == app.globalData.user.objectId){       //单位名等于用户ID则为创始人
      reqDatas = require('../../../model/procedureclass.js')[0].pSuccess;
      let aList = require('../../../model/procedureclass.js')[0].afamily;
      reqDatas.unshift({ gname: "afamily", p: '单位类型', t: "arrsel", alist:aList })
      wx.setNavigationBarTitle({  title: app.uUnit.nick+'的信息',  })
      new AV.Query('sengpi')
      .equalTo('unitId', app.uUnit.objectId)
      .equalTo('dProcedure',0)
      .select(['dObject','cInstance', 'dObjectId', 'cManagers'])
      .descending('createdAt')
      .first().then((rdata) => {
        if (rdata) {
          var spdata = rdata.toJSON();
          that.data.dObjectId = spdata.dObjectId
          that.data.vData = spdata.dObject;
          that.data.unEdit = spdata.cInstance>0 && spdata.cInstance<spdata.cManagers.length;        //流程起点或已结束才能提交
  //        that.data.vData.aGeoPoint = new AV.GeoPoint(that.data.vData.aGeoPoint);
//          app.aData[spdata.objectId] = spdata;
        };
        initData(reqDatas,that.data.vData).then( {that.data.reqData,that.data.vData,funcArr}=>{
          funcArr.forEach(functionName => { that[functionName] = wImpEdit[functionName] };
          that.setData(that.data) ;
        });
      }).catch( console.error )
    } else {
      wx.showToast({ title: '您不是单位创始人，请在《我的信息》页创建单位！',icon:'none',duration: 2500 });
      setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
>>>>>>> 73d0481123a594e248fe4f76b0c8fb58f01e9602
    }
  },

<<<<<<< HEAD
  fSubmit: wImpEdit.fSubmit
=======
uniteditPage.fSubmit = wImpEdit.fSubmit;
>>>>>>> 73d0481123a594e248fe4f76b0c8fb58f01e9602

})
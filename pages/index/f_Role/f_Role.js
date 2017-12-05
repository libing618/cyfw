// pages/f_Role/f_Role.js单位信息编辑
const AV = require('../../../libs/leancloud-storage.js');
const weImp = require('../../../libs/weimport.js');
var app = getApp()
var uniteditPage = {
  data: {
    pNo: 0,                       //流程的序号
    targetId: '0',              //流程申请表的ID
    dObjectId: '0',             //已建数据的ID作为修改标志，0则为新建
    vData: require('../../../test/irole.js'),                 //编辑值的对象
    unEdit: false,           //新建信息页面,可以提交和保存
    reqData: []
  },

  onLoad: function(options) {
    var that = this;
    if (app.uUnit.name == app.globalData.user.objectId){       //单位名等于用户ID则为创始人
      that.data.reqData = require('../../../model/procedureclass.js')[0].pSuccess;
      let aList = require('../../../model/procedureclass.js')[0].afamily;
      that.data.reqData.unshift({ gname: "afamily", p: '单位类型', t: "arrsel", alist:aList })
      wx.setNavigationBarTitle({  title: app.uUnit.nick+'的信息',  })
  //    new AV.Query.doCloudQuery('select dObject,cInstance,dObjectId,cManagers from sengpi where unitId="' + app.uUnit.objectId + '" and dProcedure=0')
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
            that.data.reqData[8].e = app.sUnit.uName;
            that.data.unEdit = spdata.cInstance>0 && spdata.cInstance<spdata.cManagers.length;        //流程起点或已结束才能提交
            that.data.vData.aGeoPoint = new AV.GeoPoint(that.data.vData.aGeoPoint);
            app.aData[spdata.objectId] = spdata;
            that.setData(that.data) ;
          } else {
            weImp.initData(that,that.data.vData)//app.aData[0][app.uUnit.objectId]);
          };
        }).catch( console.error )
      that.data.reqData.forEach(upSuccess => {
        let functionName = 'i_' + upSuccess.t;             //每个输入类型定义的字段长度大于2则存在对应处理过程
        if (functionName.length > 4) { that[functionName] = weImp[functionName] };
      })
    } else {
      wx.showToast({ title: '您不是单位创始人，请在《我的信息》页创建单位！',duration: 2500 });
      setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
    }
  }
};

uniteditPage.fSubmit = weImp.fSubmit;

Page(uniteditPage)

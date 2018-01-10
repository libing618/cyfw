// 供货操作
const AV = require('../../libs/leancloud-storage.js');
const prosPlan = require('../../model/prosplan.js');
const Orders = require('../../model/supplies.js');
const { fetchData,checkRols } = require('../../util/util.js');

var app = getApp();
Page ({
  data: {
    oState: 0,                       //流程的序号
    mPage: [],                 //页面管理数组
    dObjectId: '0',             //已建数据的ID作为修改标志，0则为新建
    pageData: []
  },
  specPlans: {},
  supplies: {},

  remove: function(value) {
    stats = this.data.pageData.filter(target => target.id !== value.id)
    return setOrderData(stats)
  },
  upsert: function(value) {
    let existed = false;
    stats = this.data.pageData.map(target => (target.id === value.id ? ((existed = true), value) : target))
    if (!existed) {stats = [value, ...stats]}
    return setOrderData(stats)
  },
  onLoad: function (ops) {        //传入参数为pNo,不得为空06
    var that = this;
    let oClass = require('../../model/operationclass.js')[1];
    if (checkRols(app.globalData.user.userRolName,oClass.ouRoles[ops.oState])){  //检查用户操作权限
      new AV.Query(prosPlan)
      .equalTo('unitId',app.uUnit.objectId)
      .select(['unitId','specObjectId','specStock','payment','delivering'])
      .find().then(specPlans=>{
        if (specPlans){
          that.specPlans = specPlans;
          specPlans.forEach(specPlan=>{ that.data.specCount[specPlan.specObjectId] = specPlan.specStock });
          that.setData({specCount:that.data.specCount});
        } else {
          wx.showToast({ title: '无库存数据！', duration: 2500 });
          setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
        }
      }).catch(console.error);
      wx.setNavigationBarTitle({
        title: app.uUnit.nick+'的'+oClass.oprocess[ops.oState]
      });
      let supplieQuery = new AV.Query(supplies)


      supplieQuery.edoesNotExist('confirmer')      //查询确认人为空的记录
      supplieQuery.select(['tradeId','quantity','proName','specObjectId','specName','address','paidAt'])
      supplieQuery.ascending('paidAt');           //按付款时间升序排列



      
      return Promise.all([orderQuery.find().then(setOrderData),orderQuery.subscribe()]).then((untreatedOrders,subscription) => {
        that.subscription = subscription;
        that.subscription.on('create', that.upsert)
        that.subscription.on('update', that.upsert)
        that.subscription.on('enter', that.upsert)
        that.subscription.on('leave', that.remove)
        that.subscription.on('delete', that.remove)
      }).catch(console.error);
    } else {
      wx.showToast({ title: '权限不足，请检查！', duration: 2500 });
      setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
    };
  },
  onUnload: function(){
    this.subscription.unsubscribe();
    this.subscription.off('create', this.upsert)
    this.subscription.off('update', this.upsert)
    this.subscription.off('enter', this.upsert)
    this.subscription.off('leave', this.remove)
    this.subscription.off('delete', this.remove)
  },

  idcheck: require('../../util/util.js').idcheck,

  fOrder: function(e){
    var that = this;
    wx.scanCode({
      success: function(resCode){
        that.setData({c:resCode.result});
      }
    })
  },

  onShareAppMessage: function () {    // 用户点击右上角分享
    return {
      title: '侠客岛创业服务平台', // 分享标题
      desc: '扶贫济困，共享良品。', // 分享描述
      path: '/pages/index/index' // 分享路径
    }
  }
})

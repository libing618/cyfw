// 订单确认
const AV = require('../../libs/leancloud-storage.js');
const prosPlan = require('../../model/prosplan.js');
const supplies = require('../../model/supplies.js');
const { fetchData } = require('../../util/util.js');
const setOrderData = untreatedsupplies =>{
  let inArr = [];
  let mpage = untreatedsupplies.map(uOrder=>{
    if (inArr.indexOf(uOrder[this.data.req.gname])<0) { inArr.push(uOrder[this.data.req.gname])};
    return uOrder.tradeId});
  new AV.Query(prosPlan).find().then((plans)=>{
    let prosdata={};
    plans.forEach(plan=>{ prosdata[plan.proObjectId] = plan})
    this.setData({
      pageData: untreatedsupplies,
      pros: prosdata,
      mPage: mpage
    });
  }).catch(console.error);
  return untreatedsupplies;
};
var app = getApp();
Page ({
  data: {
    mPage: [],                 //页面管理数组
    achecked: '0',
    pageData: [],
    specCount: {}
  },
  specPlans: {},
  supplies: {},

  remove: function(value) {
    stats = this.data.pageData.filter(target => target.id !== value.id)
    return setOrderData(stats)
  },
  upDateConfim: function() {
    var that = this;
    supplieQuery = new AV.Query(supplies)
    supplieQuery.equalTo('unitId',app.uUnit.objectId)
    supplieQuery.edoesNotExist('confirmer')      //查询确认人为空的记录
    supplieQuery.select(['tradeId','quantity','proName','specObjectId','specName','address','paidAt'])
    supplieQuery.ascending('paidAt');           //按付款时间升序排列
    .find().then(confirmOrder => {
      if (confirmOrder){
        let cSpec = [],cantSpec = {},mData = {},mChecked = {};
        confirmOrder.forEach(cOrder=>{
          that.supplies[cOrder.objectId] = cOrder;
          if ( cSpec.indexOf(cOrder.specObjectId)<0 ) {
            cSpec.push(cOrder.specObjectId);
            cantSpec[cOrder.specObjectId)] = cOrder.quantity;
            mData[cOrder.specObjectId] = [cOrder.objectId]
          } else {
            cantSpec[cOrder.specObjectId)] += cOrder.quantity;
            mData[cOrder.specObjectId].push([cOrder.objectId])
          };
          mChecked[cOrder.objectId] = true;
        })
        that.setData({
          pageData: that.supplies,
          oArray: cSpec,
          quantity: cantSpec,
          mPage: mData,
          mCheck: mChecked
        })
      } else {
        wx.showToast({ title: '没有新订单！', duration: 2500 });
      }
    }).catch(console.error);
  },
  onLoad: function (ops) {
    var that = this;
    if (weutil.checkRols(app.globalData.user.userRolName,0)){  //检查用户为综合条线或创始人
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
        title: app.uUnit.nick+'的订单确认'
      });
    } else {
      wx.showToast({ title: '权限不足，请检查！', duration: 2500 });
      setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
    };
  },

  idcheck: require('../../util/util.js').idcheck,

  fOrder: function(e){
    var that = this;
    let specId = e.currentTarget.id;
    let confimate = that.data.quantity[specId];
    let setSingle = [];
    that.specPlans[specId].set('specStock':that.specPlans[specId].specStock-confimate);
    that.specPlans[specId].set('payment':that.specPlans[specId].payment-confimate);
    that.specPlans[specId].set('delivering':that.specPlans[specId].delivering+confimate);
    that.specPlans[specId].save().then(()=>{
      that.data.mPage[specId].forEach(cId=>{
        that.supplies[cId].set();

      })
      e.detail.value['chSpec-'+specId].forEach(chSpec=>{})
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

// 订单确认
const AV = require('../../libs/leancloud-storage.js');
const prosPlan = require('../../model/prosplan.js');
const supplies = require('../../model/supplies.js');

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
    pageData: []
  },

  remove: function(value) {
    stats = this.data.pageData.filter(target => target.id !== value.id)
    return setOrderData(stats)
  },
  upDateConfim: function() {
    var that = this;
    new AV.Query(supplies)
      .edoesNotExist('confirmer')      //查询确认人为空的记录
      .select(['tradeId','quantity','proName','specObjectId','specName','address','paidAt'])
      .ascending('paidAt');
      .find().then(confirmOrder => {
        if (confirmOrder){
          let cSpec = [],cantSpec = {},pData = {},mData = {},mChecked = {};
          confirmOrder.forEach(cOrder=>{
            pData[cOrder.objectId] = cOrder;
            if ( cSpec.indexOf(cOrder.specObjectId)<0 ) {
              cSpec.push(cOrder.specObjectId);
              cantSpec[cOrder.specObjectId)] = cOrder.quantity;
              mData[cOrder.specObjectId] = [cOrder.objectId]
            } else {
              cantSpec[cOrder.specObjectId)] += cOrder.quantity;
              mData[cOrder.specObjectId].push([cOrder.objectId])
            };
            pData[cOrder.objectId].checked = true;
          })
          that.setData({
            pageData: pData,
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
  onLoad: function (ops) {        //传入参数为pNo,不得为空06
    var that = this;
    if (weutil.checkRols(app.globalData.user.userRolName,0)){  //检查用户为综合条线或创始人
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

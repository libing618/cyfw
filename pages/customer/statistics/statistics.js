//订单统计
const AV = require('../../../libs/leancloud-storage.js');
const orders = require('../../../model/supplies');
const { updateData,formatTime } = require('../../../util/util.js');
var app = getApp();

Page({
  data:{
    reqData: [{ gname:"seDate", p:'起止日期', t:"sedate",endif:false}],
    vData: {},
    achecked: ''
  },
  onLoad:function(options){
    var that = this;
    if ( app.globalData.user.userRolName == 'admin' && app.globalData.user.emailVerified) {
      updateData(true,3).then(proData=>{
        if (proData){
          that.data.mPage = proData.mPage[0];
          that.data.pageData = app.aData[3];
          updateData(true,4).then(specData=>{
            if(specData){
              that.data.specData = app.aData[4];
              let shelves={};
              that.data.mPage.forEach(pObjectId=>{
                shelves[pObjectId] = specData.mPage.filter(spec => {that.data.specPage[spec].proObjectId==pObjectId})
              })
              that.data.specPage = shelves;
            }
          }).catch(console.error);
        }
      }).catch(console.error);
    } else {
      wx.showToast({ title: '权限不足，请检查！', duration: 2500 });
      setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
    };
  },
  onReady:function(){
    var that = this;
    that.data.vData.start_end = [formatTime(Date.now() - 864000000, true), formatTime(Date.now(), true)];
    that.sumOrders();
  },
  i_sedate: require('../../../libs/weimport.js').i_sedate,
  idcheck: require('../../../util/util.js').idcheck,
  sumOrders:function(){
    var that = this;
    new AV.Query(orders)
    .equalTo('unitId', app.uUnit.objectId)
    .greaterThan('updatedAt', new Date(that.data.vData.seDate[0]))
    .lessThan('updatedAt', new Date(that.data.vData.seDate[1])+86400000)
    .limit(1000)
    .find().then(orderlist=>{
      if (orderlist) {
        that.data.mPage.forEach(proObjectId=>{
          let sumPro = 0;
          that.data.specPage[proObjectId].forEach(specObjectId=>{
            let sumOrder = 0, specOrder = [];
            orderlist.forEach(order=>{
              if (order.specObjectId==specObjectId) {
                specOrder.push(order);
                sumOrder += order.amount};
            })
            that.data.specOrder = specOrder;
            that.data.sumspec[specObjectId] = sumOrder;
            sumPro += sumOrder;
          })
          that.data.sumpro[proObjectId] = sumPro;
        })
        that.setData(that.data);
      }
    }).catch(console.error);
  },
  orderquery:function(e){
    this.sumOrders;
  }

})

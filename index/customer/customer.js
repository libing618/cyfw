const { updateData, appDataExist, integration } = require('../../model/initupdate.js');
const {iMenu, cargoSum, indexClick} = require('../../util/util.js');

var app = getApp()
Page({
  data:{
    mPage: [],
    pNo: 5,                       //流程的序号5为成品信息
    pageData: {},
    iClicked: '0',
    grids:[]
  },
  onLoad:function(options){
    var that = this ;
    let pageSetData = {};
    cargoSum(['canSupply', 'reserve', 'payment', 'delivering', 'delivered']).then(cSum=>{
      pageSetData.pandect = cSum.rSum;
      pageSetData.mSum = cSum.mSum;
    });
    pageSetData.grids = iMenu('customer');          //更新数据
    if (appDataExist('cargo',app.uUnit.objectId)){
      pageSetData.mPage = app.mData.product[app.uUnit.objectId];
      pageSetData.pageData = app.aData.product[app.uUnit.objectId];
      pageSetData.cargo = app.aData.cargo[app.uUnit.objectId];
    }
    that.setData( pageSetData );
  },

  setPage: function(iu){
    if (iu){
      cargoSum(['canSupply', 'reserve', 'payment', 'delivering', 'delivered']).then(cSum=>{
        this.setData({
          cargo:app.aData.cargo[app.uUnit.objectId],
          pandect:cSum.rSum,
          mSum: cSum.mSum
        })
      })
    }
  },

  onReady:function(){
    integration('cargo',app.uUnit.objectId).then(isupdated=>{
      if (isupdated) {
        cargoSum(['canSupply', 'reserve', 'payment', 'delivering', 'delivered']).then(cSum=>{
          this.setData({
            mPage:app.mData.product[app.uUnit.objectId],
            pageData:app.aData.product[app.uUnit.objectId],
            cargo:app.aData.cargo[app.uUnit.objectId],
            pandect:cSum.rSum,
            mSum: cSum.mSum
          })
        })
      }
    });
    wx.setNavigationBarTitle({
      title: app.globalData.user.emailVerified ? app.uUnit.uName+'的销售管理' : '用户体验产品销售',
    })
  },

  indexClick:indexClick,

  onPullDownRefresh: function() {
    updateData(true,5).then(isupdated=>{ this.setPage(isupdated) });
  },
  onReachBottom: function() {
    updateData(false,5).then(isupdated=>{ this.setPage(isupdated) });
  },
  onShareAppMessage: function() {
    // 用户点击右上角分享
    return {
      title: '侠客岛创业服务平台', // 分享标题
      desc: '扶贫济困，共享良品。', // 分享描述
      path: '/index/manage/manage' // 分享路径
    }
  }
})

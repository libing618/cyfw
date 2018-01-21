const {iMenu,pName} = require('../../util/util');
const { updateData } = require('../../model/initupdate');
var app = getApp();
Page({
  data:{
    mPage: [],
    pNo: 6,                       //流程的序号6为商品信息
    pageData: {},
    wWidth: app.globalData.sysinfo.windowWidth,
    grids: []
  },
  onLoad:function(options){    // 生命周期函数--监听页面加载
    var that = this;
    let pageSetData = pName(6);
    pageSetData.pandect = [app.mData.goods[app.uUnit.id].length,app.mData.specs[app.uUnit.id].length];
    pageSetData.grids = iMenu('plan');          //更新数据
    that.setData( pageSetData )
  },

  setPage: function(iu){
    if (iu){
      this.setData({
        mPage:app.mData.goods[app.uUnit.id],
        pageData:app.aData.goods[app.uUnit.id],
        pandect:[app.mData.goods[app.uUnit.id].length,app.mData.specs[app.uUnit.id].length]
      })
    }
  },

  onReady: function(){
    updateData(true,6).then(isupdated=>{ this.setPage(isupdated) });              //更新缓存以后有变化的数据
    wx.setNavigationBarTitle({
      title: app.globalData.user.emailVerified ? app.uUnit.uName+'的产品' : '用户体验产品服务',
    })
  },

  onPullDownRefresh:function(){
    updateData(true,6).then(isupdated=>{ this.setPage(isupdated) });
  },
  onReachBottom:function(){
    updateData(false,6).then(isupdated=>{ this.setPage(isupdated) });
  },
  onShareAppMessage: function() {    // 用户点击右上角分享
    return {
      title: '侠客岛创业服务平台', // 分享标题
      desc: '扶贫济困，共享良品。', // 分享描述
      path: '/index/manage/manage' // 分享路径
    }
  }
})

const {iMenu} = require('../../util/util');
const { updateData } = require('../../model/initupdate');
const { integration,unitData } = require('../../model/initForm.js');
var app = getApp();
Page({
  data:{
    mPage: [],
    pNo: 'goods',                       //商品信息
    pageData: {},
    wWidth: app.globalData.sysinfo.windowWidth,
    grids: iMenu('plan')
  },
  onLoad:function(options){    // 生命周期函数--监听页面加载
    this.setPage(app.mData.goods[app.roleData.uUnit.objectId]);
  },

  setPage: function(iu){
    if (iu){
      this.setData({
        mPage:app.mData.goods[app.roleData.uUnit.objectId],
        pageData:unitData('goods'),
        pandect:[app.mData.goods[app.roleData.uUnit.objectId].length,app.mData.specs[app.roleData.uUnit.objectId].length]
      })
    }
  },

  onReady: function(){
    integration('specs',app.roleData.uUnit.objectId).then((isupdated)=>{ this.setPage(isupdated) });              //更新缓存以后有变化的数据
    wx.setNavigationBarTitle({
      title: app.globalData.user.emailVerified ? app.roleData.uUnit.uName+'的商品' : '用户体验产品服务',
    })
  },

  onPullDownRefresh:function(){
    updateData(true,'goods').then(isupdated=>{ this.setPage(isupdated) });
  },

  onReachBottom:function(){
    updateData(false,'goods').then(isupdated=>{ this.setPage(isupdated) });
  },

  onShareAppMessage: function() {    // 用户点击右上角分享
    return {
      title: '侠客岛创业服务平台', // 分享标题
      desc: '扶贫济困，共享良品。', // 分享描述
      path: '/index/manage/manage' // 分享路径
    }
  }
})

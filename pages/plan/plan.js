const { updateData } = require('../../model/initupdate');
const { integration,unitData } = require('../../model/initForm.js');
var app = getApp();
Page({
  data:{
    mPage: [],
    pNo: 'goods',                       //商品信息
    pw: app.sysinfo.pw,
    pageData: {},
    wWidth: app.sysinfo.windowWidth,
    grids: []
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
    integration('goods','specs',app.roleData.uUnit.objectId).then((isupdated)=>{ this.setPage(isupdated) });              //更新缓存以后有变化的数据
    wx.setNavigationBarTitle({
      title: app.roleData.user.emailVerified ? app.roleData.uUnit.uName+'的商品' : '用户体验产品服务',
    });
    this.grids = require('../../libs/allmenu.js').iMenu(app.roleData.wmenu.plan, 'plan');
    this.setData({ grids: this.grids })
  },

  onPullDownRefresh:function(){
    updateData(true,'goods').then(isupdated=>{ this.setPage(isupdated) });
  },

  onReachBottom:function(){
    updateData(false,'goods').then(isupdated=>{ this.setPage(isupdated) });
  },

  onShareAppMessage: require('../../libs/util').shareMessage
})

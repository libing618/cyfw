const { updateData } = require('../../model/initupdate.js');
const { integration,unitData } = require('../../model/initForm.js');
const {iMenu, cargoSum, indexClick} = require('../../util/util.js');

var app = getApp()
Page({
  data:{
    mPage: [],
    pNo: 'cargo',                       //流程的序号5为成品信息
    pageData: {},
    iClicked: '0',
    mSum: {},
    grids:[]
  },
  onLoad:function(options){
    this.setData({ grids: iMenu('production') });          //更新菜单数据
    this.setPage(true);
  },

  setPage: function(iu){
    if (iu){
      cargoSum(['canSupply', 'cargoStock']).then(cSum=>{
        this.setData({
          mPage:app.mData.product[app.roleData.uUnit.objectId],
          pageData:aunitData('product'),
          cargo:unitData('cargo'),
          pandect:cSum.rSum,
          mSum: cSum.mSum
        })
      })
    }
  },

  onReady:function(){
    var that = this;
    integration('cargo',app.roleData.uUnit.objectId).then(isupdated=>{this.setPage(isupdated)});
    wx.setNavigationBarTitle({
      title: app.globalData.user.emailVerified ? app.roleData.uUnit.uName+'的生产管理' : '用户体验产品生产',
    })
  },

  indexClick:indexClick,

  onPullDownRefresh: function() {
    updateData(true,'cargo').then(isupdated=>{ this.setPage(isupdated) });
  },
  onReachBottom: function() {
    updateData(false,'cargo').then(isupdated=>{ this.setPage(isupdated) });
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

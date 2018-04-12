const { cargoSum, updateData } = require('../../model/initupdate.js');
const { integration,unitData } = require('../../model/initForm.js');
const {indexClick} = require('../../libs/util.js');

var app = getApp()
Page({
  data:{
    mPage: app.mData.product[app.roleData.uUnit.objectId],
    pNo: "cargo",                       //流程的序号5为成品信息
    pageData: unitData('cargo'),
    iClicked: '0',
    grids: []
  },
  onLoad:function(options){
    this.setPage(app.mData.product[app.roleData.uUnit.objectId]);

  },

  setPage: function(iu){
    if (iu){
      cargoSum(['sold', 'reserve', 'payment', 'delivering', 'delivered']).then(cSum=>{
        this.setData({
          mPage:app.mData.product[app.roleData.uUnit.objectId],
          pageData:unitData('product'),
          cargo:unitData('cargo'),
          pandect:cSum.rSum,
          mSum: cSum.mSum
        })
      })
    }
  },

  onReady:function(){
    integration("product", "cargo",app.roleData.uUnit.objectId).then(isupdated=>{ this.setPage(isupdated) });
    wx.setNavigationBarTitle({
      title: app.roleData.user.emailVerified ? app.roleData.uUnit.uName+'的销售管理' : '用户体验产品销售',
    });
    this.grids = require('../../libs/allmenu.js').iMenu(app.roleData.wmenu.customer, 'customer');
    this.setData({ grids: this.grids })
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
      path: '/pages/manage/manage' // 分享路径
    }
  }
})

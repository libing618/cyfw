const { cargoSum, updateData } = require('../../model/initupdate.js');
const { integration,unitData } = require('../../model/initForm.js');
const {indexClick} = require('../../libs/util.js');

var app = getApp()
Page({
  data:{
    mPage: [],
    pNo: 'cargo',                       //成品信息
    pw: app.sysinfo.pw,
    pageData: {},
    iClicked: '0',
    mSum: {},
    grids: []
  },
  onLoad:function(options){
    this.setPage(app.mData.product[app.roleData.uUnit.objectId]);
  },

  setPage: function(iu){
    if (iu){
      cargoSum(['canSupply', 'cargoStock']).then(cSum=>{
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
    var that = this;
    integration("product", "cargo",app.roleData.uUnit.objectId).then(isupdated=>{this.setPage(isupdated)});
    wx.setNavigationBarTitle({
      title: app.roleData.user.emailVerified ? app.roleData.uUnit.uName+'的生产管理' : '用户体验产品生产',
    });
    this.grids = require('../../libs/allmenu.js').iMenu(app.roleData.wmenu.production, 'production');
    this.setData({ grids: this.grids })
  },

  indexClick:indexClick,

  onPullDownRefresh: function() {
    updateData(true,'cargo').then(isupdated=>{ this.setPage(isupdated) });
  },
  onReachBottom: function() {
    updateData(false,'cargo').then(isupdated=>{ this.setPage(isupdated) });
  },
  onShareAppMessage: require('../../libs/util').shareMessage
})

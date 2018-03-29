const AV = require('../../libs/leancloud-storage.js');
const { updateData,tabClick } = require('../../model/initupdate');
const { loginAndMenu } = require('../../util/util');
var app = getApp()
Page({
  data: {
    autoplay: true,
    scrollTop : 0,
    mSwiper: app.mData.articles[0],
    scrollHeight: app.globalData.sysinfo.windowHeight-80,
    unAuthorize: app.globalData.user.objectId=='0',
    mPage: [app.mData.articles[1],app.mData.articles[2],app.mData.articles[3]],
    pNo: 'articles',                       //文章类信息
    pageData: {},
    fLength:3,
    tabs: ["品牌建设", "政策扶持", "我的商圈"],
    pageCk: app.mData.pCk1,
    wWidth: app.globalData.sysinfo.windowWidth,
    grids: []
  },

  onLoad: function () {
    var that = this;
    loginAndMenu(app).then(() => {
      if (app.globalData.user.mobilePhoneVerified) {
        wx.showTabBar()
      } else {
        wx.hideTabBar();
      }
      that.grids = require('../../libs/allmenu.js').iMenu(app.roleData.wmenu.manage, 'manage');
      that.grids[0].mIcon = app.globalData.user.avatarUrl;   //把微信头像地址存入第一个菜单icon
      that.setData({
        grids: that.grids,
        mSwiper: app.mData.articles[0],
        mPage: [app.mData.articles[1], app.mData.articles[2], app.mData.articles[3]],
        pageData: app.aData.articles
      })
    });
  },

  setPage: function(iu){
    if (iu){
      this.setData({
        mSwiper: app.mData.articles[0],
        mPage:[app.mData.articles[1],app.mData.articles[2],app.mData.articles[3]],
        pageData:app.aData.articles
      })
    }
  },

  onReady: function(){
    updateData(true,'articles').then(isupdated=>{ this.setPage(isupdated) });        //更新缓存以后有变化的数据    
  },

  userInfoHandler: function (e) {
    var that = this;
    openWxLogin(app).then( (mstate)=> {
      app.logData.push([Date.now(), '用户授权' + app.globalData.sysinfo.toString()]);                      //用户授权时间记入日志
      that.grids = require('../libs/allmenu.js').iMenu(app.roleData.wmenu.manage,'manage');
      that.grids[0].mIcon=app.globalData.user.avatarUrl;   //把微信头像地址存入第一个菜单icon
      that.setData({ unAuthorize: false, grids: that.grids })
    }).catch( console.error );
  },

  tabClick: tabClick,

  onPullDownRefresh:function(){
    updateData(true,'articles').then(isupdated=>{ this.setPage(isupdated) });
  },
  onReachBottom:function(){
    updateData(false,'articles').then(isupdated=>{ this.setPage(isupdated) });
  },
  onShareAppMessage: function() {    // 用户点击右上角分享
    return {
      title: '侠客岛创业服务平台', // 分享标题
      desc: '扶贫济困，共享良品。', // 分享描述
      path: '/index/manage/manage' // 分享路径
    }
  }
})

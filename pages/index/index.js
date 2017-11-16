const weutil = require('../../util/util.js');
var app = getApp()
Page({
  data: {
    autoplay: true,
    scrollTop : 0,
    scrollHeight: app.globalData.sysinfo.windowHeight-80,
    mPage: app.mData.prdct1,
    pNo: 1,                       //流程的序号1为文章类信息
    pageData: {},
    tabs: ["品牌建设", "政策扶持", "我的商圈"],
    userAuthorize: -2,              //中间部分-2显示欢迎词，-1为授权按钮
    pageCk: app.mData.pCk1,
    wWidth: app.globalData.sysinfo.windowWidth,
    grids: []
  },

  onLoad: function () {
    var that = this;
    let mData = wx.getStorageSync('menudata');
    var mUpdateTime = '0';
    if (mData) {            //有菜单缓存则本手机正常使用中必有登录信息
      app.wmenu = mData.initVale;
      mUpdateTime = mData.updatedAt;
      that.data.userAuthorize = 1;
    } else {
      that.data.userAuthorize = app.globalData.user.userAuthorize
    };
    wx.getNetworkType({
      success: function(res) {
        if (res.networkType!='none') {                     //如果有网络
          wx.getSetting({
            success(res) {
              if (res.authSetting['scope.userInfo']) {                   //用户已经同意小程序使用用户信息
                app.openWxLogin(that.data.userAuthorize, mUpdateTime).then( (mstate)=> {
                  app.wmenu[0][0].mIcon = app.globalData.user.avatarUrl;
                  that.setData({ userAuthorize: mstate, grids: app.wmenu[0] })
                  app.logData.push([Date.now(), '系统初始化设备' + app.globalData.sysinfo]);                      //本机初始化时间记入日志
                }).catch((loginErr) => {
                  app.logData.push([Date.now(), '系统初始化失败' + loginErr]);
                });
              } else { that.setData({ userAuthorize:-1 }) }
            }
          });
        }
      }
    });
    if (app.aData[1].length>0) {
      that.setData({ mPage: app.mData.prdct1, pageData: app.aData[1]});
    }
  },

  onReady: function(){
    weutil.updateData(true,1);                       //更新缓存以后有变化的数据
  },
  userInfoHandler: function (e) {
    var that = this;
    app.openWxLogin(that.data.userAuthorize,0).then( (mstate)=> {
      app.logData.push([Date.now(), '用户授权' + app.globalData.sysinfo]);                      //用户授权时间记入日志
      app.wmenu[0][0].mIcon = e.detail.userInfo.avatarUrl;      //把微信头像地址存入第一个菜单icon
      that.setData({ userAuthorize: mstate, grids: app.wmenu[0] })
    }).catch((error) => { console.log(error) });
  },

  tabClick: function (e) {                                //点击tab
    app.mData.pCk1 = Number(e.currentTarget.id)
    this.setData({
      pageCk: app.mData.pCk1                  //点击序号切换
    });
  },

  onPullDownRefresh:function(){
    weutil.updateData(true,1);
  },
  onReachBottom:function(){
    weutil.updateData(false,1);
  },
  onShareAppMessage: function() {    // 用户点击右上角分享
    return {
      title: '侠客岛创业服务平台', // 分享标题
      desc: '扶贫济困，共享良品。', // 分享描述
      path: '/pages/index/index' // 分享路径
    }
  }
})

const { updateData,openWxLogin,fetchMenu } = require('../../util/util.js');
var app = getApp()
Page({
  data: {
    autoplay: true,
    scrollTop : 0,
    scrollHeight: app.globalData.sysinfo.windowHeight-80,
    mPage: app.mData.prdct1,
    pNo: 1,                       //流程的序号1为文章类信息
    pageData: app.aData[1],
    tabs: ["品牌建设", "政策扶持", "我的商圈"],
    userAuthorize: -2,              //中间部分-2显示欢迎词，-1为授权按钮,0为用户授权,1为用户已注册
    pageCk: app.mData.pCk1,
    wWidth: app.globalData.sysinfo.windowWidth,
    grids: app.wmenu.initVale[0]
  },

  onLoad: function () {
    var that = this;
    let mData = wx.getStorageSync('menudata');
    if (mData) {            //有菜单缓存则本手机正常使用中必有登录信息
      fetchMenu().then(()=>{ that.setData({ userAuthorize: 1, grids: app.wmenu.initVale[0] }) })
    } else {
      return Promise.resolve( AV.User.current()).then(lcuser => {           //读缓存登录信息
        if (lcuser) {                //用户如已注册并在本机登录过,则有数据缓存，否则进行注册登录
          app.globalData.user = Object.assign(lcuser.toJSON(),userAuthorize: 0);
          fetchMenu().then(()=>{ that.setData({ userAuthorize: 0, grids: app.wmenu.initVale[0] }) });
        } else {
          wx.getSetting({
            success(res) {
              if (res.authSetting['scope.userInfo']) {                   //用户已经同意小程序使用用户信息
                openWxLogin(that.data.userAuthorize).then( mstate=> {
                  app.logData.push([Date.now(), '系统初始化设备' + app.globalData.sysinfo]);                      //本机初始化时间记入日志
                  fetchMenu().then(()=>{
                    that.setData({ userAuthorize: mstate, grids: app.wmenu.initVale[0] })
                  }).catch((menuErr) => {
                    app.logData.push([Date.now(), '菜单更新失败' + menuErr]);
                  });
                }).catch((loginErr) => {
                  app.logData.push([Date.now(), '系统登录失败' + loginErr]);
                });
              } else { that.setData({ userAuthorize:-1 }) }
            }
          })
        }
      }).catch((lcuErr) => {
        app.logData.push([Date.now(), '注册用户状态错误失败' + lcuErr]);
      })
    };
  },

  onReady: function(){
    updateData(true,1).then(()=>{ this.setData({mPage:app.mData.prdct1, pageData:app.aData[1]}) });                       //更新缓存以后有变化的数据
  },
  userInfoHandler: function (e) {
    var that = this;
    openWxLogin(that.data.userAuthorize).then( (mstate)=> {
      app.logData.push([Date.now(), '用户授权' + app.globalData.sysinfo]);                      //用户授权时间记入日志
      app.wmenu.initValue[0][0].mIcon = e.detail.userInfo.avatarUrl;      //把微信头像地址存入第一个菜单icon
      that.setData({ userAuthorize: 0, grids: app.wmenu.initVale[0] })
    }).catch( console.error );
  },

  tabClick: function (e) {                                //点击tab
    app.mData.pCk1 = Number(e.currentTarget.id)
    this.setData({
      pageCk: app.mData.pCk1                  //点击序号切换
    });
  },

  onPullDownRefresh:function(){
    updateData(true,1).then(()=>{ this.setData({mPage: app.mData.prdct1, pageData: app.aData[1]}) });
  },
  onReachBottom:function(){
    updateData(false,1).then(()=>{ this.setData({mPage: app.mData.prdct1, pageData: app.aData[1]}) });
  },
  onShareAppMessage: function() {    // 用户点击右上角分享
    return {
      title: '侠客岛创业服务平台', // 分享标题
      desc: '扶贫济困，共享良品。', // 分享描述
      path: '/pages/index/index' // 分享路径
    }
  }
})

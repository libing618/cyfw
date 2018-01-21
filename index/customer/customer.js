const {iMenu} = require('../../util/util');
var app = getApp()
Page({
  data: {
    grids:[],
    approvPending: [],
    text : '沟通开始：'
  },

  onLoad:function(options){    // 生命周期函数--监听页面加载
    this.setData({ grids: iMenu('customer') })          //更新菜单
  },

  onReady:function(){    // 生命周期函数--监听页面初次渲染完成
    this.updatepending(true);
  },
  onShow:function(){    // 生命周期函数--监听页面显示
    if (this.data.approvPending.length==0){ this.updatepending(true); }
  },

  onPullDownRefresh: function() {
    this.updatepending(true)
  },
  onReachBottom: function() {
    this.updatepending(false);
  },
  updatepending: function(upOrDown) {
    if(upOrDown){this.setData({text: '上拉刷新'})};
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

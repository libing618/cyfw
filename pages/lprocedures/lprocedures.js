const weutil = require('../../util/util.js');
var app = getApp()
Page ({
  data: {
    pNo: 2,                       //流程的序号
    mPage: [],                 //页面管理数组
    dObjectId: 0,             //已建数据的ID作为修改标志，0则为新建
    pageData: []
  },

  onLoad: function (ops) {        //传入参数为pNo,不得为空
    var that = this;
    let pno = Number(ops.pNo);
    let artid = Number(ops.artId);
    if (! isNaN(pno)) {
      that.data.pNo = pno;
      if(!isNaN(artid)) {that.data.dObjectId = artid};
      that.data.pageData = app.aData[pno];
      that.data.mPage = isNaN(artid) ? app.mData['prdct'+pno] : app.mData['prdct'+pno][artid];
      that.setData( that.data )
    } else {
      wx.showToast({ title: '数据传输有误，请联系客服！', duration: 2500 });
      setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
    };
  },

  onReady: function(){
    weutil.updateData(true, this.data.pNo);                       //更新缓存以后有变化的数据
  },
  onPullDownRefresh: function () {
    weutil.updateData(true,this.data.pNo);
  },
  onReachBottom: function () {
    weutil.updateData(false, this.data.pNo);
  },
  onShareAppMessage: function () {    // 用户点击右上角分享
    return {
      title: '侠客岛创业服务平台', // 分享标题
      desc: '扶贫济困，共享良品。', // 分享描述
      path: '/pages/index/index' // 分享路径
    }
  }
})

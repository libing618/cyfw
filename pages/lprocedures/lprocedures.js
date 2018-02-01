const { updateData,className,classInFamily } = require('../../model/initupdate');
var app = getApp()
Page ({
  data: {
    pNo: 2,                       //流程的序号
    mPage: [],                 //页面管理数组
    dObjectId: 0,             //已建数据的ID作为修改标志，则为新建
    pageData: []
  },
  artid: null,
  cName: '',
  inFamily: false,

  onLoad: function (ops) {        //传入参数为pNo,不得为空
    var that = this;
    let pno = Number(ops.pNo);
    that.artid = Number(ops.artId);
    if (! isNaN(pno)) {
      that.cName = className(pno);
      that.inFamily = classInFamily(pno);
      that.setData({
        pNo: pno,
        dObjectId: isNaN(that.artid) ? -1 : artid
      });
      that.setPage(true);
    } else {
      wx.showToast({ title: '数据传输有误', duration: 2500 });
      setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
    };
  },

  setPage: function(iu){     //有更新则重新传输页面数据
    if (iu){
      if (this.data.pNo==1){
        this.setData({
          mPage: isNaN(that.artid) ? app.mData.articles : app.mData.articles[this.artid],
          pageData: isNaN(that.artid) ? app.aData.articles : app.aData.articles[this.artid]
        })
      } else {
        this.setData({
          mPage: this.inFamily ? app.mData[this.cName][app.roleData.uUnit.objectId][that.artid] : app.mData[this.cName][app.roleData.uUnit.objectId],
          pageData: this.inFamily ? app.aData[this.cName][app.roleData.uUnit.objectId][that.artid] : app.aData[this.cName][app.roleData.uUnit.objectId]
        })
      }
    }
  },

  onReady: function(){
    updateData(true,this.data.pNo).then(isupdated=>{ this.setPage(isupdated)});                       //更新缓存以后有变化的数据
  },
  onPullDownRefresh: function () {
    updateData(true,this.data.pNo).then(isupdated=>{ this.setPage(isupdated)});
  },
  onReachBottom: function () {
    updateData(false,this.data.pNo).then(isupdated=>{ this.setPage(isupdated)});
  },
  onShareAppMessage: function () {    // 用户点击右上角分享
    return {
      title: '侠客岛创业服务平台', // 分享标题
      desc: '扶贫济困，共享良品。', // 分享描述
      path: '/index/manage/manage' // 分享路径
    }
  }
})

// pages/customer/addresslist/addresslist.js
const app=getApp();
Page({
  data:{
    vData:[]
  },
  onLoad:function(options){
    this.setData({vData:[app.uUnit,app.sUnit]});
    this.accheck = require('../../../util/util.js').accheck;
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})

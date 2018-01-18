//通讯录
const app=getApp();
Page({
  data:{
    vData:[],
    iClicked: '0'
  },
  onLoad:function(options){
    this.setData({vData:[app.uUnit,app.sUnit]});
    this.indexClick = require('../../../util/util.js').indexClick;
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

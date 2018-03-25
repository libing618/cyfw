//图片选取及简单编辑模块 util/ceimage/ceimage.js
const { File } = require('../../libs/leancloud-storage.js');

var app = getApp();
Page({
  data: {
    xImage: app.globalData.sysinfo.windowWidth,
    yImage: 0,
    iscr: '',
    xOff: 320,
    yOff: 272,
    x:100,
    y:100
  },
  reqField: '',
  prevPage: {},
  iScale: 1,
  cScale:1,
  ds:1,
  cOriginal: wx.createCanvasContext('cOriginal', this),
  ctx: wx.createCanvasContext('cei',this),

  onLoad: function (options) {
    var that = this;
    let pages = getCurrentPages();                //获取当前页面路由栈的信息
    that.prevPage = pages[pages.length - 2];        //上个页面
    that.reqField = 'vData.' + options.reqName;
    if (typeof that.prevPage.data.selectd=='number' && that.prevPage.data.selectd>=0) {
      that.reqField += '[' + that.prevPage.data.selectd + '].c';              //详情部分的图片编辑
      var getSrc = that.prevPage.data.vData[options.reqName][that.prevPage.data.selectd].c;
    } else {
      var getSrc = that.prevPage.data.vData[options.reqName];
    };
    wx.getImageInfo({
      src: getSrc,
      success: function (res){
        that.ds = res.width/320;
        that.cScale = that.data.xImage / res.width;
        that.setData({ iscr: getSrc, yImage: res.height * that.cScale });//res.path
        that.iDraw(that.data.xOff,that.data.yOff)
      }
    })
  },

  iDraw: function(x,y){
    var xm ,ym;
    if (x < this.data.xOff) {
      xm = 0;
    } else {
      if (x > this.data.xImage) { xm = this.data.xImage - this.data.xOff }
      else { xm = x - this.data.xOff }
    }
    if (y < this.data.yOff) {
      ym = 0;
    } else {
      if (y > this.data.yImage) { ym = this.data.yImage - this.data.yOff }
      else { ym = y - this.data.yOff }
    }
    this.setData({ x: xm, y: ym });
    this.ctx.scale(this.ds*this.cScale / this.iScale, this.ds*this.cScale / this.iScale);
    this.ctx.drawImage(this.data.iscr, 0 - xm/this.cScale/this.ds, 0 - ym/this.cScale/this.ds, 320, 272);
    this.ctx.draw();
  },

  EventHandle: function (event) {
    this.iDraw(event.touches[0].pageX, event.touches[0].pageY);
  },

  fplus: function () {                   //扩大范围
    if (this.data.xOff<320) {
      this.setData({xOff:this.data.xOff+16,yOff:this.data.yOff+13.6});
      this.iScale = this.iScale+0.1;
      this.iDraw(this.data.xOff+this.data.x, this.data.yOff+this.data.y);
    }
  },

  freduce: function () {                   //缩小范围
    if (this.data.xOff>160) {
      this.setData({xOff:this.data.xOff-16,yOff:this.data.yOff-13.6});
      this.iScale = this.iScale-0.1;
      this.iDraw(this.data.xOff + this.data.x, this.data.yOff + this.data.y);
    }
  },

  fSave: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'cei',
      destWidth: 640,
      destHeight: 544,
      success: function(resTem){
        new File('file-name', {	blob: {	uri: resTem.tempFilePath, },
        }).save().then(	resfile => {
          let reqset = {};
          reqset[that.reqField] = resfile.url();
          that.prevPage.setData(reqset);
          wx.navigateBack({ delta: 1 });
        }).catch(console.error);
      }
    })
  }
})

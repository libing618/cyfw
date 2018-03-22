//货架管理
const AV = require('../../libs/leancloud-storage.js');
const { checkRols,indexClick } = require('../../util/util');
const { updateData } = require('../../model/initupdate');
const { unitData } = require('../../model/initForm.js');
var app = getApp();

Page({
  data:{
    mPage: app.mData.goods[app.roleData.uUnit.objectId],
    pageData: {}
  },
  onLoad:function(options){
    if ( checkRols(9,app.globalData.user) ) {
      this.setPage(true);
    }
  },

  setPage: function(reNew){
    if (reNew) {                     //商品数据有更新
      this.setData({
        pageData: unitData('goods'),
        mPage:app.mData.goods[app.roleData.uUnit.objectId]
      });
    };
  },

  onReady: function(){
    updateData(true,'goods').then((isupdated)=>{ this.setPage(isupdated) });              //更新缓存以后有变化的数据
    wx.setNavigationBarTitle({
      title: app.globalData.user.emailVerified ? app.roleData.uUnit.uName+'的货架' : '用户体验货架管理',
    })
  },

  fSave:function({currentTarget:{id}}){
    var that = this;
    return new AV.Object.createWithoutData('goods',id).set({                  //选择商品的ID
      inSale:!app.aData.goods[id].inSale
    }).save().then((prodata)=>{
      let aSetData = {};
      app.aData.goods[id].inSale = !app.aData.goods[id].inSale;
      aSetData['pageData.'+id+'.inSale'] = app.aData.goods[id].inSale;
      that.setData(aSetData);
    }).catch( console.error );
  }
})

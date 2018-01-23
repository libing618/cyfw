//分销策略
const AV = require('../../libs/leancloud-storage.js');
const proportions = require('../../model/proportions');
const { checkRols,indexClick } = require('../../util/util');
const { updateData } = require('../../model/initupdate');
var app = getApp();

Page({
  data:{
    reqData:[
      { gname: "channel", p:'渠道分成比例%',t:"dg",func:"mCost"},
      { gname: "extension", p:'推广分成比例%',t:"dg",func:"mCost"},
      {gname: "mCost", p:'销售管理总占比', t: "fg"}
    ],
    vData:{"channel":7, "extension":10,"mCost":70},
    mPage: app.mData.goods[app.uUnit.objectId],
    pageData: app.aData.goods[app.uUnit.objectId],
    iClicked: ''
  },
  onLoad:function(options){
    var that = this;
    if ( checkRols(9) ) {
      updateData(true,6).then((reNew)=>{
        let sproportions=[],mproportions=[],pData={};
        if (reNew) {                     //商品数据有更新
          pData.pageData = app.aData.goods;
          pData.mPage = app.mData.goods;
        }
        new AV.Query(proportions).equalTo('unitId', app.uUnit.objectId).find().then(manufactor=>{
          if (manufactor) {                    //已设置过商品分销策略的数据
            manufactor.forEach(prodata=>{
              pData.sData[prodata.objectId] = prodata;
              app.mData.goods.forEach(goodsId=>{
                if (prodata.objectId==goodsId){
                  sproportions.push(prodata.objectId);
                } else {mproportions.push(goodsId)}
              })
            })
            pData.sPage = sproportions;
            pData.mPage = mproportions;
          }
          if (pData) { that.setData(pData); }
        }).catch(console.error);
      }).catch(console.error);
    };
  },

  indexClick: indexClick,

  f_mCost:function(e){
    let n = parseInt(e.currentTarget.id.substring(3));      //数组下标
    inmcost = Number(e.detail.value);
    let vdSet = {};
    if (isNaN(inmcost)){
      vdSet['vData.'+this.data.reqData[n].gname] = 0;      //不能输入非数字
    } else {
      vdSet['vData.'+this.data.reqData[n].gname] = inmcost>30 ? 30 : inmcost ;      //不能超过30%
    }
    vdSet.vData.mCost = 87-inmcost-Number(n==1 ? that.data.vData.channel : that.data.vData.extension)
    this.setData( vdSet );
  },

  fSave:function(e){
    var that = this;
    new proportions.set({
      unitId:'0',
      goods:that.data.sproduct,                   //选择商品的ID
      channel:e.detail.value.channel,
      extension:e.detail.value.extension,
      mCost:e.detail.value.mCost
    }).save().then((prodata)=>{
      that.data.sData[prodata.objectId] = prodata;
      that.data.sPage.unshift(prodata.objectId);
      let mwz = that.data.mPage[0].indexOf(prodata.objectId);
      if (mwz>=0){that.data.mPage[0].splice(mwz,1)};
      that.data.sproduct = '';
      that.setData(that.data);
    }).catch( console.error );
  }
})

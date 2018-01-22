const AV = require('../libs/leancloud-storage.js');
const procedureclass = require('./procedureclass.js');
var app = getApp();
function cLocation(){
  return new Promise((resolve,reject)=>{
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userLocation']) {                   //用户已经同意小程序使用用户地理位置
          resolve(true)
        } else {
          wx.authorize({scope: 'scope.userLocation',
            success() { resolve(true) },
            fail() {
              wx.showToast({ title: '请授权使用位置', duration: 2500, icon: 'loading' });
              setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
              reject(); }
          })
        };
      }
    })
  }).then((vifAuth)=>{
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        resolve(new AV.GeoPoint(res.latitude,res.longitude))
      }
    })
  }).catch(console.error)
}
module.exports = {
  updateData: function(isDown,pNo,uId) {    //更新页面显示数据,isDown下拉刷新
    return new Promise((resolve, reject) => {
      var cName = procedureclass[pNo].pModle;
      var unitId = uId ? uId : app.uUnit.objectId;
      let inFamily = typeof procedureclass[pNo].afamily != 'undefined';
      var umdata = [];
      var updAt = app.mData.pAt[cName];
      var readProcedure = new AV.Query(cName);                                      //进行数据库初始化操作
      if (pNo>1){
        readProcedure.equalTo('unitId',unitId);                //除权限和文章类数据外只能查指定单位的数据
        updAt = (typeof app.mData.pAt[cName][unitId] == 'undefined') ? [new Date(0),new Date(0)] : app.mData.pAt[cName][unitId];
      };
      if (isDown) {
        readProcedure.greaterThan('updatedAt', updAt[1]);          //查询本地最新时间后修改的记录
        readProcedure.ascending('updatedAt');           //按更新时间升序排列
        readProcedure.limit(1000);                      //取最大数量
      } else {
        readProcedure.lessThan('updatedAt', updAt[0]);          //查询最后更新时间前修改的记录
        readProcedure.descending('updatedAt');           //按更新时间降序排列
      };
      readProcedure.find().then((arp) => {
        var lena = arp.length;
        if (arp) {
          if (pNo>1) {
            umdata = (typeof app.mData[cName][unitId] == 'undefined') ? [] : app.mData[cName][unitId];
          } else {
            umdata = app.mData[cName];
          }
          let aPlace = -1;
          if (isDown) {
            updAt[1] = arp[lena-1].updatedAt;                          //更新本地最新时间
            updAt[0] = arp[0].updatedAt; //若本地记录时间为空，则更新本地最后更新时间
          }else{
            updAt[0] = arp[lena-1].updatedAt;          //更新本地最后更新时间
          };
          arp.forEach(aProcedure => {
            if (isDown){
              if (inFamily) {                         //存在afamily类别
                aPlace = umdata[aProcedure.afamily].indexOf(aProcedure.id);
                if (aPlace>=0) {umdata[aProcedure.afamily].splice(aPlace,1)}           //删除本地的重复记录列表
                umdata[aProcedure.afamily].unshift(aProcedure.id);
              } else {
                aPlace = umdata.indexOf(aProcedure.id);
                if (aPlace>=0) {umdata.splice(aPlace,1)}           //删除本地的重复记录列表
                umdata.unshift(aProcedure.id);
              }
            }else{
              if (inFamily) {
                umdata[aProcedure.afamily].push(aProcedure.id);
              } else {
                umdata.push(aProcedure.id);                   //分类ID数组增加对应ID
              }
            };
            app.aData[cName][aProcedure.id] = aProcedure;                        //将数据对象记录到本机
          });
          if (pNo!=1){
            app.mData.pAt[cName][unitId] = updAt;
            app.mData[cName][unitId] = umdata;
          } else {
            app.mData.pAt[cName] = updAt;
            app.mData[cName] = umdata;
          };
          resolve(true);               //数据有更新
        } else {resolve(false);}               //数据无更新
      }).catch( error=> {reject(error)} );
    })
  },

  className: function(pNo) {
    return procedureclass[pNo].pModle
  },

  classInFamily: function(pNo) {
    return (typeof procedureclass[pNo].afamily != 'undefined');
  }

  integration: function(pNo,unitId) {           //整合选择数组
    var unitValue = {};
    switch (pNo){
      case 3:
        this.updateData(true,3,unitId).then(()=>{           //通过产品选择成品
          this.updateData(true,5,unitId).then(()=>{
            unitValue = app.mData.product[unitId].map(proId=>{
              return {product:proId,cargo:app.mData.cargo[unitId].filter( cargoId=> app.aData.cargo[cargoId].product==proId)}
            })
          })
        }).catch( console.error );
        break;
      case 6:
        this.updateData(true,6,unitId).then(()=>{           //通过商品选择规格
          this.updateData(true,7,unitId).then(()=>{
            unitValue = app.mData.goods[unitId].map( goodsId=>{
              return { goods:goodsId,specs:app.mData.specs[unitId].filter( spec=> app.aData.specs[spec].goods==goodsId)}
            })
          })
        }).catch( console.error );
        break;
      default:
        return
        break;
    }
    return unitValue;
  },

  initData: function(that,aaData){
    let vifData = typeof aaData == 'undefined';
    if (!vifData) { that.data.vData = aaData };
    let unitId = aaData.unitId ? aaData.unitId : app.uUnit.objectId;
    for (let i=0;i<that.data.reqData.length;i++){
      switch (that.data.reqData[i].t){
        case 'chooseAd' :
          if (vifData) {
            cLocation().then(cl=>{
              that.data.vData[that.data.reqData[i].gname]  = cl;
            });          //地理位置字段
          break;
        case 'eDetail' :
          if (vifData) {                      //详情字段
            that.data.vData[that.data.reqData[i].gname]=[                     //内容部分定义：t为类型,e为文字或说明,c为媒体文件地址或内容
              { t: "h2", e: "大标题"},
              { t: "p" ,e: "正文简介"},
              { t: "h3", e: "中标题" },
              { t: "p", e: "正文" },
              { t: "h4", e: "1、小标题" },
              { t: "p", e: "图片文章混排说明" },
              { t: "-2", c: 'http://ac-trce3aqb.clouddn.com/eb90b6ebd3ef72609afc.png', e: "图片内容说明" },
              { t: "p", e: "正文" },
              { t: "h4", e: "2、小标题" },
              { t: "p", e: "音频文章混排" },
              { t: "-3", c: "https://i.y.qq.com/v8/playsong.html?songid=108407446&source=yqq", e: "录音内容说明" },
              { t: "p", e: "正文" },
              { t: "h4", p: "3、小标题" },
              { t: "p", p: "视频文章混排" },
              { t: "-4", c: "https://v.qq.com/x/page/f05269wf11h.html?ptag=2_5.9.0.13560_copy", e: "视频内容说明" },
              { t: "p", e: "正文" },
              { t: "p", e: "章节结尾" },
              { t: "p", e: "文章结尾" }
            ]
          };
          break;
        case 'sCargo' :                    //产品选择字段
          integration(3,unitId).then()
          that.data.reqData[i].mData = app.mData.procedure[unitId];
          that.data.reqData[i].aData = app.aData.procedure[unitId];
          break;
        case 'producttype' :
          that.data.reqData[i].indlist = app.uUnit.indType;
          if (vifData) { that.data.vData[that.data.reqData[i].gname] = app.uUnit.indType[0] };
          break;
        case 'industrytype':
          if (vifData) {that.data.vData[that.data.reqData[i].gname] = [] };
          break;
        case 'arrsel':
          if (vifData) { that.data.vData[that.data.reqData[i].gname] = 0 };
          break;
        case 'sedate' :
          if (vifData) {that.data.vData[that.data.reqData[i].gname] = [getdate(Date.now()), getdate(Date.now() + 864000000)] }
          break;
      }
    };
    that.setData( that.data );
  }

}

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
      if (typeof pNo == 'string'){
        procedureclass.forEach(pClass=>{ if (pClass.pModle==pNo) {pNo=pClass.pNo} } );
      }
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

  integration: function(pName,unitId) {           //整合选择数组
    switch (pName){
      case 'cargo':         //通过产品选择成品
        return Promise.all([this.updateData(true,3,unitId),this.updateData(true,5,unitId)]).then(()=>{
          let drone = app.mData.product[unitId].map(proId=>{
            return {masterId:proId,slaveId:app.mData.cargo[unitId].filter( cargoId=> app.aData.cargo[unitId][cargoId].product==proId)}
          })
          return {droneId:drone, master:app.aData.product[unitId], slave:app.aData.cargo[unitId]};
        }).catch( console.error );
        break;
      case 'specs':
        this.updateData(true,6,unitId).then(()=>{           //通过商品选择规格
          this.updateData(true,7,unitId).then(()=>{
            let drone = app.mData.goods[unitId].map( goodsId=>{
              return { masterId:goodsId,slaveId:app.mData.specs[unitId].filter( specId=> app.aData.specs[unitId][specId].goods==goodsId)}
            })
            return {droneId:drone, master:app.aData.product[unitId], slave:app.aData.cargo[unitId]};
          })
        }).catch( console.error );
        break;
    }
  },

  readShowFormat: function(req,uId){
    var unitId = uId ? uId : app.uUnit.objectId;
    return new  Promise((resolve, reject) => {
      let promArr = [];               //定义一个Promise数组
      for (let i=0;i<req.length;i++){
        switch (req[i].t){
          case 'MS':
            req[i].e = app.sUnit.uName ;
            break;
          case 'sObject' :                    //对象选择字段
            if (req[i].gname=='goodstype'){
              req[i].objarr = require('../libs/goodstype');
            } else {
              promArr.push( this.integration(req[i].gname,unitId).then(drone=>{ req[i].objarr = drone}) );
            };
            break;
          case 'sId' :
            promArr.push(
              this.updateData(true,req[i].gname,unitId).then(()=>{
                req[i].mData = app.mData[req[i].gname][unitId];
                req[i].aData = app.aData[req[i].gname][unitId];
              });
            )
            break;
        }
      }
      resolve(promArr);
    }).then(pArr=>{
      return Promise.all(pArr).then(()=>{ return req })
    }).catch(console.error);
  }

  initData: function(req,vData){      //对数据录入或编辑的格式数组和数据对象进行初始化操作
    let vifData = typeof vData == 'undefined';
    if (vifData) { vData = {} };             //数据对象初始化
    var funcArr = [];
    let unitId = vData.unitId ? vData.unitId : app.uUnit.objectId;  //数据中没有单位代码则用使用人的单位代码
    return new  Promise((resolve, reject) => {
      let promArr = [];               //定义一个Promise数组
      for (let i=0;i<req.length;i++){
        switch (req[i].t){
          case 'MS':
            req[i].e = vifData ? '点击选择服务单位' : app.sUnit.uName ;
            break;
          case 'sObject' :                    //对象选择字段
            req[i].osv = [0,0];
            if (req[i].gname=='goodstype'){
              req[i].objarr = require('../libs/goodstype');
            } else {
              promArr.push( this.integration(req[i].gname,unitId).then(drone=>{ req[i].objarr = drone}) );
            };
            break;
          case 'producttype' :
            req[i].indlist = app.uUnit.indType;
            break;
          case 'sId' :
            promArr.push( this.updateData(true,req[i].gname,unitId).then(()=>{
              req[i].mData = app.mData[req[i].gname][unitId];
              req[i].aData = app.aData[req[i].gname][unitId];
            }); )
            break;
          case 'arrplus' :
            req[i].sId = app.mData.product[unitId][0];
            req[i].objects = app.aData.product[unitId];
            break;
        }
        if (vifData) {
          switch (req[i].t){
            case 'chooseAd' :
              promArr.push( cLocation().then(cl=>{vData[req[i].gname]  = cl}) );          //地理位置字段
              break;
            case 'eDetail' :                      //详情字段
              vData[req[i].gname]=[                     //内容部分定义：t为类型,e为文字或说明,c为媒体文件地址或内容
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
              ];
              break;
            case 'assettype':
              vData[req[i].gname] = { code:0,sName:''};
              break;
            case 'producttype' :
              vData[req[i].gname] = app.uUnit.indType[0] ;
              break;
            case 'industrytype':
              vData[req[i].gname] = { code:[],sName:[]} ;
              break;
            case 'arrplus':
              vData[req[i].gname] = { code:0,sName:''} ;
              break;
            case 'sedate' :
              vData[req[i].gname] = [getdate(Date.now()), getdate(Date.now() + 864000000)] ;
              break;
          }
        };
        if (req[i].csc){
          funcArr.push('f_'+req[i].csc);
          if (['aslist','arrsell'].indexOf(req[i].csc)>=0){req[i].aVl = [0,0,0]};
        } else {
          if (req[i].t.length  > 2) {funcArr.push('i_'+req[i].t)};             //每个输入类型定义的字段长度大于2则存在对应处理过程
        };
      };
      resolve(promArr);
    }).then(pArr=>{
      return Promise.all(pArr).then(()=>{ return {req,vData,funcArr} })
    }).catch(console.error);
  }

}

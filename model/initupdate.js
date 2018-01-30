const AV = require('../libs/leancloud-storage.js');
const procedureclass = require('procedureclass.js');
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
    return new Promise((resolve, reject) => {
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          resolve( { latitude: res.latitude, longitude: res.longitude } )
        },
        fail() { reject()}
      })
    })
  }).catch(console.error)
};
const updateData=(isDown, pNo, uId)=> {    //更新页面显示数据,isDown下拉刷新
  return new Promise((resolve, reject) => {
    if (typeof pNo == 'string') {
      procedureclass.forEach(pClass => { if (pClass.pModle == pNo) { pNo = pClass.pNo } });
    }
    var cName = procedureclass[pNo].pModle;
    var unitId = uId ? uId : app.uUnit.objectId;
    let inFamily = typeof procedureclass[pNo].afamily != 'undefined';
    var umdata = [];
    let updAt = app.mData.pAt[cName];
    var readProcedure = new AV.Query(cName);                                      //进行数据库初始化操作
    if (pNo != 1) {
      readProcedure.equalTo('unitId', unitId);                //除权限和文章类数据外只能查指定单位的数据
      updAt = (typeof app.mData.pAt[cName][unitId] == 'undefined') ? [new Date(0), new Date(0)] : app.mData.pAt[cName][unitId];
    };
    if (isDown) {
      readProcedure.greaterThan('updatedAt', updAt[1]);          //查询本地最新时间后修改的记录
      readProcedure.ascending('updatedAt');           //按更新时间升序排列
      readProcedure.limit(1000);                      //取最大数量
    } else {
      readProcedure.lessThan('updatedAt', updAt[0]);          //查询最后更新时间前修改的记录
      readProcedure.descending('updatedAt');           //按更新时间降序排列
    };
    return readProcedure.find()
  }).then((arp) => {
    var lena = arp.length;
    if (lena > 0) {
      if (pNo == 1) {
        umdata = app.mData[cName];
      } else {
        umdata = (typeof app.mData[cName][unitId] == 'undefined') ? [] : app.mData[cName][unitId];
      }
      let aPlace = -1;
      if (isDown) {
        updAt[1] = arp[lena - 1].updatedAt;                          //更新本地最新时间
        updAt[0] = arp[0].updatedAt; //若本地记录时间为空，则更新本地最后更新时间
      } else {
        updAt[0] = arp[lena - 1].updatedAt;          //更新本地最后更新时间
      };
      arp.forEach(aProcedure => {
        if (isDown) {
          if (inFamily) {                         //存在afamily类别
            aPlace = umdata[aProcedure.afamily].indexOf(aProcedure.id);
            if (aPlace >= 0) { umdata[aProcedure.afamily].splice(aPlace, 1) }           //删除本地的重复记录列表
            umdata[aProcedure.afamily].unshift(aProcedure.id);
          } else {
            aPlace = umdata.indexOf(aProcedure.id);
            if (aPlace >= 0) { umdata.splice(aPlace, 1) }           //删除本地的重复记录列表
            umdata.unshift(aProcedure.id);
          }
        } else {
          if (inFamily) {
            umdata[aProcedure.afamily].push(aProcedure.id);
          } else {
            umdata.push(aProcedure.id);                   //分类ID数组增加对应ID
          }
        };
        app.aData[cName][aProcedure.id] = aProcedure;                        //将数据对象记录到本机
      });
      if (pNo != 1) {
        app.mData.pAt[cName][unitId] = updAt;
        app.mData[cName][unitId] = umdata;
      } else {
        app.mData.pAt[cName] = updAt;
        app.mData[cName] = umdata;
      };
      resolve(true);               //数据有更新
    } else { resolve(false); }               //数据无更新
  }).catch(error => {
    wx.onNetworkStatusChange(res => {
      if (!res.isConnected) { wx.showToast({ title: '请检查网络！' }) }
    });
    reject(error)
  });
};

module.exports = {
  appDataExist: function(dKey0,dKey1,dKey2){              //检查app.aData是否存在二三级的键值
    let dExist = true;
    if (typeof app.aData[dKey0] == 'undefined' ){ return false }
    if (dKey1 in app.aData[dKey0]){
      if (typeof dKey2 == 'string'){
        if (!(dKey2 in app.aData[dKey0][dKey1])){
          dExist = false;
        }
      }
    } else { dExist = false };
    return dExist;
  },

  updateData: updateData,

  className: function(pNo) {              //返回数据表名
    return procedureclass[pNo].pModle
  },

  classInFamily: function(pNo) {              //判断数据表是否有分类控制
    return (typeof procedureclass[pNo].afamily != 'undefined');
  },

  familySel: function(pNo){              //数据表有分类控制的返回分类长度和选择记录
    let psData = {};
    if (typeof procedureclass[pNo].afamily != 'undefined') {
      psData.fLength = procedureclass[pNo].afamily.length;
      psData.pageCk = app.mData['pCk'+pNo];
      psData.tabs = procedureclass[pNo].afamily;
    };
    return psData;
  },

  integration: function(pName,unitId) {           //整合选择数组
    return new Promise((resolve, reject) => {
      switch (pName){
        case 'cargo':         //通过产品选择成品
          return Promise.all([updateData(true,3,unitId),updateData(true,5,unitId)]).then(()=>{
            app.mData.product[unitId].forEach(proId=>{
              app.aData.product[unitId][proId].cargo=app.mData.cargo[unitId].filter( cargoId=> { app.aData.cargo[unitId][cargoId].product==proId } )
            })
            resolve( true );
          }).catch( console.error );
          break;
        case 'specs':
          return Promise.all([updateData(true, 7, unitId), updateData(true, 6, unitId)]).then(() => {           //通过规格选择成品
            app.mData.goods[unitId].forEach( goodsId=>{
              app.aData.goods[unitId][goodsId].specs = app.mData.specs[unitId].filter(specsId => { app.aData.specs[unitId][specId].goods == goodsId })
            })
            resolve( true );
          }).catch( console.error );
          break;
      }
    }).catch(console.error);
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
              req[i].slave = require('../libs/goodstype').slave;
            } else {
              promArr.push(
                updateData(true,'cargo',unitId).then(()=>{req[i].slave = app.aData.cargo[unitId]})
              );
            };
            break;
          case 'sId' :
            promArr.push(
              updateData(true,req[i].gname,unitId).then(()=>{
                req[i].aData = app.aData[req[i].gname][unitId];
              })
            )
            break;
        }
      }
      resolve(promArr);
    }).then(pArr=>{
      return Promise.all(pArr).then(()=>{ return req })
    }).catch(console.error);
  },

  initData: function(req,vData){      //对数据录入或编辑的格式数组和数据对象进行初始化操作
    let vDataKeys = Object.keys(vData);            //数据对象是否为空
    let vifData = (vDataKeys.length == 0);
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
              req[i].objarr = require('../libs/goodstype').droneId;
              req[i].master = require('../libs/goodstype').master;
              req[i].slave = require('../libs/goodstype').slave;
            } else {
              promArr.push(
                updateData(true,'cargo',unitId).then(()=>{
                  req[i].objarr = app.mData.product[unitId].map(proId=>{ return {masterId:proId,slaveId:app.aData.product[unitId].cargo} })
                  req[i].master = app.aData.product[unitId]
                  req[i].slave = app.aData.cargo[unitId]
                })
              );
            };
            break;
          case 'producttype' :
            req[i].indlist = app.uUnit.indType;
            break;
          case 'sId' :
            promArr.push( updateData(true,req[i].gname,unitId).then(()=>{
              req[i].mData = app.mData[req[i].gname][unitId];
              req[i].aData = app.aData[req[i].gname][unitId];
              req[i].mn = vifData ? 0 : req[i].mData.indexOf(vData[req[i].gname]);
            }) )
            break;
          case 'arrplus' :
            req[i].sId = app.mData.product[unitId][0];
            req[i].objects = app.aData.product[unitId];
            break;
        }
        if (vifData) {
          switch (req[i].t){
            case 'chooseAd' :
              promArr.push( cLocation().then(cl=>{
                vData[req[i].gname] = new AV.GeoPoint(cl) }) );          //地理位置字段
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
              vData[req[i].gname] = { code:0,sName:'点此处进行选择'};
              break;
            case 'producttype':
              vData[req[i].gname] = { code: 0, sName:'点此处进行选择'} ;
              break;
            case 'industrytype':
              vData[req[i].gname] = { code: [], sName: ['点此处进行选择']} ;
              break;
            case 'arrplus':
              vData[req[i].gname] = { code: 0, sName:'点此处进行选择'} ;
              break;
            case 'ed':
              vData[req[i].gname] = { code: 0, sName: '点此处进入编辑' };
              break;
            case 'listsel':
              vData[req[i].gname] = 0 ;
              break;
            case 'sedate' :
              vData[req[i].gname] = [getdate(Date.now()), getdate(Date.now() + 864000000)] ;
              break;
          }
        };
        if (req[i].csc){
          funcArr.push('f_'+req[i].csc);
          if (['aslist','arrsel'].indexOf(req[i].csc)>=0){
            req[i].aVl = [0,0,0];
            req[i].inclose = vifData ? true : false;
          };
        } else {
          if (req[i].t.length  > 2) {funcArr.push('i_'+req[i].t)};             //每个输入类型定义的字段长度大于2则存在对应处理过程
        };
      };
      resolve(promArr);
    }).then(pArr=>{
      return Promise.all(pArr).then(()=>{
        return { req, vData, funcArr} })
    }).catch(console.error);
  }

}

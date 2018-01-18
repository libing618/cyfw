const AV = require('../libs/leancloud-storage.js');
const procedureclass = require('../model/procedureclass.js');
var app = getApp();
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
};
function getRols(rId){
  if (rId != '0') {
    AV.Object.createWithoutData('_Role', rId).fetch().then((uRole) => {
      app.uUnit = uRole.toJSON();
      if (app.uUnit.sUnit != '0'){
        AV.Object.createWithoutData('_Role', this.uUnit.sUnit).fetch().then((sRole) => {
          app.sUnit = sRole.toJSON();
        }).catch(console.error())
      }
    }).catch(console.error())
  } else { return {} }
};
module.exports = {
  checkRols: function(userRolName,ouRole){
    if (userRolName=='admin'){
      return true;
    } else {
      let roleLine = parseInt(substring(userRolName,1,1));
      if (roleLine==ouRole) {
        return true;
      } else { return false }
    }
  },

  openWxLogin: function(lStatus) {            //注册登录（本机登录状态）
    return new Promise((resolve, reject) => {
      wx.login({
        success: function(wxlogined) {
          if ( wxlogined.code ) {
            wx.getUserInfo({ withCredentials: true,
            success: function(wxuserinfo) {
              if (wxuserinfo) {
                AV.Cloud.run( 'wxLogin0',{ code:wxlogined.code, encryptedData:wxuserinfo.encryptedData, iv:wxuserinfo.iv } ).then( function(wxuid){
                  let signuser = {};
                  signuser['uid'] = wxuid.uId;
                  AV.User.signUpOrlogInWithAuthData(signuser,'openWx').then((statuswx)=>{    //用户在云端注册登录
                    if (lStatus==-2){
                      app.globalData.user = statuswx.toJSON();
                      resolve(1);                        //客户已注册在本机初次登录成功
                    } else {                         //客户在本机授权登录则保存信息
                      let newUser = wxuserinfo.userInfo;
                      newUser['wxapp' + wxappNumber] = wxuid.oId;         //客户第一次登录时将openid保存到数据库且客户端不可见
                      statuswx.set(newUser).save().then( (wxuser)=>{
                        app.globalData.user = wxuser.toJSON();
                        resolve(0);                //客户在本机刚注册，无菜单权限
                      }).catch(err => { reject({ ec:0, ee:err}) });
                    }
                  }).catch((cerror)=> { reject( { ec: 2, ee: cerror }) });    //客户端登录失败
                }).catch((error)=>{ reject( {ec:1,ee:error} ) });       //云端登录失败
              }
            } })
          } else { reject( {ec:3,ee:'微信用户登录返回code失败！'} )};
        },
        fail: function(err) { reject( {ec:4,ee:err.errMsg} ); }     //微信用户登录失败
      })
    });
  },

  fetchMenu: function(){
    return new AV.Query('_User')
      .notEqualTo('userRol.updatedAt',app.wmenu.updatedAt)
      .include(['userRol'])
      .select(['userRol'])
      .get(app.globalData.user.objectId).then( fetchUser =>{
        if (fetchUser) {                          //菜单在云端有变化
          app.wmenu = fetchUser.get('userRol');
          wx.setStorage({ key: 'menudata', data: mUser.userRol });
        }
        return new Promise.resolve(fetchUser.updatedAt);
    }).then( fuAt=>{
      wx.getUserInfo({
        withCredentials: false,
        success: function (wxuserinfo) {
          if (wxuserinfo) {
            if (fuAt != app.globalData.user.updatedAt) {             //客户信息有变化
              AV.User.become(AV.User.current().getSessionToken()).then((rLoginUser) => {
                app.globalData.user = rLoginUser.toJSON();
                app.globalData.user.avatarUrl = wxuserinfo.userInfo.avatarUrl;
                app.globalData.user.nickName = wxuserinfo.userInfo.nickName;
                resolve();
              }).catch(uerr=> reject(uerr))
            } else {
              app.globalData.user.avatarUrl = wxuserinfo.userInfo.avatarUrl;
              app.globalData.user.nickName = wxuserinfo.userInfo.nickName;
              resolve();
            }
          }
        }
      })
    }).then( ()=>{
      getRols(app.globalData.user.unit);
      app.imLogin(app.globalData.user.username);
      return
    }).catch( console.error );
  },

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
          if (pNo>1){
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

  fetchRecord: function(requery,indexField,sumField) {                     //同步云端数据到本机
    return new Promise((resolve, reject) => {
          let aData = {}, mData = {}, indexList = [], aPlace = -1, iField, iSum = {}, mChecked = {};
          arp.forEach(onedata => {
            aData[onedata.id] = onedata;
            iField = onedata.get(indexField);                  //索引字段读数据数
            if (indexList.indexOf(iField<0)) {
              indexList.push(iField);
              mData[iField] = [onedata.id];                   //分类ID数组增加对应ID
              iSum[iField] = onedata.get(sumField);
            } else {
              iSum[iField] += onedata.get(sumField);
              mData[iField].push(onedata.id);
            };
            mChecked[onedata.id] = true;
          });
          resolve({indexList:indexList,pageData:aData,quantity:iSum,mCheck:mChecked}) ;
        }
      }).catch( error=> {reject(error)} );
  },

  binddata: function(subscription, initialStats, onChange) => {
   let stats = [...initialStats]
   const remove = value => {
     stats = stats.filter(target => target.id !== value.id)
     return onChange(stats)
   }
   const upsert = value => {
     let existed = false;
     stats = stats.map(target => (target.id === value.id ? ((existed = true), value) : target))
     if (!existed) stats = [value, ...stats]
     return onChange(stats)
   }
   subscription.on('create', upsert)
   subscription.on('update', upsert)
   subscription.on('enter', upsert)
   subscription.on('leave', remove)
   subscription.on('delete', remove)
   return () => {
     subscription.off('create', upsert)
     subscription.off('update', upsert)
     subscription.off('enter', upsert)
     subscription.off('leave', remove)
     subscription.off('delete', remove)
   }

  pName: function(pNo){
    let familyLength =;
    let psData = {};
    if (typeof procedureclass[pNo].afamily != 'undefined') {
      psData.fLength = procedureclass[pNo].afamily.length;
      psData.pageCk = app.mData['pCk'+pNo];
      psData.tabs = procedureclass[pNo].afamily;
    };
    return psData;
  },

  indexClick: function(e){                           //选择打开的索引数组本身id
    this.setData({ iClicked: e.currentTarget.id });
  },
  tabClick: function (e) {                                //点击tab
    app.mData['pCk'+that.data.pNo] = Number(e.currentTarget.id)
    this.setData({
      pageCk: app.mData['pCk'+that.data.pNo]               //点击序号切换
    });
  },
  mClick: function (e) {                      //点击mClick
    let pSet = {};
    pSet['mChecked['+e.currentTarget.id+']'] = !this.data.mClicked[e.currentTarget.id].;
    this.setData(pSet)
  },
  formatTime: function(date,isDay) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    if (isDay){
      return [year, month, day].map(formatNumber).join('/')
    } else {
      var hour = date.getHours()
      var minute = date.getMinutes()
      var second = date.getSeconds();
      return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
    }
  }
}

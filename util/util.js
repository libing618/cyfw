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
      this.uUnit = uRole.toJSON();
      if (this.uUnit.sUnit != '0'){
        AV.Object.createWithoutData('_Role', this.uUnit.sUnit).fetch().then((sRole) => {
          this.sUnit = sRole.toJSON();
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

  openWxLogin: function(lStatus,mUpdateTime) {            //注册登录（本机登录状态）
    var that = this;
    return new Promise((resolve, reject) => {
      if ( lStatus<0 ) {                         //用户如已注册并在本机登录过,则有数据缓存，否则进行注册登录。
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
                        that.globalData.user = statuswx.toJSON();
                        resolve(1);                        //客户已注册在本机初次登录成功
                      } else {                         //客户在本机授权登录则保存信息
                        let newUser = wxuserinfo.userInfo;
                        newUser['wxapp' + wxappNumber] = wxuid.oId;         //客户第一次登录时将openid保存到数据库且客户端不可见
                        statuswx.set(newUser).save().then( (wxuser)=>{
                          that.globalData.user = wxuser.toJSON();
                          resolve(-1);                //客户在本机刚注册，无菜单权限
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
      } else {
        new AV.Query('_User').include('userRol.updatedAt').select(['userRol.updatedAt']).get(that.globalData.user.objectId).then( (auser) =>{
          let rUser = auser.toJSON();
          let menuUpdate = 0;
          if ( rUser.userRol.updatedAt ){     //菜单在云端有定义
            if (mUpdateTime != rUser.userRol.updatedAt) { menuUpdate = 2; }               //客户已登录但菜单权限发生变化
          }
          wx.getUserInfo({
            withCredentials: false,
            success: function (wxuserinfo) {
              if (wxuserinfo) {
                if (rUser.updatedAt != that.globalData.user.updatedAt) {             //客户信息有变化
                  AV.User.become(AV.User.current().getSessionToken()).then((rLoginUser) => {
                    that.globalData.user = rLoginUser.toJSON();
                    that.globalData.user.avatarUrl = wxuserinfo.userInfo.avatarUrl;
                    that.globalData.user.nickName = wxuserinfo.userInfo.nickName;
                    resolve(menuUpdate);
                  }).catch(uerr=> reject(uerr))
                } else {
                  that.globalData.user.avatarUrl = wxuserinfo.userInfo.avatarUrl;
                  that.globalData.user.nickName = wxuserinfo.userInfo.nickName;
                  resolve(menuUpdate);
                }
              }
            }
          })
        })
      }
    }).then(function(readMenu){
      return new Promise((resolve, reject) => {
        if ( readMenu>0 ){
          new AV.Query('_User').include(['userRol']).select(['userRol']).get(that.globalData.user.objectId).then((rolemenu)=> {
            let rUser = rolemenu.toJSON();
            that.wmenu = rUser.userRol.initVale;
            wx.setStorage({ key: 'menudata', data: rUser.userRol });
            resolve('updated menu')
          }).catch((error) => { reject({ ec: 5, ee: error }) })
        } else { resolve('keep menu'); }
      })
    }).then(function(sMenu){
      that.getRols(that.globalData.user.unit);
      that.imLogin(that.globalData.user.username);
      return wxappNumber;
    }).catch((error) => { return error });
  },


  updateData: function(isDown,pNo) {    //更新页面显示数据,isDown下拉刷新
    return new Promise((resolve, reject) => {
      var pClass = procedureclass[pNo];
      var readProcedure = new AV.Query(pClass.pModle);                                      //进行数据库初始化操作
      var upName = 'pAt'+pNo;
      if (pNo>1){readProcedure.equalTo('unitId',app.uUnit.objectId)};                //除单位和文章类数据外只能查本单位数据
      if (isDown) {
        readProcedure.greaterThan('updatedAt', app.mData[upName][1]);          //查询本地最新时间后修改的记录
        readProcedure.ascending('updatedAt');           //按更新时间升序排列
        readProcedure.limit(1000);                      //取最大数量
      } else {
        readProcedure.lessThan('updatedAt', app.mData[upName][0]);          //查询最后更新时间前修改的记录
        readProcedure.descending('updatedAt');           //按更新时间降序排列
      };
      let inFamily = typeof pClass.afamily != 'undefined';
      let aaName = 'prdct'+pNo
      readProcedure.find().then((arp) => {
        var lena = arp.length;
        if (arp) {
          let aPlace = -1;
          if (isDown) {
            app.mData[upName][1] = arp[lena-1].updatedAt;                          //更新本地最新时间
            app.mData[upName][0] = arp[0].updatedAt; //若本地记录时间为空，则更新本地最后更新时间
          }else{
            app.mData[upName][0] = arp[lena-1].updatedAt;          //更新本地最后更新时间
          };
          arp.forEach(aProcedure => {
            if (isDown){
              if (inFamily) {                         //存在afamily类别
                aPlace = app.mData[aaName][aProcedure.afamily].indexOf(aProcedure.id);
                if (aPlace>=0) {app.mData[aaName][aProcedure.afamily].splice(aPlace,1)}           //删除本地的重复记录列表
                app.mData[aaName][aProcedure.afamily].unshift(aProcedure.id);
              } else {
                aPlace = app.mData[aaName].indexOf(aProcedure.id);
                if (aPlace>=0) {app.mData[aaName].splice(aPlace,1)}           //删除本地的重复记录列表
                app.mData[aaName].unshift(aProcedure.id);
              }
            }else{
              if (inFamily) {
                app.mData[aaName][aProcedure.afamily].push(aProcedure.id);
              } else {
                app.mData[aaName].push(aProcedure.id);                   //分类ID数组增加对应ID
              }
            };
            app.aData[pNo][aProcedure.id] = aProcedure;                        //将数据对象记录到本机
          });
          resolve() ;
        }
      }).catch( error=> {reject(error)} );
    })
  },

  fetchData: function(requery,indexField,sumField) {                     //同步云端数据到本机
    return new Promise((resolve, reject) => {
      requery.equalTo('unitId',app.uUnit.objectId);                //只能查本单位数据
      requery.limit(1000);                      //取最大数量
      requery.find().then((readData) => {
        var lena = arp.length;
        if (readData) {
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
    })
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
    let familyLength = procedureclass[pNo].afamily.length;
    let psData = {};
    if (familyLength>0) {
      psData.fLength = familyLength;
      psData.pageCk = app.mData['pCk'+pNo];
      psData.tabs = procedureclass[pNo].afamily;
    };
    return psData;
  },

  idcheck: function(e){                           //选择打开的数组本身id
    this.setData({ achecked: e.currentTarget.id });
  },
  tabClick: function (e) {                                //点击tab
    app.mData['pCk'+that.data.pNo] = Number(e.currentTarget.id)
    this.setData({
      pageCk: app.mData['pCk'+that.data.pNo]               //点击序号切换
    });
  },
  arrClick: function (e) {                      //点击arrClick
    let aNumber = Number(e.currentTarget.id)
    let pSet = {};
    pSet['mPage['+aNumber+'].'+'arrClicked'] = !this.data.mPage[aNumber].arrClicked;
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

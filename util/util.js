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

  className: function(pNo) {
    return procedureclass[pNo].pModle
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

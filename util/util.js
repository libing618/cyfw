const AV = require('../libs/leancloud-storage.js');
const procedureclass = require('../model/procedureclass.js');
var app = getApp();
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
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

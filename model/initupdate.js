const AV = require('../libs/leancloud-storage.js');
const procedureclass = require('procedureclass.js');
var app = getApp();
function isAllData(cName){
  return (cName=='articles')
};
function appDataExist(dKey0, dKey1) {              //检查app.aData是否存在二三级的键值
  if (typeof app.mData.pAt[dKey0] == 'undefined') {
    app.mData.pAt[dKey0] = [0,0];
    return false
  }
  if (dKey1 in app.mData.pAt[dKey0]) {
    return true;
  } else {
    let dExist = app.mData.pAt[dKey0];
    dExist[dKey1] = [0,0];
    app.mData.pAt[dKey0] = dExist;
    return false;
  };
};
function updateData(isDown, pNo, uId) {    //更新页面显示数据,isDown下拉刷新,pNo类定义序号, uId单位Id
  return new Promise((resolve, reject) => {
    let isAll = isAllData(pNo);            //是否读所有数据
    let inFamily = typeof procedureclass[pNo].afamily != 'undefined';            //是否有分类数组
    var umdata = [], updAt;
    var readProcedure = new AV.Query(pNo);                                      //进行数据库初始化操作
    if (isAll) {
      updAt = appDataExist(pNo) ? app.mData.pAt[pNo] : [0, 0];
      umdata = app.mData[pNo] || [];
    } else {
      var unitId = uId ? uId : app.roleData.uUnit.objectId;
      readProcedure.equalTo('unitId', unitId);                //除权限和文章类数据外只能查指定单位的数据
      updAt = appDataExist(pNo, unitId) ? app.mData.pAt[pNo][unitId] : [0, 0];
      if (typeof app.mData[pNo][unitId] == 'undefined') {       //添加以单位ID为Key的JSON初值
        let umobj = {};
        if (typeof app.mData[pNo] != 'undefined') { umobj = app.mData[pNo] };
        umobj[unitId] = [];
        app.mData[pNo] = umobj;
      } else {
        umdata = app.mData[pNo][unitId] || [];
      }
    };
    if (isDown) {
      readProcedure.greaterThan('updatedAt', new Date(updAt[1]));          //查询本地最新时间后修改的记录
      readProcedure.ascending('updatedAt');           //按更新时间升序排列
      readProcedure.limit(1000);                      //取最大数量
    } else {
      readProcedure.lessThan('updatedAt', new Date(updAt[0]));          //查询最后更新时间前修改的记录
      readProcedure.descending('updatedAt');           //按更新时间降序排列
    };
    readProcedure.find().then(results => {
      var lena = results.length;
      if (lena > 0) {
        let aPlace = -1, aProcedure = {};
        if (isDown) {
          updAt[1] = results[lena - 1].updatedAt;                          //更新本地最新时间
          updAt[0] = results[0].updatedAt; //若本地记录时间为空，则更新本地最后更新时间
        } else {
          updAt[0] = results[lena - 1].updatedAt;          //更新本地最后更新时间
        };
        for (let i = 0; i < lena; i++) {//arp.forEach(aProc => {
          aProcedure = results[i].toJSON();
          if (inFamily) {                         //存在afamily类别
            if (typeof umdata[aProcedure.afamily] == 'undefined') { umdata[aProcedure.afamily] = [] };
            if (isDown) {
              aPlace = umdata[aProcedure.afamily].indexOf(aProcedure.objectId);
              if (aPlace >= 0) { umdata[aProcedure.afamily].splice(aPlace, 1) }           //删除本地的重复记录列表
              umdata[aProcedure.afamily].unshift(aProcedure.objectId);
            } else {
              umdata[aProcedure.afamily].push(aProcedure.objectId);
            }
          } else {
            if (isDown) {
              aPlace = umdata.indexOf(aProcedure.objectId);
              if (aPlace >= 0) { umdata.splice(aPlace, 1) }           //删除本地的重复记录列表
              umdata.unshift(aProcedure.objectId);
            } else {
              umdata.push(aProcedure.objectId);                   //分类ID数组增加对应ID
            }
          };
          app.aData[pNo][aProcedure.objectId] = aProcedure;                        //将数据对象记录到本机
        };
      };
      if (isAll) {
        app.mData[pNo] = umdata;
        app.mData.pAt[pNo] = updAt;
      } else {
        app.mData[pNo][unitId] = umdata;
        app.mData.pAt[pNo][unitId] = updAt;
      };
      resolve(lena > 0);               //数据更新状态
    }).catch(error => {
      if (!that.netState) { wx.showToast({ title: '请检查网络！' }) }
    });
  }).catch(console.error);
};
module.exports = {
appDataExist: appDataExist,

isAllData: isAllData,

updateData: updateData,

tabClick: function (e) {                                //点击tab
  app.mData['pCk'+this.data.pNo] = Number(e.currentTarget.id)
  this.setData({
    pageCk: app.mData['pCk'+this.data.pNo]               //点击序号切换
  });
},

integration: function(masterClass, slaveClass, unitId) {    //整合选择数组(主表，从表，单位Id)
  return new Promise((resolve, reject) => {
    return Promise.all([updateData(true, masterClass, unitId), updateData(true, slaveClass, unitId)]).then(([uMaster, uSlave]) => {
      let allslave = Promise.resolve(updateData(false, slaveClass, unitId)).then(notEnd => {
        if (notEnd) {
          return allslave();
        } else {
          app.mData[masterClass][unitId].forEach(masterId => {
            if (typeof app.aData[masterClass][masterId] != 'undefined') {
              app.aData[masterClass][masterId][slaveClass] = app.mData[slaveClass][unitId].filter(slaveId => { return app.aData[slaveClass][slaveId][masterClass] == masterId });
            }
          })
        }
        resolve(uMaster || uSlave)
      });
    })
  }).catch(console.error);
},

cargoSum: function (fields) {
  return new Promise((resolve, reject) => {
    let sLength = fields.length;
    let fieldSum = new Array(sLength);
    let mSum = {};
    fieldSum.fill(0);         //定义汇总数组长度且填充为0
    if (app.mData.product[app.roleData.uUnit.objectId]) {
      app.mData.product[app.roleData.uUnit.objectId].forEach(mId => {
        mSum[mId] = [];
        for (let i = 0; i < sLength; i++) { mSum[mId].push(0) };
        if (app.aData.product[mId].cargo){
          app.aData.product[mId].cargo.forEach(aId => {
            for (let i = 0; i < sLength; i++) {
              fieldSum[i] += app.aData.cargo[aId][fields[i]];
              mSum[mId][i] = mSum[mId][i] + app.aData.cargo[aId][fields[i]];
            }
          })
        };
      })
    }
    resolve({ rSum: fieldSum, mSum });
  }).catch(console.error);
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

updateTodo: function(that, pNo) {    //更新页面显示数据,isDown下拉刷新,pNo类定义序号, uId单位Id
  return new Promise((resolve, reject) => {
    let inFamily = typeof procedureclass[pNo].afamily != 'undefined';            //是否有分类数组
    var umdata = [], updAt;
    var readProcedure = new AV.Query(pNo);                                      //进行数据库初始化操作
    if (isAll) {
      updAt = appDataExist(pNo) ? app.mData.pAt[pNo] : [0, 0];
      umdata = app.mData[pNo] || [];
    } else {
      var unitId = uId ? uId : app.roleData.uUnit.objectId;
      readProcedure.equalTo('unitId', unitId);                //除权限和文章类数据外只能查指定单位的数据
      updAt = appDataExist(pNo, unitId) ? app.mData.pAt[pNo][unitId] : [0, 0];
      if (typeof app.mData[pNo][unitId] == 'undefined') {       //添加以单位ID为Key的JSON初值
        let umobj = {};
        if (typeof app.mData[pNo] != 'undefined') { umobj = app.mData[pNo] };
        umobj[unitId] = [];
        app.mData[pNo] = umobj;
      } else {
        umdata = app.mData[pNo][unitId] || [];
      }
    };
    if (isDown) {
      readProcedure.greaterThan('updatedAt', new Date(updAt[1]));          //查询本地最新时间后修改的记录
      readProcedure.ascending('updatedAt');           //按更新时间升序排列
      readProcedure.limit(1000);                      //取最大数量
    } else {
      readProcedure.lessThan('updatedAt', new Date(updAt[0]));          //查询最后更新时间前修改的记录
      readProcedure.descending('updatedAt');           //按更新时间降序排列
    };
    readProcedure.find().then(results => {
      var lena = results.length;
      if (lena > 0) {
        let aPlace = -1, aProcedure = {};
        if (isDown) {
          updAt[1] = results[lena - 1].updatedAt;                          //更新本地最新时间
          updAt[0] = results[0].updatedAt; //若本地记录时间为空，则更新本地最后更新时间
        } else {
          updAt[0] = results[lena - 1].updatedAt;          //更新本地最后更新时间
        };
        for (let i = 0; i < lena; i++) {//arp.forEach(aProc => {
          aProcedure = results[i].toJSON();
          if (inFamily) {                         //存在afamily类别
            if (typeof umdata[aProcedure.afamily] == 'undefined') { umdata[aProcedure.afamily] = [] };
            if (isDown) {
              aPlace = umdata[aProcedure.afamily].indexOf(aProcedure.objectId);
              if (aPlace >= 0) { umdata[aProcedure.afamily].splice(aPlace, 1) }           //删除本地的重复记录列表
              umdata[aProcedure.afamily].unshift(aProcedure.objectId);
            } else {
              umdata[aProcedure.afamily].push(aProcedure.objectId);
            }
          } else {
            if (isDown) {
              aPlace = umdata.indexOf(aProcedure.objectId);
              if (aPlace >= 0) { umdata.splice(aPlace, 1) }           //删除本地的重复记录列表
              umdata.unshift(aProcedure.objectId);
            } else {
              umdata.push(aProcedure.objectId);                   //分类ID数组增加对应ID
            }
          };
          app.aData[pNo][aProcedure.objectId] = aProcedure;                        //将数据对象记录到本机
        };
      };
      if (isAll) {
        app.mData[pNo] = umdata;
        app.mData.pAt[pNo] = updAt;
      } else {
        app.mData[pNo][unitId] = umdata;
        app.mData.pAt[pNo][unitId] = updAt;
      };
      resolve(lena > 0);               //数据更新状态
    }).catch(error => {
      if (!that.netState) { wx.showToast({ title: '请检查网络！' }) }
    });
  }).catch(console.error);
}

}

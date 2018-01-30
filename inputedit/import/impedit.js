const AV = require('../../libs/leancloud-storage.js');
const { integration } = require('../../util/util')
var app = getApp();
const nt = ['-1', '-6'];
const vdSet = function (sname, sVal) {
  let reqset = {};
  reqset['vData.' + sname] = sVal;
  return reqset;
};
const rdSet = function (n, rdg, rdn) {
  let reqdataset = {};
  reqdataset['reqData[' + n + '].' + rdg] = rdn;
  return reqdataset;
};
const mgrids = ['产品', '图像', '音频', '视频', '位置', '文件', '大标题', '中标题', '小标题', '正文'];
const mid = ['-1', '-2', '-3', '-4', '-5', '-6', 'h2', 'h3', 'h4', 'p'];
function getdate(idate) {
  let rdate = new Date(idate)
  var year = rdate.getFullYear();
  var month = rdate.getMonth() + 1;
  var day = rdate.getDate();
  return year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day)
};
module.exports = {
  tabClick: function (e) {                                //点击tab
    app.mData['pCk' + this.data.pNo] = Number(e.currentTarget.id)
    this.setData({
      pageCk: app.mData['pCk' + this.data.pNo]                //点击序号切换
    });
  },

  i_listsel: function (e) {                         //选择类型
    let n = parseInt(e.currentTarget.id.substring(3))      //数组下标
    this.setData(vdSet(this.data.reqData[n].gname, Number(e.detail.value)))
  },

  f_idsel: function (e) {                         //选择ID
    let n = parseInt(e.currentTarget.id.substring(3))      //数组下标
    this.setData(vdSet(this.data.reqData[n].gname, this.data.mData[Number(e.detail.value)]))
    let sIdKey = 's_' + this.data.reqData[n].gname;
    for (let i = 0; i < this.data.reqData.length; i++) {
      if (this.data.reqData[i].gname == sIdKey) {
        this.setData(rdSet(i, 'sId', this.data.mData[Number(e.detail.value)]));
        break;
      }
    }
  },

  f_aslist: function (e) {                         //选择行业类型
    var that = this;
    let n = parseInt(e.currentTarget.id.substring(3))      //数组下标
    var id = e.currentTarget.id.substring(0, 2);
    let fName = that.data.reqData[n].gname;
    switch (id) {
      case 'se':                                   //按下载ICON打开选择框
        that.setData(rdSet(n, 'inclose', !that.data.reqData[n].inclose));
        break;
      case 'su':                                   //按确定ICON确认选择
        that.data.vData[fName].code.push(Number(e.currentTarget.dataset.capdv));
        that.data.vData[fName].sName.push(e.currentTarget.dataset.sapdv);
        that.setData(vdSet(fName, that.data.vData[fName]))
        break;
      case 'pa':
        let val = e.detail.value;
        if (that.data.reqData[n].aVl[0] == val[0]) {
          if (that.data.reqData[n].aVl[1] != val[1]) { val[2] = 0 }
        } else { val[1] = 0; val[2] = 0 }
        that.setData(rdSet(n, 'aVl', val));
        break;
      case 'lj':                                   //按显示类型名称进行删除
        let i = Number(e.currentTarget.dataset.id);
        that.data.vData[fName].code.splice(i, 1);
        that.data.vData[fName].sName.splice(i, 1);
        that.setData(vdSet(fName, that.data.vData[fName]))
        break;
    }
  },

  i_inScan: function (e) {                         //扫描及输入
    var that = this;
    let n = parseInt(e.currentTarget.id.substring(3));      //数组下标
    var id = e.currentTarget.id.substring(0, 2);
    let fName = that.data.reqData[n].gname;
    switch (id) {
      case 'sc':
        wx.scanCode({
          success: (res) => {
            that.setData(vdSet(fName, res.result));
          }
        })
        break;
      case 'su':
        that.setData(vdSet(fName, e.detail.value[fName]));
        break;
    }
  },

  f_number: function (e) {
    let n = parseInt(e.currentTarget.id.substring(3));      //数组下标
    let vdSet = {};
    vdSet['vData.' + this.data.reqData[n].gname] = isNaN(Number(e.detail.value)) ? 0 : parseInt(Number(e.detail.value));      //不能输入非数字,转换为整数
    this.setData(vdSet);
  },

  f_float: function (e) {
    let n = parseInt(e.currentTarget.id.substring(3));      //数组下标
    let vdSet = {};
    vdSet['vData.' + this.data.reqData[n].gname] = isNaN(Number(e.detail.value)) ? '0.00' : parseFloat(Number(e.detail.value).toFixed(2));      //不能输入非数字,转换为浮点数保留两位小数
    this.setData(vdSet);
  },

  i_sedate: function (e) {                         //选择开始和结束日期
    var that = this;
    let n = parseInt(e.currentTarget.id.substring(3));      //数组下标
    var id = e.currentTarget.id.substring(0, 2);
    let rSet = {};
    switch (id) {
      case 'ac':
        rSet = vdSet(that.data.reqData[n].gname, e.currentTarget.dataset.ei ? [that.data.vData[that.data.reqData[n].gname][0], e.detail.value] : [e.detail.value, that.data.vData[that.data.reqData[n].gname][1]]);
        break;
      case 'ds':                             //选择开始日期
        rSet['reqData[' + n + '].endif'] = false;
        break;
      case 'de':                           //选择结束日期
        rSet['reqData[' + n + '].endif'] = true;
        break;
    }
    that.setData(rSet);
  },

  f_objsel: function (e) {                         //对象选择类型
    var that = this;
    let n = parseInt(e.currentTarget.id.substring(3));      //数组下标
    var id = e.currentTarget.id.substring(0, 2);
    switch (id) {
      case 'se':
        that.setData(rdSet(n, 'inclose', !that.data.reqData[n].inclose));
        break;
      case 'ac':
        if (!that.data.reqData[n].inclose) {
          that.setData(vdSet(that.data.reqData[n].gname, e.currentTarget.dataset.ca))
        }
        that.setData(rdSet(n, 'inclose', true));
        break;
      case 'pa':
        let aval = e.detail.value;
        if (that.data.reqData[n].osv[0] == aval[0]) { osv[1] = 0 };
        that.setData(rdSet(n, 'osv', aval));
        break;
    }
  },

  f_arrsel: function (e) {                         //数组选择类型
    var that = this;
    let n = parseInt(e.currentTarget.id.substring(3));      //数组下标
    var id = e.currentTarget.id.substring(0, 2);
    switch (id) {
      case 'se':
        that.setData(rdSet(n, 'inclose', !that.data.reqData[n].inclose));
        break;
      case 'ac':
        if (!that.data.reqData[n].inclose) {
          that.setData(vdSet(that.data.reqData[n].gname, { code: e.currentTarget.dataset.ca, sName:e.currentTarget.dataset.sa }))
        }
        that.setData(rdSet(n, 'inclose', true));
        break;
      case 'pa':
        let aval = e.detail.value;
        if (that.data.reqData[n].aVl[0] == aval[0]) {
          if (that.data.reqData[n].aVl[1] != aval[1]) { aval[2] = 0; }
        } else { aval[1] = 0; aval[2] = 0; }
        that.setData(rdSet(n, 'aVl', aval));
        break;
    }
  },

  i_arrList: function (e) {                         //数组选择类型
    var that = this;
    let n = parseInt(e.currentTarget.id.substring(3));      //数组下标
    var id = e.currentTarget.id.substring(0, 2);
    let fName = that.data.reqData[n].gname;
    switch (id) {
      case 'su':                                   //按下载ICON打开输入框
        that.setData(rdSet(n, 'inclose', !that.data.reqData[n].inclose));
        break;
      case 'ai':
        that.setData(rdSet(n, 'iValue', e.detail.value));
        break;
      case 'se':
        that.data.vData[fName].push(e.currentTarget.dataset.iValue);
        that.setData(vdSet(fName, that.data.vData[fName]));
        break;
      case 'lj':                                   //按显示类型名称进行删除
        let i = Number(e.currentTarget.dataset.id);
        that.data.vData[fName].splice(i, 1);
        that.setData(vdSet(fName, that.data.vData[fName]))
        break;
      }
  },

  i_thumb: function (e) {                         //编辑缩略图
    var that = this;
    let n = parseInt(e.currentTarget.id.substring(3))      //数组下标
    wx.chooseImage({
      count: 1,                                     // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'],         // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'],             // album 从相册选图，camera 使用相机，默认二者都有
      success: function (restem) {                     // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData(vdSet(that.data.reqData[n].gname, restem.tempFilePaths[0]));
        wx.navigateTo({ url: '/util/ceimage/ceimage?reqName=' + that.data.reqData[n].gname })
      },
      fail: function () { wx.showToast({ title: '选取照片失败！' }) }
    })
  },

  i_pics: function (e) {                         //选择图片组
    var that = this;
    let n = parseInt(e.currentTarget.id.substring(3))      //数组下标
    wx.chooseImage({
      count: 9,                                     // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'],         // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'],             // album 从相册选图，camera 使用相机，默认二者都有
      success: function (restem) {                     // 返回选定照片的本地文件路径列表
        that.setData(vdSet(that.data.reqData[n].gname, restem.tempFilePaths));
      },
      fail: function () { wx.showToast({ title: '选取照片失败！' }) }
    })
  },

  i_pic: function (e) {                         //上传申请人持身份证照片,单位组织机构代码证或个人身份证背面
    var that = this;
    let n = parseInt(e.currentTarget.id.substring(3))      //数组下标
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['camera'],                      //用户拍摄
      success: function (res) {
        new AV.File('file-name', {
          blob: { uri: res.tempFilePaths[0], },
        }).save().then(file => {
          that.setData(vdSet(that.data.reqData[n].gname, file.url()));
        }).catch(console.error);
      }
    });
  },

  i_chooseAd: function (e) {                         //选择地理位置
    var that = this;
    let n = parseInt(e.currentTarget.id.substring(3))      //数组下标
    wx.chooseLocation({
      success: function (res) {
        that.setData({ 'vData.aGeoPoint': new AV.GeoPoint({ latitude: res.latitude, longitude: res.longitude }) });
        if (!that.data.vData[that.data.reqData[n + 1].gname]) { that.setData(vdSet(that.data.reqData[n + 1].gname, {code:0,sName:res.address})) }
      }
    })
  },

  i_vidio: function (e) {                         //选择视频文件
    var that = this;
    let n = parseInt(e.currentTarget.id.substring(3))      //数组下标
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        let vdv = vdSet(that.data.reqData[n].gname, res.tempFilePath);
        that.setData(vdv);
      },
      fail: function () { wx.showToast({ title: '选取视频失败！' }) }
    })
  },

  i_sCargo: function (e) {                         //选择产品服务
    var that = this;
    let n = parseInt(e.currentTarget.id.substring(3))      //数组下标
    var id = e.currentTarget.id.substring(0, 2);
    switch (id) {
      case 'ac':
        that.setData(rdSet(n, 'inclose', !that.data.reqData[n].inclose));
        that.setData(vdSet(that.data.reqData[n].gname, ''));
        break;
      case 'pa':
        let aval = e.detail.value;
        if (that.data.reqData[n].provalue[0] != aval[0]) { aval[1] = 0; }
        that.setData(rdSet(n, 'provalue', aval));
        break;
    }
  },

  i_eDetail: function (e) {                                 //内容可以插入和删除
    var that = this;
    that.setData({
      selectd: parseInt(e.currentTarget.id.substring(3)),      //选择文章内容的数组下标
      enMenu: 'inline-block'
    })
  },

  i_insdata: function (e) {                          //插入数据
    this.farrData(e.currentTarget.id, 0);      //选择的菜单id;
  },

  farrData: function (sIndex, instif) {                          //详情插入或替换数据
    var that = this;
    var artArray = that.data.vData.details;       //详情的内容
    return new Promise((resolve, reject) => {
      switch (sIndex) {
        case '-1':             //选择产品
          resolve('选择商品');
          break;
        case '-2':               //选择相册图片或拍照
          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'],             //可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'],                 //可以指定来源是相册还是相机，默认二者都有
            success: function (res) { resolve(res.tempFilePaths[0]); },
            fail: function (err) { reject(err) }
          });
          break;
        case '-3':               //录音
          wx.startRecord({
            success: function (res) {
              wx.saveFile({
                tempFilePath: res.tempFilePath,
                success: function (cres) { resolve(cres.savedFilePath); },
                fail: function (cerr) { reject('录音文件保存错误！') }
              });
            },
            fail: function (err) { reject(err) }
          });
          break;
        case '-4':               //选择视频或拍摄
          wx.chooseVideo({
            sourceType: ['album', 'camera'],
            maxDuration: 60,
            camera: ['front', 'back'],
            success: function (res) {
              wx.saveFile({
                tempFilePath: res.tempFilePath,
                success: function (cres) { resolve(cres.savedFilePath); },
                fail: function (cerr) { reject('视频文件保存错误！') }
              });
            },
            fail: function (err) { reject(err) }
          })
          break;
        case '-5':                    //选择位置
          wx.chooseLocation({
            success: function (res) { resolve({ latitude: res.latitude, longitude: res.longitude }); },
            fail: function (err) { reject(err) }
          })
          break;
        case '-6':                     //选择文件
          resolve('选择文件');
          break;
        default:
          resolve(false);
      }
    }).then((content) => {
      let sI = mid.indexOf(sIndex);
      if (content) {
        artArray.splice(that.data.selectd, instif, { t: sIndex, e: '点击此处输入' + mgrids[sI] + '的说明', c: content });
      } else {
        artArray.splice(that.data.selectd, instif, { t: sIndex, e: mgrids[sI] });
      };
      that.setData({ 'vData.details': artArray, enIns: true });
      if (nt.indexOf(sIndex) >= 0) {
        let nts;
        switch (sIndex) {
          case '-1':
            nts = '/util/goodssct/goodssct';
            break;
          case '-6':
            nts = '/util/filesct/filesct';
            break;
          default: break;
        }
        wx.navigateTo({ url: nts + '?reqName="details"' })
      }
    }).catch(console.error);
  },

  fSubmit: function (e) {
    var that = this;
    let approvalID = parseInt(that.data.pNo);        //流程序号
    var approvalClass = require('../model/procedureclass.js')[approvalID];       //流程定义和数据结构
    var subData = e.detail.value;
    if (Array.isArray(that.data.vData.details)) {
      for (let i = 0; i < that.data.vData.details.length; i++) {
        that.data.vData.details[i].e = subData['ade' + i];
        that.data.vData.details[i].c = subData['adc' + i];
      };
    };
    var emptyField = '';
    var evField = {};                   //检查处理每个请求字段
    for (let i = 0; i < approvalClass.pSuccess.length; i++) {
      if (approvalClass.pSuccess[i].gname in subData) {
        if (subData[approvalClass.pSuccess[i].gname]) {
          that.data.vData[approvalClass.pSuccess[i].gname] = subData[approvalClass.pSuccess[i].gname];
        } else { emptyField += '《' + approvalClass.pSuccess[i].p + '》'; }
      }
    };
    var sFilePath = new Promise(function (resolve, reject) {         //本地媒体文件归类
      let filePaths = [];
      const mdtn = ['pic', 'thumb', 'vidio', 'file'];
      const mdt = ['-2', '-3', '-4', '-6'];
      that.data.reqData.forEach(nField => {
        switch (nField.t) {
          case 'eDetail':
            for (let a = 0; a < that.data.vData[nField.gname].length; a++) {
              if (mdt.indexOf(that.data.vData[nField.gname][a].t) >= 0) {     //该字段正文的内容为媒体
                filePaths.push({ na: [nField.gname, a], fPath: that.data.vData[nField.gname][a].c, fType: 2, fn: 2 });
              }
            }
            break;
          case 'pics':
            for (let b = 0; b < that.data.vData[nField.gname].length; b++) {     //该字段为图片组
              filePaths.push({ na: [nField.gname, b], fPath: that.data.vData[nField.gname][b], fType: 2, fn: 1 });
            }
            break;
          default:
            if (mdtn.indexOf(nField.t) >= 0) {            //该字段为媒体
              filePaths.push({ na: [nField.gname, -1], fPath: that.data.vData[nField.gname], fType: 2, fn: 0 });
            }
            break;
        }
      });
      wx.getSavedFileList({
        success: function (res) {
          let saveFileList = res.fileList.map(fList => { return fList.filePath });
          let saveFiles = filePaths.map(sfPath => {
            return new Promise((resolve, reject) => {
              if (saveFileList.indexOf(sfPath.fPath) >= 0) {
                sfPath.fType = 1;
                resolve(sfPath);
              } else {
                wx.getFileInfo({
                  filePath: sfPath.fPath,
                  success: function () {
                    sfPath.fType = 0;
                    resolve(sfPath);
                  },
                  fail: () => { resolve(sfPath) }
                })
              }
            });
          });
          Promise.all(saveFiles).then((sFileList) => { resolve(sFileList) });
        },
        fail: function () { resolve([]) }
      });
    });
    switch (e.detail.target.id) {
      case 'fdeldata':                                 //删除内容部分选中的字段
        if (that.data.selectd >= 0) {                         //内容部分容许删除
          that.data.vData.details.splice(that.data.selectd, 1);
          that.setData({ 'vData.details': that.data.vData.details, enMenu: 'none' });
        } else { wx.showToast({ title: '此处禁止删除！' }) }
        break;
      case 'fenins':                   //允许显示插入菜单
        that.setData({ enMenu: 'none', enIns: false })      //‘插入、删除、替换’菜单栏关闭
        break;
      case 'fupdate':                          //替换数据
        that.setData({ enMenu: 'none' })
        that.farrData(that.data.vData.details[that.data.selectd].t, 1);      //选择多媒体项目内容;
        break;
      case 'fStorage':
        if (that.data.targetId == '0') {           //编辑内容不提交流程审批,在本机保存
          sFilePath.then(fileArr => {
            let tFileArr = fileArr.filter(function (tFile) { return tFile.fType == 0 });
            if (tFileArr.length > 0) {
              let sFileArr = tFileArr.map((tFileStr) => {
                return new Promise((resolve, reject) => {
                  wx.saveFile({
                    tempFilePath: tFileStr.fPath,
                    success: function (res2) {
                      switch (tFileStr.fn) {
                        case 0:
                          that.data.vData[tFileStr.na[0]] = res2.savedFilePath;
                          break;
                        case 1:
                          that.data.vData[tFileStr.na[0]][tFileStr.na[1]] = res2.savedFilePath;
                          break;
                        case 2:
                          that.data.vData[tFileStr.na[0]][tFileStr.na[1]].c = res2.savedFilePath;
                          break;
                      }
                      resolve(res2.savedFilePath)
                    }
                  })
                })
              });
              Promise.all(sFileArr).then(() => {
                app.aData[that.data.pNo][that.data.dObjectId] = that.data.vData;
              }).catch(console.error);
            } else { app.aData[that.data.pNo][that.data.dObjectId] = that.data.vData; }
          });
        }
        break;
      case 'fSave':
        if (emptyField) {
          wx.showToast({ title: emptyField + '等项目未输入，请检查。', duration: 7000 })
        } else {
          sFilePath.then(sFileLists => {
            let sFileArr = sFileLists.filter(sFile => { return sFile.fType < 2 });
            wx.showLoading({ title: '文件提交中' });
            return new Promise((resolve, reject) => {
              if (sFileArr.length > 0) {
                sFileArr.map(sFileStr => () => new AV.File('filename', { blob: { uri: sFileStr.fPath, }, }).save().then(sfile => {
                  if (sFileStr.fType == 1) { wx.removeSavedFile({ filePath: sFileStr.fPath }) };      //删除本机保存的文件
                  switch (sFileStr.fn) {
                    case 0:
                      that.data.vData[sFileStr.na[0]] = sfile.url();
                      break;
                    case 1:
                      that.data.vData[sFileStr.na[0]][sFileStr.na[1]] = sfile.url();
                      break;
                    case 2:
                      that.data.vData[sFileStr.na[0]][sFileStr.na[1]].c = sfile.url();
                      break;
                    default:
                      break;
                  }
                })
                ).reduce(
                  (m, p) => m.then(v => Promise.all([...v, p()])),
                  Promise.resolve([])
                  ).then(files => { resolve(files) }).catch(console.error)
              } else { resolve('no files save') };
            })
          }).then((sFiles) => {
            if (that.data.targetId == '0') {
              let nApproval = AV.Object.extend('sengpi');        //创建审批流程
              var fcApproval = new nApproval();
              fcApproval.set('dProcedure', approvalID);                //流程类型
              fcApproval.set('dResult', 0);                //流程处理结果0为提交
              fcApproval.set("unitName", app.uUnit.uName);                 //申请单位
              fcApproval.set("sponsorName", app.globalData.user.uName);         //申请人
              fcApproval.set("unitId", app.uUnit.objectId);        //申请单位的ID
              fcApproval.set('dIdear', [{ un: app.globalData.user.uName, dt: new Date(), di: '提交流程', dIdear: '发起审批流程' }]);       //流程处理意见
              let cUserName = {};
              let cManagers = [[app.globalData.user.objectId]];
              cUserName[app.globalData.user.objectId] = app.globalData.user.uName;
              let puRoles = approvalClass.puRoles;
              let suRoles = approvalClass.suRoles;
              if (app.uUnit.unitType > 1 && puRoles) {          //单位类型为企业且有本单位审批设置
                let pRolesNum = 0, pRoleUser;
                for (let i = 0; i < puRoles.length; i++) {
                  pRoleUser = [];
                  app.uUnit.unitUsers.forEach((pUser) => {
                    if (pUser.userRolName == puRoles[i]) {
                      pRoleUser.push(pUser.objectId);
                      cUserName[pUser.objectId] = pUser.uName;
                    }
                  })
                  if (pRoleUser.length != 0) {
                    pRolesNum = pRolesNum + 1;
                    cManagers.push(pRoleUser);
                  }
                };
                if (pRolesNum == 0 && app.globalData.user.userRolName != 'admin') {
                  app.uUnit.unitUsers.forEach((pUser) => {
                    if (pUser.userRolName == 'admin') {
                      cManagers.push([pUser.objectId]);
                      cUserName[pUser.objectId] = pUser.uName;
                    }
                  })
                }
              }
              if (suRoles) {                 //上级单位类型有审批设置
                let sRolesNum = 0, sRoleUser;
                if (!app.sUnit.unitType) {     //单位类型为企业
                  for (let i = 0; i < suRoles.length; i++) {
                    sRoleUser = [];
                    app.sUnit.unitUsers.forEach((sUser) => {
                      if (sUser.userRolName == suRoles[i]) {
                        sRoleUser.push(sUser.objectId);
                        cUserName[sUser.objectId] = sUser.uName;
                      }
                    });
                    if (sRoleUser.length != 0) {
                      sRolesNum = sRolesNum + 1;
                      cManagers.push(sRoleUser);
                    }
                  }
                }
                if (sRolesNum == 0) {
                  app.sUnit.unitUsers.forEach((sUser) => {
                    if (sUser.userRolName == 'admin') {
                      cManagers.push([sUser.objectId]);;
                      cUserName[sUser.objectId] = sUser.uName;
                    }
                  })
                }
              }
              let managers = [];
              cManagers.forEach((manger) => { manger.forEach((mUser) => { managers.push(mUser) }) });
              fcApproval.set('cManagers', cManagers);             //处理人数组
              fcApproval.set('cUserId', managers);             //处理人数组
              fcApproval.set('cUserName', cUserName);             //处理人姓名JSON
              fcApproval.set('cInstance', 1);             //下一处理节点
              fcApproval.set('cFlowStep', cManagers[1]);              //下一流程审批人
              fcApproval.set('dObject', that.data.vData);            //流程审批内容
              var acl = new AV.ACL();      // 新建一个 ACL 实例
              acl.setRoleReadAccess(app.uUnit.objectId, true);
              acl.setRoleReadAccess(app.sUnit.objectId, true);
              managers.forEach((mUser) => {
                acl.setWriteAccess(mUser, true);
                acl.setReadAccess(mUser, true);
              })
              fcApproval.setACL(acl);         // 将 ACL 实例赋予fcApproval对象
              fcApproval.save().then((resTarget) => {
                app.aData[resTarget.objectId] = fcApproval.toJSON();
                wx.showToast({ title: '流程已提交,请查询审批结果。', duration: 2000 }) // 保存成功
                setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
              }).catch(wx.showToast({ title: '提交保存失败,请重试。', duration: 2000 })) // 保存失败
            } else {
              app.aData[that.data.targetId][app.uUnit.objectId].dObject = that.data.vData;
              wx.navigateBack({ delta: 1 });
            }
            wx.hideLoading();
          }).catch(console.error);
        }
        break;
    };
  }
}

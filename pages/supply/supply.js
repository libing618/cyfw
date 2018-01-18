// 供货操作
const AV = require('../../libs/leancloud-storage.js');
const cargoPlan = require('../../model/cargoPlan.js');
const supplies = require('../../model/supplies.js');
const oClass = require('../../model/operationclass.js')[1];
const { checkRols,indexClick,binddata } = require('../../util/util.js');

var app = getApp();
Page ({
  data: {
    oState: 0,                       //流程的序号
    mPage: [],                 //页面管理数组
    dObjectId: '0',             //已建数据的ID作为修改标志，0则为新建
    pageData: [],
    iClicked: '0',
    reqData:[{gname:"nowPacking", p: '出品包装号',t: "inScan",n:0}],
    nowPacking: '',
    specCount: {}
  },
  cargoPlans: {},               //定义成品查询对象
  suppliesArr: {},
  indexField:'',      //定义索引字段
  sumField:'',          //定义汇总字段

  fetchData: function(oState) {
    var that = this;
    let supplieQuery = new AV.Query(supplies);
    supplieQuery.select(['tradeId','quantity','proName','cargo','cargoName','address','paidAt'])
    supplieQuery.ascending('paidAt');           //按付款时间升序排列
    switch (oState){
      case 0:
        supplieQuery.edoesNotExist('confirmer');      //查询确认人为空的记录
        break;
      case 1:
        supplieQuery.notEqualTo('quantity','deliverTotal');      //查询发货量不等于订单的记录
        break;
      case 2:
        supplieQuery.notEqualTo('quantity','receiptTotal');      //查询到货不等于订单的记录
        supplieQuery.greaterThan('serFamily',1);
        break;
    }
    supplieQuery.equalTo('unitId',app.uUnit.objectId);                //只能查本单位数据
    supplieQuery.limit(1000);                      //取最大数量
    const setReqData = this.setReqData.bind(this);
    return Promise.all([supplieQuery.find().then(setReqData), supplieQuery.subscribe()]).then([reqData,subscription])=> {
      this.subscription = subscription;
      if (this.unbind) this.unbind();
      this.unbind = binddata(subscription, arp, setReqData);
    }).catch(console.error)
  },

  setReqData: function(readData){
    let pageData = {}, mPage = {}, indexList = [], aPlace = -1, iField, iSum = {}, mChecked = {},qCount = {};
    readData.forEach(onedata => {
      pageData[onedata.id] = onedata;
      iField = onedata.get(this.indexField);                  //索引字段读数据数组
      if (indexList.indexOf(iField)<0) {
        indexList.push(iField);
        mPage[iField] = [onedata.id];                   //分类ID数组增加对应ID
        iSum[iField] = onedata.get(this.sumField);
        qCount[iField] = onedata.get('quantity');
      } else {
        iSum[iField] += onedata.get(this.sumField);
        qCount[iField] += onedata.get('quantity');
        mPage[iField].push(onedata.id);
      };
      mChecked[onedata.id] = this.data.oState==0 ? true : false;
    });
    this.setData({indexList,pageData,mPage,iSum,mChecked}) ;
  },

  onLoad: function (ops) {        //传入参数为oState,不得为空
    var that = this;
    if (checkRols(app.globalData.user.userRolName,oClass.ouRoles[ops.oState])){  //检查用户操作权限
      that.indexField = oClass.oSuccess[ops.oState].indexField;
      that.sumField = oClass.oSuccess[ops.oState].sumField;
      new AV.Query(cargoPlan)
      .equalTo('unitId',app.uUnit.objectId)
      .select(['unitId','cargo','cargoStock','payment','delivering'])
      .find().then(cargoPlans=>{
        if (cargoPlans){
          cargoPlans.forEach(cPlan=>{
            that.cargoPlans[cPlan.cargo] = cPlan;
            that.data.cargoCount[cPlan.cargo] = cPlan.cargoStock;
          });
          that.setData({cargoCount:that.data.cargoCount,oState:ops.oState});
          that.indexClick = indexClick ;
        } else {
          wx.showToast({ title: '无库存数据！', duration: 2500 });
          setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
        }
      }).catch(console.error);
      wx.setNavigationBarTitle({
        title: app.uUnit.nick+'的'+oClass.oprocess[ops.oState]
      });
    } else {
      wx.showToast({ title: '权限不足请检查', duration: 2500 });
      setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
    };
  },

  onUnload: function(){
    this.subscription.unsubscribe();
    this.unbind();
  },

  i_inScan: require()'../../libs/weimport.js').i_inScan,

  fSupplies: function(e){
    var that = this;
    let specId = e.currentTarget.id;
    let confimate = that.data.quantity[specId];
    let setSingle = [];
    that.cargoPlans[specId].set('cargoStock':that.cargoPlans[specId].cargoStock-confimate);
    that.cargoPlans[specId].set('payment':that.cargoPlans[specId].payment-confimate);
    that.cargoPlans[specId].set('delivering':that.cargoPlans[specId].delivering+confimate);
    that.cargoPlans[specId].save().then(()=>{
      that.data.mPage[specId].forEach(cId=>{
        that.supplies[cId].set();

      })
      e.detail.value['chSpec-'+specId].forEach(chSpec=>{})
    })
  },

  onShareAppMessage: function () {    // 用户点击右上角分享
    return {
      title: '侠客岛创业服务平台', // 分享标题
      desc: '扶贫济困，共享良品。', // 分享描述
      path: '/pages/index/index' // 分享路径
    }
  }
})

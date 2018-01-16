// 供货操作
const AV = require('../../libs/leancloud-storage.js');
const prosPlan = require('../../model/prosplan.js');
const supplies = require('../../model/supplies.js');
const { checkRols,idcheck,binddata } = require('../../util/util.js');

var app = getApp();
Page ({
  data: {
    oState: 0,                       //流程的序号
    mPage: [],                 //页面管理数组
    dObjectId: '0',             //已建数据的ID作为修改标志，0则为新建
    pageData: [],
    specCount: {}
  },
  specPlans: {},               //定义索引字段
  suppliesArr: {},
  indexField: 'cargo',      //定义索引字段
  sumField: 'quantity',          //定义汇总字段

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
        that.indexField = 'address';
        that.sumField = 'deliverTotal';
        break;
      case 2:
        supplieQuery.notEqualTo('quantity','receiptTotal');      //查询到货不等于订单的记录
        supplieQuery.greaterThan('serFamily',1);
        that.indexField = 'address';
        that.sumField = 'receiptTotal';
        break;
    }
    supplieQuery.equalTo('unitId',app.uUnit.objectId);                //只能查本单位数据
    supplieQuery.limit(1000);                      //取最大数量
    supplieQuery.find().then(arp => {
      if (arp) { this.setReqData(arp) };
      return supplieQuery.subscribe();
    }).then(subscription=>{
      this.subscription = subscription;
      if (this.unbind) this.unbind();
      this.unbind = binddata(subscription, arp, setReqData);
    }).catch(console.error)
  },

  setReqData: function(readData){
    var that = this;
    let aData = {}, mData = {}, indexList = [], aPlace = -1, iField, iSum = {}, mChecked = {},qCount = {};
    readData.forEach(onedata => {
      aData[onedata.id] = onedata;
      iField = onedata.get(that.indexField);                  //索引字段读数据数组
      if (indexList.indexOf(iField)<0) {
        indexList.push(iField);
        mData[iField] = [onedata.id];                   //分类ID数组增加对应ID
        iSum[iField] = onedata.get(that.sumField);
        qCount[iField] = onedata.get('quantity');
      } else {
        iSum[iField] += onedata.get(that.sumField);
        qCount[iField] += onedata.get('quantity');
        mData[iField].push(onedata.id);
      };
      mChecked[onedata.id] = false;
    });
    indexList.forEach(iRecord=>{ mChecked[iRecord] = true });
    that.setData({indexList,pageData:aData,quantity:iSum,mCheck:mChecked}) ;
  },

  onLoad: function (ops) {        //传入参数为oState,不得为空
    var that = this;
    let oClass = require('../../model/operationclass.js')[1];
    if (checkRols(app.globalData.user.userRolName,oClass.ouRoles[ops.oState])){  //检查用户操作权限
      new AV.Query(prosPlan)
      .equalTo('unitId',app.uUnit.objectId)
      .select(['unitId','cargo','specStock','payment','delivering'])
      .find().then(specPlans=>{
        if (specPlans){
          specPlans.forEach(specPlan=>{
            that.specPlans[specPlan.cargo] = specPlan;
            that.data.specCount[specPlan.cargo] = specPlan.specStock;
          });
          that.setData({specCount:that.data.specCount,oState:ops.oState});
          if (ops.oState==0) { that.idcheck = idcheck };
        } else {
          wx.showToast({ title: '无库存数据！', duration: 2500 });
          setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
        }
      }).catch(console.error);
      wx.setNavigationBarTitle({
        title: app.uUnit.nick+'的'+oClass.oprocess[ops.oState]
      });
    } else {
      wx.showToast({ title: '权限不足，请检查！', duration: 2500 });
      setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
    };
  },

  onUnload: function(){
    this.subscription.unsubscribe();
    this.unbind();
  },

  fSupplies: function(e){
    var that = this;
    let specId = e.currentTarget.id;
    let confimate = that.data.quantity[specId];
    let setSingle = [];
    that.specPlans[specId].set('specStock':that.specPlans[specId].specStock-confimate);
    that.specPlans[specId].set('payment':that.specPlans[specId].payment-confimate);
    that.specPlans[specId].set('delivering':that.specPlans[specId].delivering+confimate);
    that.specPlans[specId].save().then(()=>{
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

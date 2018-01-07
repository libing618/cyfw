const AV = require('../libs/leancloud-storage.js');

class prosPlan extends AV.Object {
  get unitId() { return this.get('unitId'); }
  set unitId(value) { this.set('done', unitId); }

  get specObjectId() { return this.get('specObjectId'); }
  set specObjectId(value) { this.set('specObjectId', value); }

  get count() { return this.get('count'); }
  set count(value) { this.set('count', value); }

  get yield() { return this.get('yield'); }    //产量
  set yield(value) { this.set('yield', value); }
  
  get reserve() { return this.get('reserve'); }    //预定
  set reserve(value) { this.set('reserve', value); }

  get payment() { return this.get('payment'); }    //付款
  set payment(value) { this.set('payment', value); }

  get delivering() { return this.get('delivering'); }    //发货
  set delivering(value) { this.set('delivering', value); }

  get delivered() { return this.get('delivered'); }    //交货
  set delivered(value) { this.set('delivered', value); }
}

AV.Object.register(prosPlan, 'prosPlan');
module.exports = prosPlan;

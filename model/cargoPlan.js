const AV = require('../libs/leancloud-storage.js');

class cargoPlan extends AV.Object {
  get unitId() { return this.get('unitId'); }
  set unitId(value) { this.set('done', unitId); }

  get cargo() { return this.get('cargo'); }
  set cargo(value) { this.set('cargo', value); }

  get canSupply() { return this.get('canSupply'); }    //可供应量
  set canSupply(value) { this.set('canSupply', value); }

  get cargoStock() { return this.get('cargoStock'); }    //库存
  set cargoStock(value) { this.set('cargoStock', value); }

  get yield() { return this.get('yield'); }    //产量
  set yield(value) { this.set('yield', value); }

  get reserve() { return this.get('reserve'); }    //预定未付款
  set reserve(value) { this.set('reserve', value); }

  get payment() { return this.get('payment'); }    //付款未发货
  set payment(value) { this.set('payment', value); }

  get delivering() { return this.get('delivering'); }    //发货未收到
  set delivering(value) { this.set('delivering', value); }

  get delivered() { return this.get('delivered'); }    //交货且签收
  set delivered(value) { this.set('delivered', value); }
}

AV.Object.register(cargoPlan, 'cargoPlan');
module.exports = cargoPlan;

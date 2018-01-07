const AV = require('../libs/leancloud-storage.js');

class supplies extends AV.Object {
  get tradeId() { return this.get('tradeId'); }
//  set tradeId(value) { this.set('tradeId', value); }

  get user() { return this.get('user'); }
//  set user(value) { this.set('user', value); }

  get ip() { return this.get('ip'); }
//  set ip(value) { this.set('ip', value); }

  get quantity() { return this.get('quantity'); }
//  set quantity(value) { this.set('quantity', value); }

  get proObjectId() { return this.get('proObjectId'); }
//  set proObjectId(value) { this.set('proObjectId', value); }
  get proName() { return this.get('proName'); }

  get tradeType() { return this.get('tradeType'); }
//  set tradeType(value) { this.set('tradeType', value); }

  get prepayId() { return this.get('prepayId'); }
//  set prepayId(value) { this.set('prepayId', value); }

  get serObjectId() { return this.get('serObjectId'); }
//  set serObjectId(value) { this.set('serObjectId', value); }
  get serName() { return this.get('serName'); }

  get specObjectId() { return this.get('specObjectId'); }
//  set specObjectId(value) { this.set('specObjectId', value); }
  get specName() { return this.get('specName'); }

  get address() { return this.get('address'); }
//  set address(value) { this.set('address', value); }

  get unitId() { return this.get('unitId'); }
//  set unitId(value) { this.set('done', unitId); }

  get amount() { return this.get('amount'); }
//  set amount(value) { this.set('amount', value); }

  get paidAt() { return this.get('paidAt'); }
//  set paidAt(value) { this.set('paidAt', value); }

  get confirmer() { return this.get('confirmer'); }
  set confirmer(value) { this.set('confirmer', value); }
}
AV.Object.register(supplies);

module.exports = supplies;

const AV = require('../libs/leancloud-storage.js');
var app = getApp()
class proportions extends AV.Object {
  get unitId() {
    return this.get('unitId');
  }
  set unitId(value) {
    this.set('unitId', app.roleData.uUnit.objectId);
  }

  get channel() {     //渠道分成
    return this.get('channel');
  }
  set channel(value) {
    this.set('channel', value);
  }

  get extension() {     //推广分成
    return this.get('extension');
  }
  set extension(value) {
    this.set('extension', value);
  }

  get mCost() {     //厂家收入占比
    return this.get('mCost');
  }
  set mCost(value) {
    this.set('mCost', value);
  }
}

AV.Object.register(proportions, 'goods');
module.exports = proportions;

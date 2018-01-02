const AV = require('../libs/leancloud-storage.js');
var unitId = getApp().uUnit.objectId
class proportions extends AV.Object {
  get unitId() {
    return this.get('unitId');
  }
  set unitId(value) {
    this.set('unitId', unitId);
  }
  get prObjectId() {
    return this.get('prObjectId');
  }
  set prObjectId(value) {
    this.set('prObjectId', value);
  }
  get channel() {
    return this.get('channel');
  }
  set channel(value) {
    this.set('channel', value);
  }

  get extension() {
    return this.get('extension');
  }
  set extension(value) {
    this.set('extension', value);
  }

  get mCost() {
    return this.get('mCost');
  }
  set mCost(value) {
    this.set('mCost', value);
  }
}

AV.Object.register(proportions, 'proportions');
module.exports = proportions;

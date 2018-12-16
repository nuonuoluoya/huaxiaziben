const crypto = require('crypto');
const uuid = require('uuid/v4');

module.exports = {
  md5 (str) {
    let obj = crypto.createHash('md5');
    obj.update(str);
    return obj.digest('hex');
  },
  uuid () {
    return uuid().replace(/\-/g, '');
  }
}

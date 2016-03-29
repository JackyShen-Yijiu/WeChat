var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 门店二维码信息
var QRInfoSchema = new Schema({
    fcode: { type: String }, // 渠道码
    sceneinfo: { type: String }, // 门店信息
    qrtype: { type: Number, default: 0 }, // 0.普通渠道二维码 1.利客门店二维码 2.利客用户二维码
    url: { type: String } // 二维码对应的字符串
});

module.exports = mongoose.model('qrinfo', QRInfoSchema);

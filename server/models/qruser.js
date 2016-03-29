var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 门店二维码信息
var QRUserSchema = new Schema({
    name: { type: String }, // 真实姓名
    idcard: { type: String }, // 身份证后6位
    openid: { type: String }, // 微信openid
    fcode: { type: String }, // 门店标示／渠道二维码
    createtime: { type: Date, default: Date.now() } // 创建时间
});

module.exports = mongoose.model('qruser', QRUserSchema);

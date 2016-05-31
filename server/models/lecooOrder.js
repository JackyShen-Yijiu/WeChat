var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema = Schema({
    mobile: String,
    name: String,
    idNo: String, // 身份证后六位
    storeName: String, // 门店名称
    openid: String, // 微信id
    schoolInfo: {
        name: String,
        address: String,
        phone: String,
        lesson: String, // 班型
        price: Number, // 价格
        trainTime: String // 练车时间
    },
    manageMobile: [String], // 管理手机号
    payType: {type:Number, default: 1}, // 1.现场支付  2.微信支付
    status: {type: Number, default: 1}, // 1.已报名 2.已创建 3.已支付 4.已取消
    wxPayInfo: String, // 微信订单信息
    createTime: {type: Date, default: Date.now()},
    modifyTime: {type: Date, default: Date.now()},
    modifyMobile: String // 修改手机号
});

module.exports = mongoose.model('LecooOrder', OrderSchema);

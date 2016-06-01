var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var idg = require('../common/idgenerator');

var OrderSchema = Schema({
    id: {type: Number, unique: true},
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

OrderSchema.pre('save', function(next) {
    var order = this;
    // 获得一个新ID
    idg.getNewID('LecooOrder', function(newid) {
        if(newid) {
            order.id = newid;
            next();
        }
    });
});

module.exports = mongoose.model('LecooOrder', OrderSchema);

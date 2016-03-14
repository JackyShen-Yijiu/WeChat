/**
 * Created by v-yaf_000 on 2016/3/11.
 */

var  app=require("../../config").weixinconfig;
var  merchant=require("../../config").merchant;
var fs=require("fs");
var WXPay = require('weixin-pay');

var wxpay = WXPay({
    appid: app.id,
    mch_id: merchant.id,
    partner_key:merchant.key , //微信商户平台API密钥
    pfx: fs.readFileSync('./apiclient_cert.p12'), //微信商户平台证书
});

//wxpay.createUnifiedOrder({
//    body: '扫码支付测试',
//    out_trade_no: '20140703'+Math.random().toString().substr(2, 10),
//    total_fee: 1,
//    spbill_create_ip: '192.168.2.210',
//    notify_url: 'http://wxpay_notify_url',
//    trade_type: 'JSAPI',
//    product_id: '1234567890',
//    openid:"o-3c4t3jih2KzY_V25ug_nPt8tWs"
//}, function(err, result){
//    console.log(err);
//    console.log(result);
//});
// 返回参数
//{ return_code: 'SUCCESS',
//    return_msg: 'OK',
//    appid: 'wxc360e212be5b3bb4',
//    mch_id: '1321096401',
//    nonce_str: 'OkmnNcbs77YmXGjd',
//    sign: 'DCF7B59706C7583B9174AB2F3B9CEBF8',
//    result_code: 'SUCCESS',
//    prepay_id: 'wx201603141735317d227fc19f0870670307',
//    trade_type: 'JSAPI' }
exports.createUnifiedOrder=function(payinfo,callback){
    wxpay.createUnifiedOrder(payinfo,function(err,data){
        console.log(data);
        callback(err,data);
    })
}

exports.getBrandWCPayRequestParams=function(payinfo,callback){
    wxpay.getBrandWCPayRequestParams(payinfo,function(err,data){
        console.log(data);
        callback(err,data);
    })
}


exports.sign=function(parm){
    return wxpay.sign(parm);
}
exports.paycallback=wxpay.useWXCallback(function(msg, req, res, next){
    // 处理商户业务逻辑
    console.log(msg);
    // res.success() 向微信返回处理成功信息，res.fail()返回失败信息。
    res.success();
})


/**
 * Created by v-yaf_000 on 2016/3/11.
 */

var  app=require("../../config").weixinconfig;
var  merchant=require("../../config").merchant;
var fs=require("fs");
var WXPay = require('weixin-pay');
var mongodb = require('../common/mongodb');
var WeiXinPayNotice =mongodb.WeiXinPayNotice;
var LecooOrderModel = mongodb.LecooOrderModel;

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
    console.log("收到微信支付回传");
    console.log(msg);
    var tempnotice = new WeiXinPayNotice(msg);
    tempnotice.save(function (err, savenoticedata) {
        if (err) {
            res.fail();
        }

        if (msg.return_code == "FAIL") {
            savenoticedata.is_deal = 4;
            savenoticedata.dealreamk = "结果错误："+msg.return_msg;
            savenoticedata.save(function (err, data) {

            });
            res.success();
        } else if (msg.result_code == "FAIL"){
            savenoticedata.is_deal = 4;
            savenoticedata.dealreamk = "结果错误："+ msg.err_code + msg.err_code_des;
            savenoticedata.save(function (err, data) {

            });
        } else if (msg.result_code == "SUCCESS") {

            LecooOrderModel.findById(msg.out_trade_no, function(err, lecooOrder) {
                if (err) {
                    savenoticedata.is_deal = 2;
                    savenoticedata.dealreamk = "查询订单失败：" + err;
                    savenoticedata.save(function (err, data) {

                    });
                    res.fail();
                }

                if (!lecooOrder) {
                    savenoticedata.is_deal = 2;
                    savenoticedata.dealreamk = "没有查询到订单";
                    savenoticedata.save(function (err, data) {

                    });
                    res.success();
                }

                if (msg.total_fee != lecooOrder.schoolInfo.price * 100) {
                    savenoticedata.is_deal = 2;
                    savenoticedata.dealreamk = "订单金额不对无法完成支付";
                    savenoticedata.save(function (err, data) {

                    });
                    res.fail();
                }

                LecooOrderModel.update({mobile: lecooOrder.mobile, status: 2}, {
                    status: 3,
                    modifyTime: Date.now()
                }, function(err, numAffected) {
                    if(err) {
                        res.end("fail");
                    }
                    res.end("success");
                });

                savenoticedata.is_deal = 1; //成功
                savenoticedata.dealreamk = "保存订单更新成功";
                savenoticedata.save(function (err, data) {
                });
                res.success();
            });

        } else {
            savenoticedata.is_deal = 3; //暂时不用处理
            savenoticedata.dealreamk = "暂时不用处理";
            savenoticedata.save(function (err, data) {

            });
            res.success();
        }
        res.success();
    })
    res.success();
})

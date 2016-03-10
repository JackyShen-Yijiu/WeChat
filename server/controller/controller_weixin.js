/**
 * Created by v-yaf_000 on 2016/3/8.
 */
var nodeWeixinAuth = require('node-weixin-auth');
var  weixinconfig=require("../../config").weixinconfig;
var BaseReturnInfo = require('../common/basereturnmodel.js');

var singature=require("../weixin_server/signature");


//var referaccessToken=function(callback){
//    nodeWeixinAuth.determine(weixinconfig, function (error) {
//        if(!error)
//        {
//            nodeWeixinAuth.tokenize(weixinconfig, function (error, json) {
//                var auth={};
//                auth.lastTime=new Date().getTime();
//                auth.accessToken = json.access_token;
//                nodeWeixinSettings.set(weixinconfig.id, 'auth', auth, function() {
//                    return callback(true);
//                })
//            });
//        }
//        return callback(true);
//
//    });
//}


exports.weixinAck=function(req,res){
    var data = nodeWeixinAuth.extract(req.query);
    nodeWeixinAuth.ack(weixinconfig.token, data, function (error, data) {
        if (!error) {
            res.send(data);
            return;
        }
        switch (error) {
            case 1:
                res.send("INPUT_INVALID");
                break;
            case 2:
                res.send("SIGNATURE_NOT_MATCH");
                break;
            default:
                res.send("UNKNOWN_ERROR");
                break;
        }
    });
};

exports.weiXinJsSdkSign=function(req,res){
    var url = "http://nodeweixin.tunnel.qydev.com/weixin/getjssign";
    var keys = ['body', 'query', 'params'];
    //1.获取传入的URL
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (req[k] && req[k].url) {
            url = req[k].url;
            break;
        }
    }
    singature.getSignature(weixinconfig,url,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0, "获取签名出错"));
        }
        else{
            return res.json(new BaseReturnInfo(1, "",data));
        }
    })

}
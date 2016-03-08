/**
 * Created by v-yaf_000 on 2016/3/8.
 */
var nodeWeixinAuth = require('node-weixin-auth');
var  weixinconfig=require("../../config").weixinconfig;

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
}
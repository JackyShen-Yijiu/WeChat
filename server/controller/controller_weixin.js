/**
 * Created by v-yaf_000 on 2016/3/8.
 */
var nodeWeixinAuth = require('node-weixin-auth');
var  weixinconfig=require("../../config").weixinconfig;
var BaseReturnInfo = require('../common/basereturnmodel.js');
var mongodb = require('../common/mongodb.js');
var singature=require("../weixin_server/signature");
var OAuth = require('wechat-oauth');
var client = new OAuth(weixinconfig.id, weixinconfig.secret);
var  weiXinUserModel=mongodb.WeiXinUserModel;
var weixinpay=require("../weixin_server/wenxinpay");




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

};

exports.authorizeUser=function(req,res){
    var url = client.getAuthorizeURL('http://nodeweixin.tunnel.qydev.com/jzapi/weixin/authorizeUsercallback','','snsapi_userinfo');
    res.redirect(url);
};

exports.authorizeUsercallback=function(req,res,next){
    var code = req.query.code;

    //var User = req.model.UserModel;

    client.getAccessToken(code, function (err, result) {
        if(err){
            console.log(err);
           return res.send("404");
        }
        var accessToken = result.data.access_token;
        var openid = result.data.openid;

        //console.log('token=' + accessToken);
        //console.log('openid=' + openid);

        weiXinUserModel.findOne({"openid":openid}, function(err, user){
            console.log('微信回调后，User.find_by_openid(openid) 返回的user = ' + user);
            if(err ||!user){

                client.getUser(openid, function (err, result) {

                    var oauth_user = result;

                    var _user = new weiXinUserModel(oauth_user);
                    _user.save(function(err, user) {
                        if (err) {
                            next({openid:openid});
                        } else {
                            //res.redirect("http://nodeweixin.tunnel.qydev.com?opend="+openid);
                            next({openid:openid});
                        }
                    });

                });
            }else{
                console.log('根据openid查询，用户已经存在');
                next({openid:openid});

            }
        });
    });
};

exports.paycallback=weixinpay.paycallback;

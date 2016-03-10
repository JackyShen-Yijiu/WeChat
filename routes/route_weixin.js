/**
 * Created by v-yaf_000 on 2016/3/8.
 */
var express=require("express");
var Router=express.Router();
var weixincontroller=require("../server/controller/controller_weixin");

// 微信接口验证
Router.get("/ack",weixincontroller.weixinAck);
// 获取js代码
Router.get("/getjssign",weixincontroller.weiXinJsSdkSign);
// 微信验证用户
Router.get("/authorizeUser",weixincontroller.authorizeUser);
// 微信回传
Router.get("/authorizeUsercallback",weixincontroller.authorizeUsercallback);

module.exports = Router;

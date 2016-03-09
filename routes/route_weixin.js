/**
 * Created by v-yaf_000 on 2016/3/8.
 */
var express=require("express");
var Router=express.Router();
var weixincontroller=require("../server/controller/controller_weixin");

Router.get("/ack",weixincontroller.weixinAck);

module.exports = Router;

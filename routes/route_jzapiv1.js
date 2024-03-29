/**
 * Created by v-yaf_000 on 2016/3/8.
 */
var express = require("express");
var Router = express.Router();
var baseController = require('../server/controller/controller_jzapiv1.js');

// 定位城市
Router.get("/getCityByPosition", baseController.getCityByPosition);

// 获取城市列表
Router.get("/getCity", baseController.getCity);

// 获取驾校列表
Router.get("/getSchoolList", baseController.getSchoolList);

// 获取驾校详情
Router.get("/getSchoolInfo/:school_id", baseController.getSchoolInfo);

// 获取教练列表
Router.get("/getSchoolCoach/:school_id", baseController.getSchoolCoach);

// 用户报名
Router.post("/userApplySchool", baseController.postUserApplySchool);

// 用户支付生成订单
Router.post("/userCreateOrder", baseController.postUserCreateOrder);

// 获取我领取的F吗
Router.get("/getUserAvailableFcode", baseController.getUserAvailableFcode);
// 用户领取Y码
Router.post("/saveUserAvailableFcode",baseController.saveUserAvailableFcode);

// 用户取消订单
Router.get("/userCancelOrder", baseController.userCancelOrder);

// 获取我的订单
Router.get("/getMyOrder", baseController.getMyOrder);
// 根据Y码,获取用户信息
Router.get("/getUserInfoByYCode",baseController.getUserInfoByYCode);


// 获取训练场地
Router.get("/getSchoolTrainingField/:school_id", baseController.getSchoolTrainingField);

// 获取教练详情
Router.get("/getCoachInfo/:coach_id", baseController.getCoachInfo);

// 获取验证码
Router.get("/code/:mobile", baseController.fetchCode);

// 获取二维码
Router.get("/createQrCode", baseController.createQrCode);

// 搜索驾校和教练
Router.get("/searchList", baseController.searchList);

// 获取班车列表
Router.get("/getSchoolBus/:school_id", baseController.getSchoolBus);

// 生成二维码后保存信息
Router.post("/saveQRInfo", function(req, res){

});

// 用户扫码填写信息后保存扫码用户信息
Router.post("/saveQRUser", function(req, res){

});

// 通过驾校的手机号查询驾校信息

// 通过渠道码查询用户、门店信息

//根据班型ID查询班型
//Router.get("/searchClass/:class_id", baseController.searchClass);

// 利客活动报名
Router.post("/userApplyEvent", baseController.postUserApplyEvent);
// 报名活动后选择驾校
Router.put("/userApplyEvent/:id", baseController.putUserApplyEvent);
// 支付报名活动
Router.put("/payApplyEvent/:id", baseController.payApplyEvent);
// 微信支付成功后通知地址
Router.post("/noticeApplyEvent", baseController.noticeApplyEvent);
// 查询订单
Router.get("/userApplyEvent/:id", baseController.getUserApplyEvent);
// 取消订单
Router.delete("/userApplyEvent/:id", baseController.deleteApplyEvent);
// 查询订单
Router.get("/userApplyEvent", baseController.searchUserApplyEvent);

module.exports = Router;

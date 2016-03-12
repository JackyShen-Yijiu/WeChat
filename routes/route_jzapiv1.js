/**
 * Created by v-yaf_000 on 2016/3/8.
 */
var express = require("express");
var Router = express.Router();
var baseController = require('../server/controller/controller_jzapiv1.js');

// 获取城市列表
Router.get("/getCity", baseController.getCity);

// 查询驾校列表
Router.get("/searchSchool", baseController.searchSchool);

// 获取驾校详情
Router.get("/getSchoolInfo/:schoolid", baseController.getSchoolInfo);

// 获取教练列表
Router.get("/getSchoolCoach/:schoolid", baseController.getSchoolCoach);


// 用户报名
Router.post("/userApplySchool",baseController.postUserApplySchool);
// 用户支付生成订单
Router.post("/userCreateOrder",baseController.postUserCreateOrder);
// 获取我领取的F吗
Router.get("/getUserAvailableFcode",baseController.getUserAvailableFcode);


// 获取训练场地
Router.get("/getSchoolTrainingField/:schoolid", baseController.getSchoolTrainingField);

// 获取教练详情
//Router.get("/getCoachInfo/:coachid", baseController.getCoachInfo);


module.exports = Router;
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

//根据班型ID查询班型
//Router.get("/searchClass/:class_id", baseController.searchClass);
module.exports = Router;
/**
 * Created by v-yaf_000 on 2016/3/8.
 */
var express = require("express");
var Router = express.Router();
var baseController = require('../server/controller/controller_jzapiv1.js');
//  获取城市列表
v1.get("/getCity",baseController.getCity);
module.exports = Router;
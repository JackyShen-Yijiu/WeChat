/**
 * Created by v-yaf_000 on 2016/3/8.
 */
var mongodb = require('../common/mongodb.js');

var app = require("../../config").weixinconfig;
var merchant = require("../../config").merchant;
var _ = require("underscore");
var cityInfoModel = mongodb.CityiInfoModel;
var cache = require("../common/cache");
var schoolModel = mongodb.DriveSchoolModel;
var geolib = require('geolib');
var async = require('async');
var cachedata = require('../common/cachedata');
var resbaseschoolinfomode = require("../models/returndriveschoolinfo").resBaseSchoolInfo;
var classtypeModel = mongodb.ClassTypeModel;
var coachmode = mongodb.CoachModel;
var baiDuUtil = require('../common/baidu_util.js');
var trainingfiledModel = mongodb.TrainingFieldModel;
var smsVerifyCodeModel = mongodb.SmsVerifyCodeModel;
var userModel = mongodb.UserModel;
var userAvailableFcodeModel = mongodb.UserAvailableFcodeModel;
var UserPayModel = mongodb.UserPayModel;
var userCountModel = mongodb.UserCountModel;
var weixinUserModel = mongodb.WeiXinUserModel;
var userfcode=mongodb.UserFcode;
var wenpay = require("../weixin_server/wenxinpay");
require('date-utils');
var timeout = 60 * 5;

var getUserCount = function (callback) {
    userCountModel.getUserCountInfo(function (err, data) {
        //userCountModel.findAndModify({}, [],{$inc:{'displayid':1},$inc:{'invitationcode':1}},
        //  {new: true, upsert: true},function(err,data){
        if (err) {
            return callback(err)
        }
        // console.log("get user count:"+ data);
        //  console.log("get user count:"+ data.value.displayid);
        if (!data) {
            var usercountinfo = new userCountModel();
            usercountinfo.save(function (errsave, savedata) {
                if (errsave) {
                    return callback(errsave);
                }
                return callback(null, savedata);
            });
        }
        else {
            return callback(null, data);
        }
    });
};
var defautfun = {
    checkSmsCode: function (mobile, code, callback) {
        smsVerifyCodeModel.findOne({mobile: mobile, smsCode: code, verified: false}, function (err, instace) {
            if (err) {
                return callback("查询出错: " + err);
            }
            if (!instace) {
                return callback("验证码错误，请重新发送");
            }
            //console.log(instace);
            var now = new Date();
            /*console.log(now);
             console.log(instace.createdTime);
             console.log(now-instace.createdTime);*/
            if ((now - instace.createdTime) > timeout * 1000) {
                return callback("您已超时请重新发送");
            }
            instace.verified = true;
            instace.save(function (err, temp) {
                if (err) {
                    return callback("服务器内部错误:" + err);
                }
                return callback(null);
            })

        });
    },
    // 添加一个用户
    addWeiXinUser: function (applyinfo, callback) {
        weixinUserModel.findOne({openid: applyinfo.openid}, function (err, weixinuser) {
            var newuser = new userModel();
            newuser.name = applyinfo.name;
            newuser.mobile = applyinfo.mobile;
            newuser.create = new Date();
            newuser.openid = applyinfo.openid;
            newuser.password = "93e6bf49e71743b00cee035c0f3fc92f";
            newuser.loc.coordinates = [0, 0];
            newuser.bcode=weixinuser?weixinuser.bcode:"";
            newuser.headportrait.originalpic = weixinuser ? weixinuser.headimgurl : "";
            newuser.nickname = weixinuser ? weixinuser.nickname : "";
            newuser.source = 2;
            getUserCount(function (err, usercoutinfo) {
                if (err) {
                    return callback(" 获取用户ID出错 :" + err);
                }
                newuser.displayuserid = usercoutinfo.value.displayid;
                newuser.invitationcode = usercoutinfo.value.invitationcode;
                newuser.save(function (err, newinstace) {
                    if (err) {
                        return callback("保存用户出错" + err);
                    }
                    return callback(null, newinstace);
                });
            })
        })
    },
    // 保存报名信息
    saveUserApplyinfo: function (userid, applyinfo, callback) {
        userModel.findById(new mongodb.ObjectId(userid), function (err, userdata) {
            if (err || !userdata) {
                return callback("不能找到此用户");
            }
            //判断用户状态
            if (userdata.is_lock == true) {
                return callback("此用户已锁定，请联系客服");
            }
            if (userdata.applystate >= 1) {
                return callback("您已经报名成功，请不要重复报名");
            }

            var searchcoachinfo = {};
            if (applyinfo.coachid == -1 || applyinfo.coachid == "-1" || applyinfo.coachid.length < 5) {
                searchcoachinfo.driveschool = new mongodb.ObjectId(applyinfo.schoolid);
                searchcoachinfo.is_validation = true
            } else {
                searchcoachinfo._id = new mongodb.ObjectId(applyinfo.coachid)
            }

            console.log('检查报名驾校和教练')
            // 检查报名驾校和教练
            coachmode.findOne(searchcoachinfo, function (err, coachdata) {
                if (err) {
                    return callback("不能找到报名的教练");
                }
                applyinfo.coachid = coachdata ? coachdata._id : "";
                console.log(applyinfo.coachid);
                // 检查教练
                schoolModel.findById(new mongodb.ObjectId(applyinfo.schoolid), function (err, schooldata) {
                    if (err || !schooldata) {
                        return callback("不能找到报名的驾校");
                    }

                    // 检查所报的课程类型
                    classtypeModel.findById(new mongodb.ObjectId(applyinfo.classtypeid))
                        .populate("vipserverlist")
                        .exec(function (err, classtypedata) {
                            if (err || !classtypedata) {
                                return callback("不能找到该申请课程" + err);
                            }
                            userdata.carmodel = classtypedata.carmodel;
                            userdata.applyschoolinfo.id = applyinfo.schoolid;
                            userdata.applyschoolinfo.name = schooldata.name;
                            userdata.applyschool = applyinfo.schoolid;
                            if (applyinfo.coachid != "") {
                                userdata.applycoach = applyinfo.coachid;
                                userdata.applycoachinfo.id = applyinfo.coachid;
                                userdata.applycoachinfo.name = coachdata ? coachdata.name : "";
                            }
                            userdata.applyclasstype = classtypedata._id;
                            userdata.applyclasstypeinfo.id = classtypedata._id;
                            userdata.applyclasstypeinfo.name = classtypedata.classname;
                            userdata.applyclasstypeinfo.price = classtypedata.price;
                            userdata.applyclasstypeinfo.onsaleprice = classtypedata.onsaleprice;
                            userdata.vipserverlist = classtypedata.vipserverlist;
                            userdata.applystate = 1;
                            userdata.applyinfo.applytime = new Date();
                            userdata.applyinfo.handelstate = 0;
                            userdata.scanauditurl = "http://api.yibuxueche.com/validation/applyvalidation?userid="
                                + userdata._id;
                            userdata.weixinopenid = applyinfo.openid;
                            userdata.paytypestatus = 0;
                            //console.log(userdata);
                            // 保存 申请信息
                            userdata.save(function (err, newuserdata) {
                                //console.log('保存 申请信息');
                                if (err) {
                                    return callback("保存申请信息错误：" + err);
                                }
                                classtypedata.applycount = classtypedata.applycount + 1;
                                if (coachdata) {
                                    coachdata.studentcoount = coachdata.studentcoount + 1;
                                    coachdata.save();
                                }
                                classtypedata.save();

                                console.log('保存申请信息 success');
                                return callback(null, "success");
                            });
                        })

                });
            });

        });


    },
    //redis驾校信息
    redisSchoolInfo: function (schoolid, callback) {
        cache.get("weixinschoolinfo" + schoolid, function (err, data) {
            if (!data) {
                schoolModel.findById(new mongodb.ObjectId(schoolid))
                    .select("_id name")
                    .exec(function (err, schooldata) {
                        cache.set("weixinschoolinfo" + schoolid, schooldata, 60, function (err) {
                        });
                        return callback(null, schooldata);
                    })
            }
            if (data) {
                return callback(null, data);
            }
        })
    }
};

var resbasecoachinfomode = require("../models/returncoachinfo").resBaseCoachInfo;
var smsVerifyCodeModel = mongodb.SmsVerifyCodeModel;
var resendTimeout = 60;
var addtestsmscode = require('../common/sendsmscode').addsmscode;
var smscodemodule = require('../common/sendsmscode').sendsmscode;
var schoolBusRouteModel = mongodb.SchoolBusRouteModel;
//  定位城市
exports.getCityByPosition = function (q, callback) {
    var latitude = q.latitude || 0;
    var longitude = q.longitude || 0;
    //微信坐标转换为百度地图坐标
    baiDuUtil.weixintobaidu(latitude, longitude, function (err, data) {
        //如果坐标为空
        var city = {
            id: 131,
            name: "北京市"
        };
        if (data.lat == 0 && data.lot == 0) {
            return callback(null, city);
        } else {
            //根据坐标显示城市
            baiDuUtil.getCityByPosition(data.lat, data.lot, function (err, cityName) {
                var search = {
                    "name": cityName
                };
                cityInfoModel.find(search)
                    .select("indexid")
                    .exec(function (err, data) {
                        if (err) {
                            return callback("查找出错" + err);
                        }
                        var city = {
                            "id": data[0].indexid,
                            "name": search.name
                        };
                        return callback(null, city);
                    })
            });
        }
    })
};
//  获取城市列表
exports.getCityList = function (callback) {

    cache.get("weiXinGetCity", function (err, data) {
        if (err) {
            return callback(err);
        }
        if (data) {
            return callback(null, data);
        } else {
            var search = {
                "is_open": true
            };
            cityInfoModel.find(search)
                .select("indexid name")
                .sort({index: 1})
                .exec(function (err, data) {
                    if (err) {
                        return callback("查找出错" + err);
                    }
                    var list = _.map(data, function (item, i) {
                        var one = {
                            id: item.indexid,
                            name: item.name
                        }
                        return one;
                    });
                    cache.set(list, 60 * 5, function (err) {
                    });
                    return callback(null, list);
                })
        }
    })
};

// 查询驾校列表
exports.getSchoolList = function (searchinfo, callback) {
    var latitude = searchinfo.latitude || 0;
    var longitude = searchinfo.longitude || 0;
    //微信坐标转换为百度地图坐标
    baiDuUtil.weixintobaidu(latitude, longitude, function (err, data) {
        //查询条件
        var searchcondition = {
            is_validation: true
        };
        //判断城市是否为空
        if (searchinfo.cityname == "") {
            //如果坐标为空
            if (data.lat == 0 && data.lot == 0) {
                searchcondition.city = new RegExp("北京市");
            } else {
                //根据坐标显示城市
                baiDuUtil.getCityByPosition(data.lat, data.lot, function (err, cityName) {
                    searchcondition.city = new RegExp(cityName);
                    var ordercondition = {};
                    // 0 默认 1距离 2 评分  3 价格
                    if (searchinfo.ordertype == 2) {
                        ordercondition.schoollevel = -1;
                    } else if (searchinfo.ordertype == 3) {
                        ordercondition.minprice = 1;
                    }
                    schoolModel.find(searchcondition)
                        .select("")
                        .sort(ordercondition)
                        .skip((searchinfo.index - 1) * searchinfo.count)
                        .limit(searchinfo.count)
                        .exec(function (err, driveschool) {
                            if (err) {
                                console.log(err);
                                callback("查找驾校出错：" + err);
                            } else {
                                process.nextTick(function () {
                                    var driveschoollist = [];
                                    var distance = 0;
                                    driveschool.forEach(function (r, idx) {
                                        if (data.lat == 0 && data.lot == 0) {
                                            // 默认距离为0
                                            distance = -1;
                                        } else {
                                            distance = geolib.getDistance(
                                                {latitude: data.lat, longitude: data.lot},
                                                {latitude: r.latitude, longitude: r.longitude},
                                                10)
                                        }
                                        var oneschool = {
                                            distance: distance,
                                            id: r._id,
                                            name: r.name,
                                            logo_img: r.logoimg,
                                            latitude: r.latitude,
                                            longitude: r.longitude,
                                            address: r.address,
                                            max_price: r.maxprice ? r.maxprice : 0,
                                            min_price: r.minprice ? r.minprice : 0,
                                            school_level: r.schoollevel,
                                            coach_count: r.coachcount ? r.coachcount : 0,
                                            //comment_count: r.commentcount ? r.commentcount : 0,
                                            passing_rate: r.passingrate
                                        };
                                        if (oneschool.name.indexOf("一步") > -1) {
                                            driveschoollist.unshift(oneschool);
                                        }
                                        else {
                                            driveschoollist.push(oneschool);
                                        }
                                    });
                                    if (searchinfo.ordertype == 0 || searchinfo.ordertype == 1) {
                                        driveschoollist = _.sortBy(driveschoollist, "distance")
                                    }
                                    var data1 = {
                                        list: driveschoollist,
                                        city_name: cityName
                                    };
                                    callback(null, data1);
                                });
                            }
                        })
                });
            }
        } else {
            var ordercondition = {};
            // 0 默认 1距离 2 评分  3 价格
            if (searchinfo.ordertype == 2) {
                ordercondition.schoollevel = -1;
            } else if (searchinfo.ordertype == 3) {
                ordercondition.minprice = 1;
            }
            searchcondition.city = new RegExp(searchinfo.cityname);
            schoolModel.find(searchcondition)
                .select("")
                .sort(ordercondition)
                .skip((searchinfo.index - 1) * searchinfo.count)
                .limit(searchinfo.count)
                .exec(function (err, driveschool) {
                    if (err) {
                        console.log(err);
                        callback("查找驾校出错：" + err);
                    } else {
                        process.nextTick(function () {
                            var driveschoollist = [];
                            var distance = 0;
                            driveschool.forEach(function (r, idx) {
                                if (data.lat == 0 && data.lot == 0) {
                                    // 默认距离为0
                                    distance = -1;
                                } else {
                                    distance = geolib.getDistance(
                                        {latitude: data.lat, longitude: data.lot},
                                        {latitude: r.latitude, longitude: r.longitude},
                                        10)
                                }
                                var oneschool = {
                                    distance: distance,
                                    id: r._id,
                                    name: r.name,
                                    logo_img: r.logoimg,
                                    latitude: r.latitude,
                                    longitude: r.longitude,
                                    address: r.address,
                                    max_price: r.maxprice ? r.maxprice : 0,
                                    min_price: r.minprice ? r.minprice : 0,
                                    school_level: r.schoollevel,
                                    coach_count: r.coachcount ? r.coachcount : 0,
                                    //comment_count: r.commentcount ? r.commentcount : 0,
                                    passing_rate: r.passingrate
                                };
                                if (oneschool.name.indexOf("一步") > -1) {
                                    driveschoollist.unshift(oneschool);
                                }
                                else {
                                    driveschoollist.push(oneschool);
                                }
                            });
                            if (searchinfo.ordertype == 0 || searchinfo.ordertype == 1) {
                                driveschoollist = _.sortBy(driveschoollist, "distance")
                            }
                            var data1 = {
                                list: driveschoollist,
                                city_name: searchinfo.cityname
                            };
                            callback(null, data1);
                        });
                    }
                })
        }

    })
};

// 获取驾校详情
exports.getSchoolInfoserver = function (schoolid, callback) {
    async.waterfall([
        //获取该驾校的班型
        function (cb) {
            var searchinfo = {};
            //if (cartype != 0) {
            //    searchinfo = {"carmodel.modelsid": cartype};
            //}
            searchinfo.schoolid = new mongodb.ObjectId(schoolid);
            searchinfo.is_using = true;
            classtypeModel.find(searchinfo)
                .populate("schoolid", " name  latitude longitude address")
                .populate("vipserverlist", " name  color id")
                .exec(function (err, data) {
                    if (err) {
                        return callback("查询出错：" + err);
                    } else {
                        process.nextTick(function () {
                            var classlist = [];
                            data.forEach(function (r) {
                                var oneclass = {
                                    id: r._id,
                                    name: r.classname,
                                    desc: r.classdesc,
                                    price: r.onsaleprice,
                                    car_model: r.carmodel,
                                    car_type: r.cartype,
                                    schedule: r.classchedule//时间
                                };
                                classlist.push(oneclass)
                            });
                            cb(err, {class_list: classlist})
                        });
                    }
                });
        },
        //获取该驾校的教练数
        function (classList, cb) {
            var searchinfo = {
                "driveschool": new mongodb.ObjectId(schoolid), "is_lock": false,
                "is_validation": true
            };
            coachmode.find(searchinfo).count()
                .exec(function (err, count) {
                    if (err) {
                        return callback("查询出错：" + err);
                    } else {
                        classList.coach_num = count;
                        cb(err, classList);
                    }
                });
        },
        //获取该驾校的训练场数目
        function (trainList, cb) {
            var searchInfo = {
                "driveschool": new mongodb.ObjectId(schoolid),
                "is_validation": true
            };
            trainingfiledModel.find(searchInfo).count()
                .exec(function (err, count) {
                    if (err) {
                        return callback("查询出错：" + err);
                    } else {
                        trainList.training_num = count;
                        cb(err, trainList);
                    }
                })
        },
        //获取该驾校的班车数量
        function (busList, cb) {
            schoolBusRouteModel.find({"schoolid": new mongodb.ObjectId(schoolid)}).count()
                .exec(function (err, count) {
                    if (err) {
                        return callback("查询出错：" + err);
                    } else {
                        busList.bus_num = count;
                        cb(err, busList);
                    }
                })
        },
        function (schoolClass, cb) {
            schoolModel.findById(new mongodb.ObjectId(schoolid), function (err, schooldata) {
                if (err || !schooldata) {
                    return callback("查询驾校详情出错：" + err);
                }
                var data = new resbaseschoolinfomode(schooldata);
                data.class_list = schoolClass.class_list;
                data.coach_count = schoolClass.coach_num;
                data.ground_count = schoolClass.training_num;
                data.bus_count = schoolClass.bus_num;
                return cb(null, data);
            });
        }

    ], function (err, result) {
        return callback(err, result);
    });

};


// 获取学校下面的教练
exports.getSchoolCoach = function (coachinfo, callback) {
    //{"name":new RegExp(schoolname)}
    var searchinfo = {
        "driveschool": new mongodb.ObjectId(coachinfo.schoolid), "is_lock": false,
        "is_validation": true
    };
    if (coachinfo.name && coachinfo.name != "") {
        searchinfo.name = new RegExp(coachinfo.name);
    }
    if (coachinfo.classId && coachinfo.classId != "") {
        searchinfo.serverclasslist = coachinfo.classId;
    }
    coachmode.find(searchinfo)
        .populate("serverclasslist", "classname carmodel cartype  price onsaleprice", {"is_using": true})
        .skip((coachinfo.index - 1) * coachinfo.count)
        .limit(coachinfo.count)
        .exec(function (err, coachlist) {
            if (err || !coachlist) {
                console.log(err);
                callback("查找教练出错" + err);

            } else if (coachlist.length == 0) {
                callback(null, coachlist);
            }
            else {
                process.nextTick(function () {
                    var rescoachlist = [];
                    coachlist.forEach(function (r, idx) {
                        rescoachlist.push({
                            id: r._id,
                            name: r.name,
                            head_img: r.headportrait,
                            level: r.starlevel,
                            pass_rate: r.passrate,
                            seniority: r.Seniority,
                            subjects: r.subject
                        });
                    });
                    callback(null, rescoachlist);
                });
            }

        });

};
// 根据Y码 获取用户信息
exports.getUserInfoByYCode= function (fcode, callback) {
  userfcode.findOne({"fcode":fcode},function(err,fcodedata){
      if(err){
          return callback("查找Y码出错："+err);
      }
      if(!fcodedata){
          return callback("没有查询到Y码");
      }
      var  dataModel;
      if(fcodedata.usertype==1){
          dataModel=userModel;
      }
      else{
          dataModel=coachmode;
      }

      dataModel.findById(fcodedata.userid)
          .select("name mobile headportrait")
          .exec(function(err,data){
              if(err){
                  return callback("查找Y码出错："+err)
              }
            return  callback(null,data);
          })
  })
}

//  获取我领取的优惠卷
exports.getUserAvailableFcode = function (openid, callback) {
    userModel.findOne({"weixinopenid": openid})
        .select("_id mobile")
        .exec(function (err, userData) {
            if (err) {
                return callback("查找用户出错");
            }
            if (!userData) {
                return callback("没有查询到用户信息");
            }
            userAvailableFcodeModel.find({$or:[{"userid": userData._id},{"mobile":userData.mobile}]}, function (err, data) {
                if (err) {
                    return callback("查找可用Y码出错");
                }
                var returndatalist = [];
                data.forEach(function (r, index) {
                    var Ycode = {
                        Ycode: r.fcode,
                        name: r.name,
                        date: r.createtime.toFormat("YYYY/MM/DD")
                    };
                    returndatalist.push(Ycode);
                });
                return callback(null, returndatalist);
            })
        })
};

exports.saveUserAvailableFcode=function(mobile,ycode,callback){
    userfcode.findOne({"fcode":ycode},function(err,fcodedata){
        if(err){
            return callback("查找Y码出错："+err);
        }
        if(!fcodedata){
            return callback("没有查询到Y码");
        }
        var  dataModel;
        if(fcodedata.usertype==1){
            dataModel=userModel;
        }
        else{
            dataModel=coachmode;
        }

        dataModel.findById(fcodedata.userid)
            .select("name mobile headportrait")
            .exec(function(err,data){
                if(err){
                    return callback("查找Y码出错："+err)
                }
                var newavailable= new  userAvailableFcodeModel();
                newavailable.mobile=mobile;
                newavailable.createtime=new Date();
                newavailable.fcode=ycode;
                newavailable.name=data.name;
                newavailable.save(function(err,data){
                    if(err){
                        return callback("领取失败:"+err);
                    }
                    else {
                        return callback(null,"success");
                    }

                })

            })
    })
};
//用户取消订单
exports.userCancelOrder = function (openid, callback) {
    userModel.findOne({"weixinopenid": openid})
        .exec(function (err, userData) {
            if (err) {
                return callback("查找用户出错");
            }
            if (!userData) {
                return callback("没有查询到用户信息");
            }
            if (userData.applystate != 1) {
                return callback("该订单无法取消");
            }
            UserPayModel.update({userid: userData._id, userpaystate: 0}, {userpaystate: 4}, function (err, excdata) {
            });

            userData.applystate = 0;  // 未报名
            userData.paytypestatus = 0;
            userData.save(function (err, data) {
                if (err) {
                    return callback("取消订单失败：" + err);
                }
                return callback(null, "", "sucess");
            })
        })


};
// 获取我的订单
exports.getMyOrder = function (openid, callback) {
    userModel.findOne({"weixinopenid": openid})
        .exec(function (err, userData) {
            if (err) {
                return callback("查找用户出错");
            }
            if (!userData) {
                return callback("没有查询到用户信息");
            }
            if (userData.applystate == 0) {
                return callback("用户报名");
            }
            userfcode.findOne({"userid":userData._id})
                .select("userid fcode money")
                .exec(function(err, userfcode) {
                    var returndata = {
                        applyschoolinfo: userData.applyschoolinfo,
                        applyclasstypeinfo: userData.applyclasstypeinfo,
                        applytime: userData.applyinfo.applytime.toFormat("YYYY/MM/DD"),
                        scanauditurl: userData.scanauditurl,
                        orderid: userData._id,
                        name: userData.name,
                        mobile: userData.mobile,
                        logimg: userData.headportrait.originalpic,
                        Ycode: userfcode?userfcode.fcode:"",
                        paytype: userData.paytype,
                        paytypestatus: userData.paytypestatus,
                    };
                    if (userData.applystate == 2) {
                        returndata.paytypestatus = 20
                    }
                    return callback(null, returndata);
                })
        })
};


//生成用户支付订单
exports.postUserCreateOrder = function (applyinfo, callback) {
    userModel.findOne({"weixinopenid": applyinfo.openid})
        .exec(function (err, userData) {
            if (err) {
                return callback("查找用户出错");
            }
            if (!userData) {
                return callback("没有查询到用户信息");
            }
            if (userData.applystate != 1) {
                return callback("该用户无法支付");
            }
            userData.referrerfcode = applyinfo.fcode;
            userData.paytype = applyinfo.paytype;
            userData.bcode = applyinfo.bcode;
            userData.save(function (err, data) {
                if (applyinfo.paytype == 1) {  // 线下报名
                    console.log(data);
                    defautfun.redisSchoolInfo(data.applyschool ? data.applyschool : data.applyschoolinfo.id, function (err, schooldata) {
                        var returndata = {
                            applyschoolinfo: data.applyschoolinfo,
                            applyclasstypeinfo: data.applyclasstypeinfo,
                            paytype: data.paytype,
                            applytime: data.applyinfo.applytime.toFormat("YYYY/MM/DD"),
                            scanauditurl: data.scanauditurl,
                            orderid: data._id
                        };
                        //returndata.applyschoolinfo.logimg=schooldata.logoimg.originalpic;
                        return callback(null, returndata);
                    })

                }
                else if (applyinfo.paytype == 2)  // 微信支付线上报名
                {
                    // 取消以前未支付的订单
                    // 生成新的订单
                    // 向微信发送支付申请
                    UserPayModel.update({
                        userid: data._id,
                        userpaystate: 0
                    }, {userpaystate: 4}, function (err, excdata) {
                        var userpayinfo = new UserPayModel();
                        userpayinfo.userid = data._id;
                        userpayinfo.userpaystate = 0;
                        userpayinfo.creattime = new Date();
                        userpayinfo.payendtime = (new Date()).addDays(3);
                        userpayinfo.applyschoolinfo = data.applyschoolinfo;
                        userpayinfo.applyclasstypeinfo.id = data.applyclasstypeinfo.id;
                        userpayinfo.applyclasstypeinfo.name = data.applyclasstypeinfo.name;
                        userpayinfo.applyclasstypeinfo.price = data.applyclasstypeinfo.price;
                        userpayinfo.applyclasstypeinfo.onsaleprice = data.applyclasstypeinfo.onsaleprice ?
                            data.applyclasstypeinfo.onsaleprice : data.applyclasstypeinfo.price;
                        userpayinfo.paymoney = data.applyclasstypeinfo.onsaleprice;
                        userpayinfo.paychannel = 2;
                        userpayinfo.save(function (err, orderdata) {
                            if (err) {
                                return callback("生成支付订单失败：" + err);
                            }
                            var weixinpayinfo = {
                                body: data.applyschoolinfo.name + " " + data.applyclasstypeinfo.name,
                                out_trade_no: orderdata._id.toString(),
                                total_fee: orderdata.paymoney*100,
                                spbill_create_ip: applyinfo.clientip,
                                notify_url: merchant.notify_url,
                                trade_type: 'JSAPI',
                                openid: applyinfo.openid
                            };

                            wenpay.createUnifiedOrder(weixinpayinfo, function (err, weixinpaydata) {
                                if (err) {
                                    return callback("创建微信订单失败：" + err);
                                }
                                if (weixinpaydata.return_code == "FAIL") {
                                    return callback("创建微信订单失败：" + weixinpaydata.return_msg);
                                }

                                var reqparam = {
                                    appId: app.id,
                                    timeStamp: Math.floor(Date.now() / 1000) + "",
                                    nonceStr: weixinpaydata.nonce_str,
                                    package: "prepay_id=" + weixinpaydata.prepay_id,
                                    signType: "MD5"
                                };
                                reqparam.paySign = wenpay.sign(reqparam);
                                console.log(reqparam);
                                var returndata = {
                                    applyschoolinfo: data.applyschoolinfo,
                                    applyclasstypeinfo: data.applyclasstypeinfo,
                                    paytype: data.paytype,
                                    applytime: data.applyinfo.applytime.toFormat("YYYY/MM/DD"),
                                    orderid: orderdata._id,
                                    weixinpay: reqparam
                                };
                                UserPayModel.update({"_id": orderdata._id},
                                    {$set: {weixinpayinfo: JSON.stringify(reqparam)}}, function (err, data) {
                                    });
                                return callback(null, returndata);
                            });

                        });
                    })

                }

            })
        });
}
// 用户报名

exports.postUserApplySchool = function (applyinfo, callback) {
    // 验证验证码
    defautfun.checkSmsCode(applyinfo.mobile, applyinfo.smscode, function (err, data) {
        if (err) {
            return callback(err);
        }
        userModel.findOne({"weixinopenid": applyinfo.openid}, function (err, userData) {
            if (err) {
                return callback("查找用户出错");
            }
            // 存在微信 用户
            if (userData) {
                console.log("查找 到微信用户");
                if (userData.mobile == applyinfo.mobile) {
                    // 判断是否可以报名
                    if (userData.applystate > 0) {
                        return callback("您已经正在报名，请先取消报名结果");
                    }
                    //用户报名
                    defautfun.saveUserApplyinfo(userData._id, applyinfo, function (err, data) {
                        console.log('报名：' + data);
                        return callback(err, data);
                    })
                }
                else {
                    return callback("您暂时无法使用手机号报名");
                }
            } else {
                console.log("没有查找 到微信用户");
                userModel.findOne({"mobile": applyinfo.mobile}, function (err, userData) {
                    if (err) {
                        return callback("查找用户出错");
                    }
                    if (userData) {
                        console.log("没有查找 到微信用户 ：查找到手机号用户");
                        // 判断是否可以报名
                        if (userData.applystate > 0) {
                            return callback("您已经正在报名，请先取消报名结果");
                        }
                        //用户报名
                        defautfun.saveUserApplyinfo(userData._id, applyinfo, function (err, data) {
                            return callback(err, data);
                        })
                    }
                    else {
                        console.log("没有查找 到微信用户 ：重新注册用户");
                        // 添加用户
                        defautfun.addWeiXinUser(applyinfo, function (err, data) {
                            if (err) {
                                return callback("保存信息出错" + err);
                            }
                            defautfun.saveUserApplyinfo(data._id, applyinfo, function (err, data) {
                                return callback(err, data);
                            })
                        });
                        // 用户报名
                    }
                });
                // 不存在微信用户
            }
        })
    });
    // 验证微信id
    // 验证手机号
};


var getfildbus = function (fildid, buslist) {
    var fildbuslist = [];
    for (var i = 0; i < buslist.length; i++) {
        if (buslist[i].training_id == fildid) {
            fildbuslist.push(fildbuslist);
        }
    }
    return fildbuslist;
};
// 获取驾校下面的练车场
exports.getSchoolTrainingField = function (schoolid, callback) {
    //var searchInfo = {
    //    "driveschool": new mongodb.ObjectId(schoolid),
    //    is_validation: true
    //};
    //trainingfiledModel.find(searchInfo)
    //    .exec(function (err, data) {
    //        if (err || !data) {
    //            return callback("查询出错：" + err);
    //        }
    //        process.nextTick(function () {
    //            var list = [];
    //            data.forEach(function (r, index) {
    //                var listone = {
    //                    id: r._id,
    //                    name: r.fieldname,
    //                    address: r.address,
    //                    //班车
    //                    school_bus: "暂无"
    //                };
    //                list.push(listone);
    //            })
    //
    //            return callback(null, list);
    //        })
    //    })
    // 获取驾校练车场
    cachedata.getSchooltrainingfiled(schoolid, function (err, filddata) {
        cachedata.getSchoolBusRoute(schoolid, function (err, busdata) {
            var a = [];
            for (var i = 0; i < filddata.length; i++) {
                var training_id = filddata[i]._id;
                var fildbus = getfildbus(training_id, busdata);
                var b = {
                    id: filddata[i]._id,
                    name: filddata[i].fieldname,
                    address: filddata[i].address,
                    bus_list: fildbus
                };
                a.push(b);
            }
            return callback(null, a);
        });
    });
};

//获取教练详情
exports.getCoachInfoServer = function (userid, callback) {
    coachmode.findById(new mongodb.ObjectId(userid))
        .populate("tagslist", " _id  tagname tagtype color")
        .populate("trainfield", " _id  pictures fieldname phone")
        .populate("serverclasslist", "classname carmodel cartype classdesc price onsaleprice", {"is_using": true})
        .exec(function (err, coachdata) {
            if (err || !coachdata) {
                return callback("查询教练出错：" + err);
            }
            var returnmodel = new resbasecoachinfomode(coachdata);
            return callback(err, returnmodel);
        });
};

//获取验证码
exports.getCodebyMolile = function (mobilenumber, callback) {
    smsVerifyCodeModel.findOne({mobile: mobilenumber}, function (err, instace) {
            if (err) {
                return callback("发送验证码错误: " + err);
            }
            if (instace) {
                var now = new Date();
                if ((now - instace.createdTime) < resendTimeout * 1000) {
                    return callback("您发送过于频繁，请稍后再发");
                }
                else {
                    instace.remove(function (err) {
                        if (err) {
                            return callback("发送验证码错误: " + err);
                        }
                        if (mobilenumber.substr(0, 8) == "18444444") {
                            addtestsmscode(mobilenumber, callback)
                        } else {
                            smscodemodule(mobilenumber, function (err, response) {
                                return sendSmsResponse(err, response, callback);
                            });
                        }
                    });
                }

            }
            else {
                // now send
                if (mobilenumber.substr(0, 8) == "18444444") {
                    addtestsmscode(mobilenumber, callback)
                } else {
                    smscodemodule(mobilenumber, function (error, response) {
                        return sendSmsResponse(error, response, callback);
                    });
                }
            }


        }
    );
};

// 发送
var sendSmsResponse = function (error, response, callback) {
    if (error || response.statusCode != 200) {
        return callback("Error occured in sending sms: " + error);
    }

    // get back to user
    return callback(null, "Error occured in sending sms: " + error);
};

//搜索驾校以及教练
exports.searchList = function (q, callback) {
    var name = q.name;
    async.waterfall([
        //搜索驾校
        function (cb) {
            schoolModel.find({"name": new RegExp(name)})
                .exec(function (err, driverschool) {
                    if (err) {
                        return callback("搜索失败: " + err);
                    }
                    process.nextTick(function () {
                        var driveschoollist = [];
                        driverschool.forEach(function (r, idx) {
                            var oneschool = {
                                id: r._id,
                                name: r.name,
                                logo_img: r.logoimg,
                                latitude: r.latitude,
                                longitude: r.longitude,
                                address: r.address,
                                max_price: r.maxprice,
                                min_price: r.minprice,
                                passing_rate: r.passingrate
                            };
                            driveschoollist.push(oneschool);
                        });
                        cb(err, {school_list: driveschoollist});
                    });
                });
        },
        function (data, cb) {
            coachmode.find({"name": new RegExp(name)})
                .populate("serverclasslist", "classname carmodel cartype  price onsaleprice", {"is_using": true})
                .exec(function (err, coachlist) {
                    if (err || !coachlist) {
                        console.log(err);
                        callback("查找教练出错" + err);

                    } else if (coachlist.length == 0) {
                        return cb(null, data);
                    }
                    else {
                        process.nextTick(function () {
                            var rescoachlist = [];
                            coachlist.forEach(function (r, idx) {
                                var returnmodel = {
                                    id: r._id,
                                    name: r.name,
                                    head_img: r.headportrait,
                                    level: r.starlevel,
                                    pass_rate: r.passrate,
                                    seniority: r.Seniority,
                                    subjects: r.subject
                                };
                                rescoachlist.push(returnmodel);
                            });
                            data.coach_list = rescoachlist;
                            return cb(null, data);
                        });
                    }

                });

        }
    ], function (err, result) {
        return callback(err, result);
    });
};

// 获取班车列表
exports.getSchoolBus = function (q, callback) {
    schoolBusRouteModel.find({"schoolid": new mongodb.ObjectId(q.schoolId)})
        .exec(function (err, data) {
            if (err || !data) {
                return callback("查询出错：" + err);
            }
            process.nextTick(function () {
                var list = [];
                data.forEach(function (r, index) {
                    var listone = {
                        id: r._id,
                        school_id: r.schoolid,
                        route_name: r.routename,
                        route_content: r.routecontent
                    };
                    list.push(listone);
                });

                return callback(null, list);
            })
        })

};

var LecooOrderModel = mongodb.LecooOrderModel;

// 用户报名活动
exports.postUserApplyEvent = function(params, callback) {
    // 验证验证码
    defautfun.checkSmsCode(params.mobile, params.smscode, function (err, data) {
        if (err) {
            return callback(err);
        }
        // 验证微信用户
        LecooOrderModel.find({mobile: params.mobile}, function(err, lecooOrders) {
            if(err) {
                return callback("查找订单出错");
            }

            if(lecooOrders && lecooOrders.length > 0) {
                var hasOrder = false;
                var hasOrderID = "";
                lecooOrders.forEach(function(lecooOrder) {
                    if(lecooOrder.status == 2 || lecooOrder.status == 3) { // 存在订单: 订单已创建
                        hasOrder = true;
                        hasOrderID = lecooOrder._id;
                        return;
                    }
                });

                if(hasOrder) {
                    return callback("您已经参加了此活动，请先取消报名！", {id: hasOrderID});
                }

                // 自动取消掉 之前报名的信息
                LecooOrderModel.update({mobile: params.mobile, status: 1}, {
                    status: 4,
                    modifyTime: Date.now()
                },  function(err, numAffected) {
                    if(err) {
                        return callback("更新订单出错");
                    }
                    // 保存报名信息
                    saveLecooOrder(params, callback);
                });
            } else {
                // 保存报名信息
                saveLecooOrder(params, callback);
            }
        });
    });
};

function saveLecooOrder(params, callback) {
    var lecooOrderInstance = new LecooOrderModel();
    lecooOrderInstance.openid = params.openid;
    lecooOrderInstance.name = params.name;
    lecooOrderInstance.mobile = params.mobile;
    lecooOrderInstance.idNo = params.idNo;
    lecooOrderInstance.storeName = params.storeName;
    lecooOrderInstance.save(function(err, order) {
        if(err) {
            return callback(err);
        }
        console.log("保存活动报名信息成功");
        return callback(null, order);
    });
}

// 用户报名活动后选择驾校 创建订单
exports.putUserApplyEvent = function(params, callback) {
    LecooOrderModel.findById(params.id, function(err, lecooOrder) {
        if(err) {
            return callback("查找订单出错");
        }
        if(!lecooOrder) {
            return callback("查找订单不存在，请先报名该活动");
        }

        LecooOrderModel.update({_id: param.id}, {
            schoolInfo: {
                name: params.name,
                address: params.address,
                phone: params.phone,
                lesson: params.lesson,
                price: params.price,
                trainTime: params.trainTime,
            },
            status: 2,
            modifyTime: Date.now()
        }, function(err, numAffected) {
            if(err) {
                return callback("更新订单出错");
            }
            LecooOrderModel.findById(lecooOrder._id, function(err, data) {
                return callback(null, data);
            });
        });
    });
};

// 用户支付报名活动
exports.payApplyEvent = function(params, callback) {
    LecooOrderModel.findOne({mobile: params.mobile, _id: params.id, status: 2}, function(err, lecooOrder) {
        if(err) {
            return callback("查找订单出错");
        }
        if(!lecooOrder) {
            return callback("查找订单不存在，请先报名该活动");
        }

        // 判断用户支付类型
        var payType = params.payType * 1;
        if(payType === 1) { // 现场支付
            console.log("现场支付")
            LecooOrderModel.update({mobile: params.mobile, _id: params.id, status: 2}, {
                payType: 1,
                status: 2,
                modifyTime: Date.now()
            }, function(err, numAffected) {
                if(err) {
                    return callback("更新订单出错");
                }
                LecooOrderModel.findById(lecooOrder._id, function(err, data) {
                    return callback(null, data);
                });
            });
        } else if(payType === 2){ // 微信支付 返回微信order信息

            var wxPayInfo = {
                body: lecooOrder.schoolInfo.name + " " + lecooOrder.schoolInfo.lesson,
                out_trade_no: lecooOrder._id + "",
                total_fee: lecooOrder.schoolInfo.price * 100,
                spbill_create_ip: params.clientip || '127.0.0.1',
                notify_url: merchant.notify_event_url,
                trade_type: 'JSAPI',
                openid: lecooOrder.openid
            };

            console.log(wxPayInfo);

            wenpay.createUnifiedOrder(wxPayInfo, function (err, wxPayResp) {
                if (err) {
                    return callback("创建微信订单失败：" + err);
                }
                if (wxPayResp.return_code == "FAIL") {
                    return callback("创建微信订单失败：" + wxPayResp.return_msg);
                }

                var wxPayParams = {
                    appId: app.id,
                    timeStamp: Math.floor(Date.now() / 1000) + "",
                    nonceStr: wxPayResp.nonce_str,
                    package: "prepay_id=" + wxPayResp.prepay_id,
                    signType: "MD5"
                };
                wxPayParams.paySign = wenpay.sign(wxPayParams);

                LecooOrderModel.update({mobile: params.mobile, _id: params.id, status: 2}, {
                    wxPayInfo: JSON.stringify(wxPayParams),
                    payType: 2,
                    status: 2,
                    modifyTime: Date.now()
                }, function(err, numAffected) {
                    if(err) {
                        return callback("更新订单出错");
                    }
                    return callback(null, wxPayParams);
                });
            });
        } else {
            return callback("参数错误");
        }
    });
};

exports.getUserApplyEvent = function(id, callback) {
    LecooOrderModel.findById(id, function(err, data) {
        if(err) {
            return callback("查询订单出错");
        }
        if(data.status == 4 || data.status == 1) {
            return callback("订单不存在");
        }
        return callback(null, data);
    });
};

exports.deleteApplyEvent = function(id, callback) {
    LecooOrderModel.update({'_id': id}, {
        status: 4,
        modifyTime: Date.now()
    }, function(err, numAffected){
        if(err) {
            return callback("更新订单出错");
        }
        return callback(null, "success");
    })
}

exports.searchUserApplyEvent = function(query, callback) {
    var condations = {
        status: {$in: [2, 3]}
    };
    if(query.openid) {
        condations.openid = query.openid;
    }
    if(query.id) {
        condations.id = query.id;
    }
    LecooOrderModel.findOne(condations, function(err, data) {
        if(err) {
            return callback("查询订单出错");
        }
        if(!data) {
            return callback("没有查询到订单");
        }
        var openid = data.openid;
        weixinUserModel.findOne({openid: openid}, function (err, user) {
            if(err) {
                return callback("查询用户信息出错");
            }
            data.avatar = user.headimgurl;
            return callback(null, data);
        });

    });
}

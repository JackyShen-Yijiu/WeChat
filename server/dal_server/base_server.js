/**
 * Created by v-yaf_000 on 2016/3/8.
 */
var mongodb = require('../common/mongodb.js');
var _ = require("underscore");
var cityInfoModel = mongodb.CityiInfoModel;
var cache = require("../Common/cache");
var schoolModel = mongodb.DriveSchoolModel;
var geolib = require('geolib');
var async = require('async');
var cachedata = require('../common/cachedata');
var resbaseschoolinfomode = require("../models/returndriveschoolinfo").resBaseSchoolInfo;
var classtypeModel = mongodb.ClassTypeModel;
var coachmode = mongodb.CoachModel;
var baiDuUtil = require('../common/baidu_util.js');
var trainingfiledModel = mongodb.TrainingFieldModel;
var resbasecoachinfomode = require("../models/returncoachinfo").resBaseCoachInfo;
var smsVerifyCodeModel = mongodb.SmsVerifyCodeModel;
var resendTimeout = 60;
var addtestsmscode = require('../Common/sendsmscode').addsmscode;
var smscodemodule = require('../Common/sendsmscode').sendsmscode;

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
}
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
            }
            cityInfoModel.find(search)
                .select("indexid name")
                .sort({index: 1})
                .exec(function (err, data) {
                    if (err) {
                        return callback("查找出错" + err);
                    }
                    // console.log(data);
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
        //console.log(data);
        //查询条件
        var searchcondition = {
            is_validation: true
        };
        //判断城市是否为空
        if (searchinfo.cityname == "") {
            //如果坐标为空
            console.log("1111");
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
                    console.log(searchcondition);
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
                                            min_price: r.minprice ? r.maxprice : 0,
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
                                    callback(null, driveschoollist);
                                });
                            }
                        })
                });
            }
        } else {
            console.log("2222");
            var ordercondition = {};
            // 0 默认 1距离 2 评分  3 价格
            if (searchinfo.ordertype == 2) {
                ordercondition.schoollevel = -1;
            } else if (searchinfo.ordertype == 3) {
                ordercondition.minprice = 1;
            }
            searchcondition.city = new RegExp(searchinfo.cityname);
            console.log(searchcondition);
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
                                    min_price: r.minprice ? r.maxprice : 0,
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
                            callback(null, driveschoollist);
                        });
                    }
                })
        }

    })
}

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
        function (schoolClass, cb) {
            schoolModel.findById(new mongodb.ObjectId(schoolid), function (err, schooldata) {
                if (err || !schooldata) {
                    return callback("查询驾校详情出错：" + err);
                }
                var data = new resbaseschoolinfomode(schooldata);
                data.class_list = schoolClass.class_list;

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
    coachmode.find(searchinfo)
        .populate("serverclasslist", "classname carmodel cartype  price onsaleprice", {"is_using": true})
        .skip((coachinfo.index - 1) * 10)
        .limit(10)
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
                        var returnmodel = {
                            id: r._id,
                            name: r.name,
                            head_img: r.headportrait,
                            level: r.starlevel,
                            pass_rate: r.passrate,
                            seniority: r.Seniority,
                            subjects: r.subject
                        }
                        rescoachlist.push(returnmodel);
                    });
                    callback(null, rescoachlist);
                });
            }

        });

};


// 用户报名
exports.postUserApplySchool = function (applyinfo, callback) {
}

// 获取驾校下面的练车场
exports.getSchoolTrainingField = function (schoolid, callback) {
    trainingfiledModel.find({"driveschool": new mongodb.ObjectId(schoolid)}, function (err, data) {
        console.log(data);
        if (err || !data) {
            return callback("查询出错：" + err);
        }
        process.nextTick(function () {
            var list = [];
            data.forEach(function (r, index) {
                var listone = {
                    id: r._id,
                    name: r.fieldname,
                    address: r.address,
                    //班车
                    school_bus: "暂无"
                }
                list.push(listone);
            })

            return callback(null, list);
        })
    })
}

//获取用户信息
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
                //console.log(now-instace.createdTime);
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
                                maxprice: r.maxprice,
                                minprice: r.minprice,
                                passingrate: r.passingrate
                            }
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
                                }
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
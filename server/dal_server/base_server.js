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
exports.searchDriverSchool = function (searchinfo, callback) {

    var searchcondition = {
        is_validation: true
    };
    if (searchinfo.cityname != "") {
        searchcondition.city = new RegExp(searchinfo.cityname);
    } else {
        searchcondition.loc = {
            $nearSphere: {
                $geometry: {
                    type: 'Point',
                    coordinates: [searchinfo.longitude, searchinfo.latitude]
                }, $maxDistance: 100000
            }
        }
    }
    if (searchinfo.schoolname != "") {
        searchcondition.name = new RegExp(searchinfo.schoolname);
    }
    //if (searchinfo.licensetype != "" && parseInt(searchinfo.licensetype) != 0) {
    //    searchcondition.licensetype = {"$in": [searchinfo.licensetype]}
    //}
    var ordercondition = {};
    // 0 默认 1距离 2 评分  3 价格
    if (searchinfo.ordertype == 2) {
        ordercondition.schoollevel = -1;
    } else if (searchinfo.ordertype == 3) {
        ordercondition.minprice = 1;
    }
    //微信坐标转换为百度地图坐标
   // var path = "http://api.map.baidu.com/geoconv/v1/?coords=" + searchinfo.latitude + "," +  searchinfo.longitude + "&from=3&to=5&output=json&ak=201bccec2ea05baf5cf275aca9901cc0";

    //console.log(searchcondition);
    //console.log(ordercondition);
    //console.log(searchinfo);
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
                    driveschool.forEach(function (r, idx) {
                        var oneschool = {
                            distance: geolib.getDistance(
                                {latitude: searchinfo.latitude, longitude: searchinfo.longitude},
                                {latitude: r.latitude, longitude: r.longitude},
                                10),
                            id: r._id,
                            schoolid: r._id,
                            name: r.name,
                            logoimg: r.logoimg,
                            latitude: r.latitude,
                            longitude: r.longitude,
                            address: r.address,
                            maxprice: r.maxprice,
                            minprice: r.minprice,
                            schoollevel: r.schoollevel,
                            coachcount: r.coachcount ? r.coachcount : 0,
                            commentcount: r.commentcount ? r.commentcount : 0,
                            passingrate: r.passingrate
                        };
                        if (oneschool.name.indexOf("一步") > -1) {
                            driveschoollist.unshift(oneschool);
                        }
                        else {
                            driveschoollist.push(oneschool);
                        }

                        //  r.restaurantId = r._id;
                        // delete(r._id);
                    });
                    if (searchinfo.ordertype == 0 || searchinfo.ordertype == 1) {
                        driveschoollist = _.sortBy(driveschoollist, "distance")
                    }
                    callback(null, driveschoollist);
                });
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
                                    calssid: r._id,
                                    //schoolinfo: {
                                    //    schoolid: r.schoolid._id,
                                    //    name: r.schoolid.name,
                                    //    latitude: r.schoolid.latitude,
                                    //    longitude: r.schoolid.longitude,
                                    //    address: r.schoolid.address,
                                    //},
                                    classname: r.classname,
                                    begindate: r.begindate,
                                    enddate: r.enddate,
                                    is_vip: r.is_vip,
                                    classdesc: r.classdesc,
                                    price: r.price,
                                    onsaleprice: r.onsaleprice,
                                    carmodel: r.carmodel,
                                    cartype: r.cartype,
                                    classdesc: r.classdesc,
                                    vipserverlist: r.vipserverlist,
                                    classchedule: r.classchedule,
                                    applycount: r.applycount,

                                }
                                classlist.push(oneclass)
                            })
                            return callback(null, classlist);
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
                data.classlist = schoolClass.classlist;
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
                        var returnmodel = { //new resbasecoachinfomode(r);
                            coachid: r._id,
                            name: r.name,
                            driveschoolinfo: r.driveschoolinfo,
                            headportrait: r.headportrait,
                            starlevel: r.starlevel,
                            is_shuttle: r.is_shuttle,
                            passrate: r.passrate,
                            Seniority: r.Seniority,
                            latitude: r.latitude,
                            longitude: r.longitude,
                            subject: r.subject,
                            Gender: r.Gender,
                            commentcount: r.commentcount,
                            maxprice: r.maxprice ? r.maxprice : 0,  // 最高价格
                            minprice: r.minprice ? r.minprice : 0,  // 最低价格
                            carmodel: r.carmodel,
                            serverclasslist: r.serverclasslist ? r.serverclasslist : []

                        }
                        //  r.restaurantId = r._id;
                        // delete(r._id);
                        rescoachlist.push(returnmodel);
                    });
                    callback(null, rescoachlist);
                });
            }

        });

};
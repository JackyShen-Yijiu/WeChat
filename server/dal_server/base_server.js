/**
 * Created by v-yaf_000 on 2016/3/8.
 */
var mongodb = require('../common/mongodb.js');
var _ = require("underscore");
var cityInfoModel = mongodb.CityiInfoModel;
var cache = require("../Common/cache");
var schoolModel = mongodb.DriveSchoolModel;
var geolib = require('geolib');
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
                    console.log(data);
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
    if (searchinfo.licensetype != "" && parseInt(searchinfo.licensetype) != 0) {
        searchcondition.licensetype = {"$in": [searchinfo.licensetype]}
    }
    var ordercondition = {};
    // 0 默认 1距离 2 评分  3 价格
    if (searchinfo.ordertype == 2) {
        ordercondition.schoollevel = -1;
    } else if (searchinfo.ordertype == 3) {
        ordercondition.minprice = 1;
    }
    console.log(searchcondition);
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
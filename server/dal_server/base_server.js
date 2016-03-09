/**
 * Created by v-yaf_000 on 2016/3/8.
 */
var mongodb = require('../common/mongodb.js');
var cache = require('../cache');
var _ = require("underscore");
var cityInfoModel=mongodb.CityiInfoModel;
var cache=require("../Common/cache");
//��ȡ�����б�ҵ��
exports.getCityList = function (callback) {
    cache.get(function (err, data) {
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
                        return callback("���ҳ���" + err);
                    }
                    console.log(data);
                    list = _.map(data, function (item, i) {
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
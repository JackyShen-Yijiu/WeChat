/**
 * Created by v-yaf_000 on 2016/3/8.
 */
var BaseReturnInfo = require('../common/basereturnmodel.js');
var service = require('../dal_server/base_server.js');
// 获取城市列表
exports.getCity = function (req, res) {
    service.getCityList(function (err, data) {
        if (err) {
            return res.json(new BaseReturnInfo(0, err, {}));
        }
        return res.json(new BaseReturnInfo(1, "", data));
    });
}

//搜索驾校列表
exports.searchSchool = function (req, res) {
    var q = {
        latitude: parseFloat(req.query.latitude),
        longitude: parseFloat(req.query.longitude),
        licensetype: req.query.licensetype ? req.query.licensetype : "",
        ordertype: req.query.ordertype ? parseInt(req.query.ordertype) : 0,
        index: req.query.index ? parseInt(req.query.index) : 1,
        count: req.query.count ? parseInt(req.query.count) : 1,
        schoolname: req.query.schoolname ? req.query.schoolname : ""
    }
    service.searchDriverSchool(q, function (err, data) {
        if (err) {
            return res.json(new BaseReturnInfo(0, err, []));
        } else {
            return res.json(new BaseReturnInfo(1, "", data));
        }
    });
}
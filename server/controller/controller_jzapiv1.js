/**
 * Created by v-yaf_000 on 2016/3/8.
 */
var BaseReturnInfo = require('../common/basereturnmodel.js');
var service = require('../dal_server/base_server.js');
var mobileVerify = /^1\d{10}$/;
var qr = require("qr-image");
// 获取城市列表
exports.getCity = function (req, res) {
    service.getCityList(function (err, data) {
        if (err) {
            return res.json(new BaseReturnInfo(0, err, {}));
        }
        return res.json(new BaseReturnInfo(1, "", data));
    });
}

// 搜索驾校列表
exports.getSchoolList = function (req, res) {
    var q = {
        latitude: parseFloat(req.query.latitude) || 0,
        longitude: parseFloat(req.query.longitude) || 0,
        cityname: req.query.cityname ? req.query.city_name : "",
        ordertype: req.query.ordertype ? parseInt(req.query.order_type) : 0,
        index: req.query.index ? parseInt(req.query.index) : 1,
        count: req.query.count ? parseInt(req.query.count) : 10,
        //schoolname: req.query.schoolname ? req.query.school_name : ""
    }
    service.getSchoolList(q, function (err, data) {
        if (err) {
            return res.json(new BaseReturnInfo(0, err, []));
        } else {
            return res.json(new BaseReturnInfo(1, "", data));
        }
    });
}

// 获取驾校详情
exports.getSchoolInfo = function (req, res) {
    var schoolid = req.params.school_id;
    if (schoolid === undefined) {
        return res.json(new BaseReturnInfo(0, "获取参数错误", ""));
    }
    service.getSchoolInfoserver(schoolid, function (err, data) {
        if (err) {
            return res.json(new BaseReturnInfo(0, err, {}));
        }
        return res.json(new BaseReturnInfo(1, "", data));
    });
};


// 获取驾校下面的教练
exports.getSchoolCoach = function (req, res) {
    var coachinfo = {
        schoolid: req.params.school_id,
        index: req.query.index,
        name: req.query.name
    }
    //sconsole.log(coachinfo);
    if (coachinfo.schoolid === undefined || coachinfo.index === undefined) {
        return res.json(
            new BaseReturnInfo(0, "parms is wrong", ""));
    }
    service.getSchoolCoach(coachinfo, function (err, data) {
        if (err) {
            return res.json(new BaseReturnInfo(0, err, []));
        } else {
            return res.json(new BaseReturnInfo(1, "", data));
        }
    });

};

// 用户报名接口
exports.postUserApplySchool = function (req, res) {
    var applyinfo = {
        name: req.body.name,
        mobile: req.body.mobile,
        smscode: req.body.smscode,
        schoolid: req.body.schoolid,
        coachid: req.body.coachid,
        classtypeid: req.body.classtypeid,
        openid: req.body.openid
    };
    if (applyinfo.name === undefined ||
        applyinfo.mobile === undefined || applyinfo.userid === undefined
        || applyinfo.schoolid === undefined || applyinfo.coachid === undefined
        || applyinfo.openid === undefined || applyinfo.classtypeid === undefined) {
        return res.json(
            new BaseReturnInfo(0, "参数不完整", ""));
    }
    ;


}

// 获取驾校下面的训练场
exports.getSchoolTrainingField = function (req, res) {
    var schoolid = req.query.school_id;
    service.getSchoolTrainingField(schoolid, function (err, data) {
        if (err) {
            return res.json(new BaseReturnInfo(0, err, []));
        }
        return res.json(new BaseReturnInfo(1, "", data));
    })
}

//获取教练信息
exports.getCoachInfo = function (req, res) {
    var userId = req.params.coach_id;
    console.log("调用 coachid = " + userId);
    service.getCoachInfoServer(userId, function (err, data) {
        if (err) {
            return res.json(new BaseReturnInfo(0, err, {}));
        }
        return res.json(new BaseReturnInfo(1, "", data));
    })

}

// 获取验证码
exports.fetchCode = function (req, res) {
    var mobile = req.params.mobile;
    if (mobile === undefined) {
        //req.log.warn({err: 'no mobile in query string'});
        return res.json(
            new BaseReturnInfo(0, "手机号错误", ""));
    }
    var number = mobileVerify.exec(mobile);
    if (number != mobile) {
        //req.log.warn({err: 'invalid mobile number'});
        return res.status(400).json(
            new BaseReturnInfo(0, "手机号错误", "")
        );
    }
    //  console.log("fetchCode mobile:"+mobile)
    service.getCodebyMolile(mobile, function (err) {
        if (err) {
            // console.log(number+"fabushi");
            return res.json(
                new BaseReturnInfo(0, err, ""));
        }
        else {
            return res.json(
                new BaseReturnInfo(1, "", "send success"));
        }
    });
};

//生成二维码
exports.createQrCode = function (req, res) {
    var text = req.query.text;
    var sizedata = Number(req.query.size ? req.query.size : 10);
    try {
        var img = qr.image(text, {size: sizedata});
        res.writeHead(200, {'Content-Type': 'image/png'});
        img.pipe(res);
    } catch (e) {
        res.writeHead(414, {'Content-Type': 'text/html'});
        res.end('NOT Found');
    }
};

//搜索驾校和教练
//exports.search = function (req, res) {
//    var q = {
//        latitude: parseFloat(req.query.latitude),
//        longitude: parseFloat(req.query.longitude),
//        index: req.query.index ? parseInt(req.query.index) : 1,
//        count: req.query.count ? parseInt(req.query.count) : 1,
//        name: req.query.name ? req.query.name : ""
//    };
//    service.search(q, function (err, data) {
//        if (err) {
//            return res.json(new BaseReturnInfo(0, err, []));
//        } else {
//            return res.json(new BaseReturnInfo(1, "", data));
//        }
//    });
//}
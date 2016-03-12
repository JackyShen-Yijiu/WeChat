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

// 搜索驾校列表
exports.searchSchool = function (req, res) {
    var q = {
        latitude: parseFloat(req.query.latitude),
        longitude: parseFloat(req.query.longitude),
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

// 获取驾校详情
exports.getSchoolInfo = function (req, res) {
    var schoolid = req.params.schoolid;
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
        schoolid: req.params.schoolid,
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
// 获取用户可以使用的F吗
exports.getUserAvailableFcode=function(req,res){
    var openid=req.query.openid;
    if (openid===undefined){
        return res.json(
            new BaseReturnInfo(0,"参数不完整",""));
    }
    service.getUserAvailableFcode(openid,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,[]));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
}
// 用户报名接口
exports.postUserApplySchool=function(req,res){
    var applyinfo= {
        name : req.body.name,
        mobile : req.body.mobile,
        smscode:req.body.smscode,
        schoolid:req.body.schoolid,
        coachid:req.body.coachid,
        classtypeid:req.body.classtypeid,
        openid:req.body.openid
    };
    if (applyinfo.name===undefined||
        applyinfo.mobile === undefined||applyinfo.userid === undefined
        ||applyinfo.schoolid === undefined ||applyinfo.coachid === undefined
        ||applyinfo.openid === undefined ||applyinfo.classtypeid === undefined) {
        return res.json(
            new BaseReturnInfo(0,"参数不完整",""));
    };
    service.postUserApplySchool(applyinfo,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,[]));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
};
function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
};
// 生成用户支付订单
exports.postUserCreateOrder=function(req,res){
    var applyinfo= {
        fcode : req.body.Ycode,
        paytype:req.body.paytype?req.body.paytype:1,  // 支付方式 1  线下支付  2 线上支付
        openid:req.body.openid,
        clientip:getClientIp(req)
    };
    if (applyinfo.openid===undefined){
        return res.json(
            new BaseReturnInfo(0,"参数不完整",""));
    }
    service.postUserCreateOrder(applyinfo,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,[]));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
}

// 获取驾校下面的训练场
exports.getSchoolTrainingField=function(req,res){
    var schoolid=req.query.schoolid;
    service.getSchoolTrainingField(schoolid,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,[]));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
}
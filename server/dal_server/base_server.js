/**
 * Created by v-yaf_000 on 2016/3/8.
 */
var mongodb = require('../common/mongodb.js');

var  app=require("../../config").weixinconfig;
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
var smsVerifyCodeModel=mongodb.SmsVerifyCodeModel;
var userModel=mongodb.UserModel;
var userAvailableFcodeModel=mongodb.UserAvailableFcodeModel;
var UserPayModel=mongodb.UserModel;
var wenpay=require("../weixinpay/wenxinpay")
require('date-utils');

var  getUserCount=function(callback){
    userCountModel.getUserCountInfo(function(err,data){
        //userCountModel.findAndModify({}, [],{$inc:{'displayid':1},$inc:{'invitationcode':1}},
        //  {new: true, upsert: true},function(err,data){
        if(err){
            return  callback(err)}
        // console.log("get user count:"+ data);
        //  console.log("get user count:"+ data.value.displayid);
        if(!data)
        {
            var usercountinfo=new userCountModel();
            usercountinfo.save(function(errsave,savedata){
                if (errsave){
                    return callback(errsave);
                }
                return callback(null,savedata);
            });
        }
        else{
            return  callback(null,data);
        }
    });
}
var defautfun={
      checkSmsCode:function(mobile,code,callback){
        smsVerifyCodeModel.findOne({mobile:mobile,smsCode:code, verified: false},function(err,instace){
            if(err)
            {
                return callback("查询出错: "+ err);
            }
            if (!instace)
            {
                return callback("验证码错误，请重新发送");
            }
            //console.log(instace);
            var  now=new Date();
            /*console.log(now);
             console.log(instace.createdTime);
             console.log(now-instace.createdTime);*/
            if ((now-instace.createdTime)>timeout*1000){
                return callback("您已超时请重新发送");
            }
            instace.verified=true;
            instace.save(function(err,temp){
                if (err)
                {
                    return callback("服务器内部错误:"+err);
                }
                return callback(null);
            })

        });
    },
    // 添加一个用户
      addWeiXinUser:function(applyinfo,callback){
        var newuser = new userModel();
          newuser.name=applyinfo.name;
        newuser.mobile = applyinfo.mobile;
        newuser.create = new Date();
        newuser.openid=applyinfo.openid;
        newuser.password= "";
        newuser.loc.coordinates=[0,0];
        newuser.source=2;
        getUserCount(function(err,usercoutinfo) {
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
    },
    // 保存报名信息
    saveUserApplyinfo:function(userid,applyinfo,callback){
        usermodel.findById(new mongodb.ObjectId(applyinfo.userid),function(err,userdata){
            if(err|!userdata)
            {
                return  callback("不能找到此用户");
            }
            //判断用户状态
            if(userdata.is_lock==true)
            {
                return  callback("此用户已锁定，请联系客服");
            }
            if(userdata.applystate>appTypeEmun.ApplyState.Applying){
                return  callback("您已经报名成功，请不要重复报名");
            }

            var searchcoachinfo={};
            if(applyinfo.coachid==-1||applyinfo.coachid=="-1"|| applyinfo.coachid.length<5){
                searchcoachinfo.driveschool=new mongodb.ObjectId(applyinfo.schoolid);
                searchcoachinfo.is_validation=true
            }else{
                searchcoachinfo._id=new mongodb.ObjectId(applyinfo.coachid)
            }
            var searchcoachinfo={};
            if(applyinfo.coachid==-1||applyinfo.coachid=="-1"|| applyinfo.coachid.length<5){
                searchcoachinfo.driveschool=new mongodb.ObjectId(applyinfo.schoolid);
                searchcoachinfo.is_validation=true
            }else{
                searchcoachinfo._id=new mongodb.ObjectId(applyinfo.coachid)
            }
            // 检查报名驾校和教练
            coachmode.findOne(searchcoachinfo,function(err,coachdata){
                if(err){
                    return callback("不能找到报名的教练");
                }
                applyinfo.coachid=coachdata?coachdata._id:"";
                // 检查教练
                schoolModel.findById(new mongodb.ObjectId(applyinfo.schoolid),function(err,schooldata){
                    if(err||!schooldata){
                        return callback("不能找到报名的驾校");
                    };
                    // 检查所报的课程类型
                    classtypeModel.findById(new mongodb.ObjectId(applyinfo.classtypeid))
                        .populate("vipserverlist")
                        .exec(function(err,classtypedata){
                            if (err|| !classtypedata){
                                return callback("不能找到该申请课程"+err);
                            }
                                userdata.carmodel=classtypedata.carmodel;
                                userdata.applyschoolinfo.id=applyinfo.schoolid;
                                userdata.applyschoolinfo.name=schooldata.name;

                                userdata.applycoach=applyinfo.coachid;
                                userdata.applycoachinfo.id=applyinfo.coachid;
                                userdata.applycoachinfo.name=coachdata?coachdata.name:"";

                                userdata.applyclasstype=classtypedata._id;
                                userdata.applyclasstypeinfo.id=classtypedata._id;
                                userdata.applyclasstypeinfo.name=classtypedata.classname;
                                userdata.applyclasstypeinfo.price=classtypedata.price;
                                userdata.applyclasstypeinfo.onsaleprice=classtypedata.onsaleprice;
                                userdata.vipserverlist=classtypedata.vipserverlist;
                                userdata.applystate=appTypeEmun.ApplyState.Applying;
                                userdata.applyinfo.applytime=new Date();
                                userdata.applyinfo.handelstate=appTypeEmun.ApplyHandelState.NotHandel;
                                userdata.scanauditurl="http://api.yibuxueche.com/validation/applyvalidation?userid="
                                    +userdata._id;
                                userdata.weixinopenid=applyinfo.openid;
                                userdata.paytypestatus=0;
                                //console.log(userdata);
                                // 保存 申请信息
                                userdata.save(function(err,newuserdata){
                                    if(err){
                                        return   callback("保存申请信息错误："+err);
                                    }
                                    classtypedata.applycount=classtypedata.applycount+1;
                                    coachdata.studentcoount=coachdata.studentcoount+1;
                                    classtypedata.save();
                                    //coachdata.save();
                                    return callback(null,"success");
                                });
                            })

                        });
                });

            });


    },
    //redis驾校信息
    redisSchoolInfo:function(schoolid, callback){
        cache.get("weixinschoolinfo"+schoolid,function(err,data){
            if(!data){
                schoolModel.findById(new mongodb.ObjectId(schoolid))
                    .select("_id name")
                    .exec(function(err,schooldata){
                        cache.set("weixinschoolinfo"+schoolid,schooldata,60,function(err){});
                        return callback(null,schooldata);
                    })
            }
            if(data){
                return callback(null,data);
            }
        })
    }
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
    var latitude = searchinfo.latitude || 0;
    var longitude = searchinfo.longitude || 0;
    //微信坐标转换为百度地图坐标
    baiDuUtil.weixintobaidu(latitude, longitude, function (err, data) {
        //console.log(data);
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
                                schoolid: r._id,
                                name: r.name,
                                logoimg: r.logoimg,
                                latitude: r.latitude,
                                longitude: r.longitude,
                                address: r.address,
                                maxprice: r.maxprice ? r.maxprice : 0,
                                minprice: r.minprice ? r.maxprice : 0,
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
                        });
                        if (searchinfo.ordertype == 0 || searchinfo.ordertype == 1) {
                            driveschoollist = _.sortBy(driveschoollist, "distance")
                        }
                        callback(null, driveschoollist);
                    });
                }
            })
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
                                    classid: r._id,
                                    schoolinfo: {
                                        schoolid: r.schoolid._id,
                                        name: r.schoolid.name,
                                        latitude: r.schoolid.latitude,
                                        longitude: r.schoolid.longitude,
                                        address: r.schoolid.address,
                                    },
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
                            cb(err, {classList: classlist})
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
                data.classList = schoolClass.classList;

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


//  获取我领取的优惠卷
exports.getUserAvailableFcode=function(openid,callback){
    userModel.findOne({"weixinopenid":openid})
        .select("_id")
        .exec(function(err,userData){
            if(err){
                return callback("查找用户出错");
            }
            if(!userData){
                return callback("没有查询到用户信息");
            }
            userAvailableFcodeModel.find({"userid":userData._id},function(err,data){
                if(err){
                    return callback("查找可用Y码出错");
                }
                var  returndatalist=[];
                data.forEach(function(r,index){
                    var Ycode={
                        Ycode: r.fcode,
                        name: r.name,
                        date: r.createtime.toFormat("YYYY/MM/DD")
                    }
                    returndatalist.push(Ycode);
                })
                return callback(null,returndatalist);
            })
        })
};
//生成用户支付订单
exports.postUserCreateOrder=function(applyinfo,callback){
    userModel.findOne({"weixinopenid":applyinfo.openid})
        .exec(function(err,userData) {
            if (err) {
                return callback("查找用户出错");
            }
            if (!userData) {
                return callback("没有查询到用户信息");
            }
            if (!userData.applystate!=1){
                return callback("该用户无法支付");
            }
            userModel.referrerfcode=applyinfo.fcode;
            userModel.paytype=applyinfo.paytype;
            userModel.save(function(err,data){
                if  (applyinfo.paytype==1){  // 线下报名
                    redisSchoolInfo(data.applyschool,function(err,schooldata){
                    var returndata={
                        applyschoolinfo:data.applyschoolinfo,
                        applyclasstypeinfo:data.applyclasstypeinfo,
                        aytype:data.paytype,
                        applytime:data.applyinfo.applytime.toFormat("YYYY/MM/DD"),
                        scanauditurl:data.scanauditurl,
                        orderid:data._id,
                    }
                        returndata.applyschoolinfo.logimg=schooldata.logoimg.originalpic;
                        return callback(null, returndata);
                    })

                }
                else if(applyinfo.paytype==2)  // 微信支付线上报名
                {
                    // 取消以前未支付的订单
                    // 生成新的订单
                    // 向微信发送支付申请
                    UserPayModel.update({userid:data._id,userpaystate:0},{userpaystate:4},function(err,excdata){
                        var  userpayinfo=new  UserPayModel();
                        userpayinfo.userid=data._id;
                        userpayinfo.userpaystate=0;
                        userpayinfo.creattime=new Date();
                        userpayinfo.payendtime=(new Date()).addDays(3);
                        userpayinfo.applyschoolinfo=data.applyschoolinfo;
                        userpayinfo.applyclasstypeinfo.id=data.applyclasstypeinfo.id;
                        userpayinfo.applyclasstypeinfo.name=data.applyclasstypeinfo.name;
                        userpayinfo.applyclasstypeinfo.price=data.applyclasstypeinfo.price;
                        userpayinfo.applyclasstypeinfo.onsaleprice=data.applyclasstypeinfo.onsaleprice?
                            data.applyclasstypeinfo.onsaleprice:data.applyclasstypeinfo.price;
                        userpayinfo.paymoney=data.applyclasstypeinfo.onsaleprice;
                        userpayinfo.paychannel=2;
                        userpayinfo.save(function(err,orderdata){
                            if(err){
                                return callback("生成支付订单失败："+err);
                            }
                            var weixinpayinfo={
                                body: data.applyschoolinfo.name+" "+data.applyclasstypeinfo.name,
                                out_trade_no: orderdata._id,
                                total_fee: orderdata.paymoney,
                                spbill_create_ip: applyinfo.clientip,
                                notify_url: 'http://wxpay_notify_url',
                                trade_type: 'JSAPI',
                                openid: applyinfo.openid,
                            }
                            wenpay.createJsUnifiedOrder(weixinpayinfo,function(err,weixinpaydata){
                                if(err){
                                    return callback("创建微信订单失败："+err);
                                }
                                if(weixinpaydata.return_code=="FAIL"){
                                    return callback("创建微信订单失败："+weixinpaydata.return_msg);
                                }
                                else {
                                    var reqparam = {
                                        appId: app.id,
                                        timeStamp: Math.floor(Date.now()/1000)+"",
                                        nonceStr: weixinpaydata.nonce_str,
                                        package: "prepay_id="+weixinpaydata.prepay_id,
                                        signType: "MD5"
                                    };
                                    reqparam.paySign = wenpay.sign(reqparam);
                                    var returndata={
                                        applyschoolinfo:data.applyschoolinfo,
                                        applyclasstypeinfo:data.applyclasstypeinfo,
                                        paytype:data.paytype,
                                        applytime:data.applyinfo.applytime.toFormat("YYYY/MM/DD"),
                                        orderid:orderdata._id,
                                         weixinpay :reqparam,
                                    }

                                    return callback(null,returndata);
                                }
                            })


                        });
                    });
                }
            })

        })
};
// 用户报名
exports.postUserApplySchool=function (applyinfo, callback){
    // 验证验证码
    defautfun.checkSmsCode(applyinfo.mobile,applyinfo.smscode,function(err,data){
        if(err){
            return callback(err);
        }
        userModel.findOne({"weixinopenid":applyinfo.openid},function(err,userData){
            if(err){
                return callback("查找用户出错");
            }
            // 存在微信 用户
            if(userData){
                if(userData.mobile==applyinfo.mobile){
                    // 判断是否可以报名
                   if( userData.applystate>0){
                       return callback("您已经正在报名，请先取消报名结果");
                   }
                    //用户报名
                    defautfun.saveUserApplyinfo(userData._id,applyinfo,function(err,data){
                        return callback(err,data);
                    })
                }
                else {
                    return callback("您暂时无法使用手机号报名");
                }
            }else{
                userModel.findOne({"mobile":applyinfo.mobile},function(err,userData){
                    if(err){
                        return callback("查找用户出错");
                    }
                    if(userData){
                        // 判断是否可以报名
                        if( userData.applystate>0){
                            return callback("您已经正在报名，请先取消报名结果");
                        }
                        //用户报名
                    }
                    else{
                        // 添加用户
                        defautfun.addWeiXinUser(applyinfo,function(err,data){
                            if (err){
                                return callback("保存信息出错"+err);
                            }
                            defautfun.saveUserApplyinfo(data._id,applyinfo,function(err,data){
                                return callback(err,data);
                            })
                        })
                        // 用户报名
                    }
                })
                // 不存在微信用户
            }
        })
    })
    // 验证微信id
    // 验证手机号
};

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
                    //latitude: r.latitude,
                    //longitude: r.longitude,
                    address: r.address,
                    //班车
                    schoolbusroute: "暂无"
                }
                list.push(listone);
            })

            return callback(null, list);
        })
    })}


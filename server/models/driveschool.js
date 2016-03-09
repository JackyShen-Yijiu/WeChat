/**
 * Created by metis on 2015-09-01.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImgInfo= new Schema({
    id :Number,
    originalpic:{type:String,default:""},
    thumbnailpic:{type:String,default:""},
    width:{type:String,default:""},
    height:{type:String,default:""}

});
// 驾校
var DriveSchoolSchema=new Schema({
    name :{type:String,default:''},  //驾校名称
    shortname:{type:String,default:''},// 驾校简称
    latitude: {type:Number,default:0},  //经纬度
    longitude: {type:Number,default:0},
    loc:{type:{type:String, default:'Point'}, coordinates:[Number]},
    pictures:[ImgInfo], //  驾校的宣传图片地址
    pictures_path:[{type:String, default:''}],
    schoolalbum:[{type:String, default:''}],// 驾校相册
    logoimg:{     // 驾校log
        originalpic:{type:String,default:""},
        thumbnailpic:{type:String,default:""},
        width:{type:String,default:""},
        height:{type:String,default:""}
    },
    passingrate:Number, // 通过率
    hours:{type:String,default:""}, //营业时间
    introduction :{type:String,default:""}, // 简介
    createtime:{type:Date,default:Date.now()}, // 注册时间
    registertime:{type:Date,default:Date.now()}, // 驾校成立时间
    province: {type:String,default:''}, // 省
    city: {type:String,default:''}, // 市
    county:{type:String,default:''},// 县
    address: {type:String,default:''}, // 地址
    responsible:{type:String,default:''}, // 负责人
    responsiblelist:[{type:String,default:''}],// 负责人列表
    phone:{type:String,default:''},  //联系电话
    phonelist:[{type:String,default:''}],  //联系电话
    website:{type:String,default:''},  // 网址
    is_validation: { type: Boolean, default: false} , //驾校是否通过验证
    schoollevel:String, //驾校星级
    carcount:Number, // 驾校车辆数
    coachcount:Number,  // 驾校教练数
    studentcount:Number,  // 驾校学生数
    examhallcount:Number, //考场数量
    cartype:[String], //车品牌  富康、奔驰等
    licensetype:[String],//驾照类型
    worktime :{type:String,default:""},  //工作时间
    workbegintime:String,
    workendtime:String,
    maxprice:Number,  // 最高价格
    minprice:Number,  // 最低价格
    email :{type:String,default:""}, // 电子邮箱
    vipserver:[String], //特色服务列表
    privilegelevel:{type:Number,default:1},// 权限等级
    valueaddedservice:{type:String,default:""}, // 增值服务
    superiorservice:{type:String,default:""}, //  优势服务
    shuttleroute:{type:String,default:""}, //  班车路线
    businesslicensenumber :{type:String,default:""}, // 营业执照
    Remarks:{type:String,default:""},//备注信息
    // 是否接送
    is_shuttle:{ type: Boolean, default: true},  // 是否接送默认接送
    organizationcode :{type:String,default:""}, // 组织机构代码
    hotindex:Number,//关注度
    applynotes:String,  // 报名须知
    confirmmobilelist:[String],// 驾校能进行驾校报名验证 的手机号列表
    // 确认学生验证码
    confirmnum:String,
    // 自主考试url
    examurl:{type:String,default:""},
    querycoursehoururl:{type:String,default:""} , //学时查询url
    examroomname:{type:String,default:""}  // 考场名称
});

/**0
 * Get restaurants near a given location/radius.
 * @param latitude
 * @param longitude
 * @param radius
 * @param limit
 * @param callback
 */
DriveSchoolSchema.statics.getNearDriverSchool = function(latitude, longitude, radius, callback) {
    // CAUTION: paramters (lat, lon, radius) in the query must be type of Number.
//    this.find({loc:{$geoWithin:{ $centerSphere:[[longitude, latitude], radius/6378100.0]}}}) //within cycle of radius

    this.find(
        {latitude: {$exists: true},longitude: {$exists: true}}
        // {loc:{$nearSphere:{$geometry:{type:'Point', coordinates:[longitude, latitude]}, $maxDistance: 100000}}}
      ) //from near to far

      //  .select('name branchName latitude longitude dpUrl logoUrl avgPrice popularity')
//        .sort({popularity: -1})
        .limit(30)
        .lean()
        .exec(callback);
};

DriveSchoolSchema.statics.getDriverSchoolList = function(callback) {
    this.find()
        .lean()
        .exec(callback);
};

DriveSchoolSchema.index({loc: '2dsphere'});
module.exports = mongoose.model('DriveSchool', DriveSchoolSchema);


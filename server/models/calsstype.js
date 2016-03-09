/**
 * Created by v-lyf on 2015/9/6.
 */
//驾校安排的课程类型类型 b班级表

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassTypeSchema=new Schema({
    schoolid :{type: Schema.Types.ObjectId, ref: 'DriveSchool'},   //学校id
    classname:{type:String,default:""},  // 班级名称
    begindate:{type:Date,default:Date.now()}, // 班级开始时间
    enddate:{type:Date,default:Date.now()},  // 班级结束时间
    createtime:{type:Date,default:Date.now()}, // 记录创建时间
    is_using:{type:Boolean,default:true},  // 该课程是否正在使用
    is_vip:{type:Boolean,default:false},  // 该课程是否是VIP课程
    carmodel:{modelsid:Number,name:String,code:String},  // 该 班级所有车型（驾照类型）（手动自动）
    cartype:String, //车品牌  富康、奔驰等
    applycount:{type:Number,default:0},  // 该班级报名的数量
    classdesc:{type:String,default:""},  // 课程描述
    vipserverlist:[{type: Schema.Types.ObjectId, ref: 'vipserver'}], // 该课程提供的vip 服务列表{接送、包过，1对1}
    price:Number, // 价格
    onsaleprice:Number , // 优化价格,
    originalprice:Number, // 原价
    systemretains:{type:Number,default:0},// 系统预留
    feedbackuser:{type:Number,default:0},// 返给用户
    rewardmoney:{type:Number,default:0},// 系统奖励
    classchedule:String, // 授课日程   周日/平日/
     });

ClassTypeSchema.statics.getClassTypeList = function(school_id, callback) {
    console.log('school_id: ' + school_id);
    this.find({schoolid: school_id})
        .lean()
        .exec(callback);
    
};

ClassTypeSchema.index({schoolid: 1});
ClassTypeSchema.index({is_using:1});
module.exports = mongoose.model('classtype', ClassTypeSchema);


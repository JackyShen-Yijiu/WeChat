/**
 * Created by v-lyf on 2015/9/2.
 */
var _ = require("underscore");
//返回教练基本信息
exports.resBaseCoachInfo = function (user) {
    this.id = user._id;//id
    this.name = user.name;//姓名
    this.head_img = user.headportrait;//头像
    this.subjects = user.subject;//所授科目
    this.seniority = user.Seniority;//教龄
    this.level = user.starlevel;//星级
    this.pass_rate = user.passrate;//通过率
    this.coach_type = user.coachtype ? user.coachtype : 0;// 教练类型  教练的方式 0 挂靠教练  1直营教练
    this.school_info = user.driveschoolinfo;//驾校信息
    this.train_info = user.trainfieldlinfo ? user.trainfieldlinfo : undefined;//练车场地
    this.car_model = user.carmodel;//授课车型
    this.class_list = user.serverclasslist;//授课班型
    //this.mobile = user.mobile;//手机号

    //this.createtime = user.createtime;//
    //this.email = user.email;//

    //this.logintime = user.logintime;
    //this.invitationcode = user.invitationcode;
    //this.displaycoachid = user.displaycoachid;
    //this.is_lock = user.is_lock;
    //this.address = user.address ? user.address : "";
    //this.introduction = user.introduction ? user.introduction : "";
    //this.gender = user.Gender;
    //this.is_validation = user.is_validation;
    //this.validationstate = user.validationstate;
    //this.studentcoount = user.studentcount;
    //this.commentcount = user.commentcount;
    //this.is_shuttle = user.is_shuttle;
    //this.coachnumber = user.coachnumber;
    //this.platenumber = user.platenumber;
    //this.drivinglicensenumber = user.drivinglicensenumber;
    //this.shuttlemsg = user.shuttlemsg;
    //this.introduction = user.introduction;
    //this.worktimedesc = user.worktimedesc;
    //this.workweek = user.workweek ? _.sortBy(user.workweek) : [];
    //this.worktimespace = user.worktimespace;
    //
    //
    //this.cartype = user.cartype ? user.cartype : "", //车品牌  富康、奔驰等
    //    this.leavebegintime = user.leavebegintime ? new Date(user.leavebegintime) / 1000 : undefined;
    //this.leaveendtime = user.leaveendtime ? new Date(user.leaveendtime) / 1000 : undefined;

};

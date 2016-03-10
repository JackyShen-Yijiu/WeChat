/**
 * Created by v-lyf on 2015/9/8.
 */
//驾校详情
exports.resBaseSchoolInfo = function (school) {
    this.id = school._id;
    this.name = school.name;
    this.level = school.schoollevel;
    this.latitude = school.latitude;
    this.longitude = school.longitude;
    this.pictures = school.pictures_path;
    this.logo_img = school.logoimg;
    this.pass_rate = school.passingrate;
    this.hours = school.hours;
    this.introduction = school.introduction;
    this.address = school.address;
    this.max_price = school.maxprice;
    this.min_price = school.minprice;
};
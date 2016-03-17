/**
 * Created by v-yaf_000 on 2016/3/8.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var weixinUserSchema = new Schema({
    openid:{type:String,default:""},//用户的唯一标识
    nickname:String,
    sex :{type:Number,default:0},   //户的性别，值为1时是男性，值为2时是女性，
    province:{type:String,default:""}, //用户个人资料填写的省份
    city:{type:String,default:""},   //普通用户个人资料填写的城市
    country :{type:String,default:""}, //普通用户个人资料填写的城市
    headimgurl:{type:String,default:false}, //  	用户头像
    unionid :{type:String,default:""},  // 只有在用户将公众号绑定到微信开放平台帐号后，
    is_bindapp:{type:Number,default:0} ,// 0 没有  1 绑定
    bcode:{type:String,default:""}, //渠道码
});

weixinUserSchema.index({openid: 1});
module.exports = mongoose.model('weixinuser', weixinUserSchema);
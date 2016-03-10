exports.weixinconfig = {
    id: 'wx59f87fdc85ee66c9',
    secret: 'd4624c36b6795d1d99dcf0547af5443d',
    token: 'jizhijiafuweixin'
};

exports.dbconfig = {
    db: {
        uri: process.env.MONGODB || 'mongodb://101.200.204.240:27017/jxmisdb',
        options: {
            //user: 'fanying',
            //pass: 'chiKuang!5040!'
        }
    }
};
// redis 正式

exports.redisConfig = {
    redis_host: "123.56.185.59",
    //redis_host: "127.0.0.1",
    redis_port: 6379,
    redis_db: 0,
    redis_password: "yibuxueche"
}

//  app配置基本信息
exports.appconfiginfo={
    appname:"极致驾服",  // appname  一步学车  极致驾服
    companyname:"极致驾服" ,  // 公司名称  一步科技 极致驾服
    appport:8183,       //app  端口  一步 8181  极致 8183
}
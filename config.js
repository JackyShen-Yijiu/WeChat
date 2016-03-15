exports.weixinconfig = {
    id: 'wxf8337b6f556b0bb8', // ycw
    secret: 'cd8fccf9052a3bccae25f3fa398fe44c',
    token: 'jizhijiafuweixin',
    domain: 'http://moodpo.tunnel.qydev.com',
    encodingAESKey: ''
    
    //id: 'wx59f87fdc85ee66c9',
    //secret: 'd4624c36b6795d1d99dcf0547af5443d',
    
    //id: 'wxb815a53dcb2faf06',
    //secret: '2637931343bdd1d1991fcef1b28a187a',
    
    /*id: 'wxc360e212be5b3bb4', // 公众号
    secret: '9a2a6e99d8b44e5b5e39faa17799195c',
    token: 'jizhijiafuweixin',
    domain: 'http://weixin.jizhijiafu.cn'*/
};


exports.merchant = {
    id: "1321096401",
    key: "JIZHIjiafu20150810andyibukejiinn",
    notify_url:"http://jzapi.yibuxueche.com/paynotice/weixin"
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
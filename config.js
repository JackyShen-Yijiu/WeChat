exports.weixinconfig = {
    id: 'wx59f87fdc85ee66c9',
    secret: 'd4624c36b6795d1d99dcf0547af5443d',
    //id: 'wxb815a53dcb2faf06',
    //secret: '2637931343bdd1d1991fcef1b28a187a',
    token: 'jizhijiafuweixin'
};


exports.merchant = {
    id: "1317721101",
    key: "JIZHIjiafu20150810andyibukejiinn"
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
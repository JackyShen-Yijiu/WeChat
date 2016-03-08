
exports.weixinconfig= {
    id: 'wx687edf91584139a4',
    secret: 'ceed3256fd3787839e0d16bf1c98338f',
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
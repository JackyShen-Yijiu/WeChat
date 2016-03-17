var wechat = require('wechat');
var wechatConfig = require('../config').weixinconfig;

var config = {
    token: wechatConfig.token,
    appid: wechatConfig.id,
    encodingAESKey: wechatConfig.encodingAESKey
};

var normalInfo = {
    title: '马上学车',
    description: '现在报名学车专享优惠码',
    picurl: '',
    url: 'http://weixin.jizhijiafu.cn/jzapi/weixin/authorizeUser'
};

exports.wechat = wechat(config, function(req, res) {
    var message = req.weixin;
    console.log('weixin message = ', message);
    if (message && message.MsgType == 'text') {
        res.reply({
            content: '消息已收到:' + message.Content + ', 请点击以下链接报名：http://weixin.jizhijiafu.cn/jzapi/weixin/authorizeUser',
            type: 'text'
        });
    } else if (message && message.Event) {
        switch (message.Event) {
            case 'subscribe':
                if (message.EventKey) {
                    res.reply({
                        content: '您的邀请码为：' + message.EventKey.split('qrscene_')[1],
                        type: 'text'
                    });
                } else {
                    res.reply({
                        content: '感谢关注',
                        type: 'text'
                    });
                }
                break;
            case 'unsubscribe':
                break;
            case 'SCAN':
                res.reply({
                    content: '您的邀请码为：' + message.EventKey,
                    type: 'text'
                });
                break;
            default:
                res.reply({
                    content: 'O(∩_∩)O~',
                    type: 'text'
                });
                break;
        }
    }
});

//twQZeuPZ-KfwOAvZM8zNZuhB4yRKvBchCs-x2j9yUj5KUQM0usBNhzHuIepXJWV3BS9c1Py4XmZE939rHKS3JE-DCKbOUMpOX1NFwokWMYy-u-3Obr5MINkq8rytyjFsSBTiAJALUM

/*
{
    "ticket": "gQHl8DoAAAAAAAAAASxodHRwOi8vd2VpeGluLnFxLmNvbS9xL3UweGdsam5sODJDS0hORnVCR1I2AAIEFsfnVgMEAAAAAA==", 
    "url": "http://weixin.qq.com/q/u0xgljnl82CKHNFuBGR6"
    http://weixin.qq.com/q/u0xgljnl82CKHNFuBGR6
}
*/
/* 已订阅
{ ToUserName: 'gh_cc4d9a55b399',
  FromUserName: 'ovk_nt_bgDZ8OUAw8Br6fsv_qy6E',
  CreateTime: '1458031629',
  MsgType: 'event',
  Event: 'SCAN',
  EventKey: 'xiaoxie',
  Ticket: 'gQHl8DoAAAAAAAAAASxodHRwOi8vd2VpeGluLnFxLmNvbS9xL3UweGdsam5sODJDS0hORnVCR1I2AAIEFsfnVgMEAAAAAA==' 
}
*/
/* 未订阅
{ ToUserName: 'gh_cc4d9a55b399',
  FromUserName: 'ovk_nt_bgDZ8OUAw8Br6fsv_qy6E',
  CreateTime: '1458031846',
  MsgType: 'event',
  Event: 'subscribe',
  EventKey: 'qrscene_xiaoxie',
  Ticket: 'gQHl8DoAAAAAAAAAASxodHRwOi8vd2VpeGluLnFxLmNvbS9xL3UweGdsam5sODJDS0hORnVCR1I2AAIEFsfnVgMEAAAAAA==' 
}
*/

/*function invitCode(n) {
    var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F',
        'G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    var res = '';
    for(var i = 0; i < n; i++) {
        var id = Math.ceil(Math.random()*35);
        res += chars[id];
    }
    return res;
}*/
// "LTDP32EA"
// "8XYBPNP6"
// "AJRYZZU8"
// "APJP7UDT"
// "EHFTSLDM"
// "133UD1ON"
// "5SVWCYEZ"
// "7U5657WO"

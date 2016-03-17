import alt from '../alt';

class CostPayActions {
	constructor() {
        this.generateActions(
        	'getSchoolSuccess',
        	'getSchoolFail',
            'doPaySuccess',
            'doPayFail',
            'updateBcode',
            'updateYcode'
        );
    }

    getSchool(schoolId) {
    	$.ajax({
            url: '/jzapi/v1/getSchoolInfo/' + schoolId
        })
        .done(response => {
            if(response.type === 1) {
                this.actions.getSchoolSuccess(response.data);
            } else {
                this.actions.getSchoolFail(response.msg);
            }
        })
        .fail(jqXhr => {
            this.actions.getSchoolFail('fail');
        });
    }

    doPay(payload) {
        $.ajax({
            url: '/jzapi/v1/userCreateOrder/',
            data: payload.params,
            type: 'POST'
        })
        .done(response => {
            if(response.type === 1) {
                // 缓存订单信息 用于成功页面展示
                localStorage.setItem('order', JSON.stringify(response.data));
                if(payload.params.paytype == 1) { // 线下支付
                    payload.history.replaceState(null, '/successful');
                } else {
                    let weixinpay = response.data.weixinpay;
                    // 发起微信支付
                    let weixinParams = {
                        appId: weixinpay.appId,
                        timestamp:  weixinpay.timeStamp + "", 
                        nonceStr: weixinpay.nonceStr, 
                        package: weixinpay.package, 
                        signType: weixinpay.signType,
                        paySign: weixinpay.paySign,
                        success: function (res) {
                            console.log(res);
                            toastr.info('微信支付成功！');
                            payload.history.replaceState(null, '/wechatsuccessful');
                        }
                    };
                    console.log(weixinParams);
                    wx.chooseWXPay(weixinParams);
                }
                this.actions.doPaySuccess(response.data);
            } else {
                this.actions.doPayFail(response.msg);
            }
        })
        .fail(jqXhr => {
            this.actions.doPayFail('fail');
        });
    }


}

export default alt.createActions(CostPayActions);
import alt from '../alt';

class UserCenterActions {
    constructor() {
        this.generateActions(
            'getOrderSuccess',
            'getOrderFail',
            'getLecooOrderSuccess',
            'getLecooOrderFail'
        );
    }

    getOrder(openid) {
    	$.ajax({
            url: '/jzapi/v1/getMyOrder/',
            data: {
            	openid: openid
            }
        })
        .done(response => {
            if(response.type === 1) {
                localStorage.setItem('order', JSON.stringify(response.data));
                this.actions.getOrderSuccess(response.data);
            } else {
                this.actions.getOrderFail(response.msg);
            }
        })
        .fail(jqXhr => {
            this.actions.getOrderFail('fail');
        });

    }

    getLecooOrder(openid) {
        $.ajax({
            url: '/jzapi/v1/userApplyEvent/',
            data: {
            	openid: openid
            }
        })
        .done(response => {
            if(response.type === 1) {
                localStorage.setItem('lecoo_order', JSON.stringify(response.data));
                this.actions.getLecooOrderSuccess(response.data);
            } else {
                this.actions.getLecooOrderFail(response.msg);
            }
        })
        .fail(jqXhr => {
            this.actions.getOrderFail('fail');
        });
    }

}


export default alt.createActions(UserCenterActions);

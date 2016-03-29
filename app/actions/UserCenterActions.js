import alt from '../alt';

class UserCenterActions {
    constructor() {
        this.generateActions(
            'getOrderSuccess',
            'getOrderFail'
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

}


export default alt.createActions(UserCenterActions);
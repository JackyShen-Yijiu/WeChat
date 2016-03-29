import alt from '../alt';

class YcodeListActions {
    constructor() {
        this.generateActions(
            'getListSuccess',
            'getListFail'
        );
    }

    getList(openid) {
    	$.ajax({
            url: '/jzapi/v1/getUserAvailableFcode',
            data: {
            	openid: openid
            }
        })
        .done(response => {
            if(response.type === 1) {
                this.actions.getListSuccess(response.data);
            } else {
                this.actions.getListFail(response.msg);
            }
        })
        .fail(jqXhr => {
            this.actions.getListFail('fail');
        });
    }

}


export default alt.createActions(YcodeListActions);
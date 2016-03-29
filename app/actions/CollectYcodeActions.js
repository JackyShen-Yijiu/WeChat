import alt from '../alt';

class CollectYcodeActions {
    constructor() {
        this.generateActions(
            'getUserInfoSuccess',
            'getUserInfoFail',
            'saveUserYcodeSuccess',
            'saveUserYcodeFail',
            'updateMobile',
            'invalidMobile'
        );
    }

    getUserInfo(payload) {
        $.ajax({
            url: '/jzapi/v1/getUserInfoByYCode?fcode=' + payload.ycode
        })
        .done(response => {
            if(response.type === 1) {
                this.actions.getUserInfoSuccess(response.data);
            } else {
                this.actions.getUserInfoFail(response.msg);
            }
        })
        .fail(jqXhr => {
            this.actions.getUserInfoFail('fail');
        });
    }

    saveUserYcode(params) {
        $.ajax({
            url: '/jzapi/v1/saveUserAvailableFcode',
            data: params, // mobile/ycode
            type: 'POST'
        })
        .done(response => {
            if(response.type === 1) {
                this.actions.saveUserYcodeSuccess(response.data);
            } else {
                this.actions.saveUserYcodeFail(response.msg);
            }
        })
        .fail(jqXhr => {
            this.actions.saveUserYcodeFail('fail');
        });
    }

}

export default alt.createActions(CollectYcodeActions);

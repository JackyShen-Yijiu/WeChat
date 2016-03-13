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
            console.log(response);
            if(response.type === 1) {
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
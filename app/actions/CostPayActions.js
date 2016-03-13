import alt from '../alt';

class CostPayActions {
	constructor() {
        this.generateActions(
        	'getSchoolSuccess',
        	'getSchoolFail',
            'doPaySuccess',
            'doPayFail'
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

    doPay() {

    }


}

export default alt.createActions(CostPayActions);
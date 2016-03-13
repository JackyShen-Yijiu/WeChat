import alt from '../alt';

class SignUpActions {
	constructor() {
        this.generateActions(
            'getSchoolSuccess',
            'getSchoolFail',
            'signUpSuccess',
            'signUpFail',
            'getCodeSuccess',
            'getCodeFail',
            'updateName',
            'updateMobile',
            'updateCode',
            'invalidName',
      		'invalidMobile',
      		'invalidCode'
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

    getCode(mobile) {
    	$.ajax({
            url: '/jzapi/v1/code/' + mobile
        })
        .done(response => {
            if(response.type === 1) {
                this.actions.getCodeSuccess(response.data);
            } else {
                this.actions.getCodeFail(response.msg);
            }
        })
        .fail(jqXhr => {
            this.actions.getCodeFail('fail');
        });
    }

    signUp(payload) {
        let params = payload.params;
        $.ajax({
            url: '/jzapi/v1/userApplySchool',
            data: params,
            type: 'POST'
        })
        .done(response => {
            if(response.type === 1) {
                this.actions.signUpSuccess(response.data);

                // 缓存订单信息并调整到支付页面
                localStorage.setItem('order', params);
                this.props.history.pushState(null, '/pay/' + params.schoolid + '/' + params.coachid + '/' + params.classtypeid);

            } else {
                this.actions.signUpFail(response.msg);
            }
        })
        .fail(jqXhr => {
            this.actions.signUpFail('fail');
        });
    }
    
}

export default alt.createActions(SignUpActions);
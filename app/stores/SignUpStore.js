import alt from '../alt';

import SignUpActions from '../actions/SignUpActions';

class SignUpStore {
	constructor() {
        this.bindActions(SignUpActions);
        this.school = {};
        this.name = '';
        this.mobile = '';
        this.code = '';
        this.secondsElapsed = '发送验证码';
    }

    onGetSchoolSuccess(data) {
        this.school = data;
    }

    onGetSchoolFail(errorMessage) {
        console.log(errorMessage);
    }

    onSignUpSuccess(data) {
        console.log(data);
    }

    onSignUpFail(errorMessage) {
        toastr.error(errorMessage);
    }

    onGetCodeSuccess(data) {
        if(data == 'send success')
            toastr.success('短信验证码发送成功！');
        else 
            toastr.error(data);
    }

    onGetCodeFail(errorMessage) {
        toastr.error(errorMessage);
    }

    onUpdateName(event) {
        this.name = event.target.value;
    }

    onUpdateMobile(event) {
        this.mobile = event.target.value;
    }

    onUpdateCode(event) {
        this.code = event.target.value;
    }

    onInvalidName() {
        toastr.error('请输入真实姓名！');
    }

    onInvalidMobile() {
        toastr.error('请输入真实的手机号！');
    }

    onInvalidCode() {
        toastr.error('请输入您收到的验证码！');
    }

}

export default alt.createStore(SignUpStore);
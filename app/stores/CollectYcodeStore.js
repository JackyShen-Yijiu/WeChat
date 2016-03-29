import alt from '../alt';
import CollectYcodeActions from '../actions/CollectYcodeActions';

class CollectYcodeStore {
    constructor() {
        this.bindActions(CollectYcodeActions);
        this.user = {};
        this.isSave = false;
        this.mobile = '';
    }

    onGetUserInfoSuccess(data) {
        this.user = data;
    }

    onGetUserInfoFail(errorMessage) {
        console.log(errorMessage);
    }

    onSaveUserYcodeSuccess(data) {
        this.isSave = true;
    }

    onSaveUserYcodeFail(errorMessage) {
        this.isSave = false;
        console.log(errorMessage);
    }

    onUpdateMobile(event) {
        this.mobile = event.target.value;
    }

    onInvalidMobile() {
        toastr.error('请输入真实的手机号！');
    }

}

export default alt.createStore(CollectYcodeStore);

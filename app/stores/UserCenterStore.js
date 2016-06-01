import alt from '../alt';
import UserCenterActions from '../actions/UserCenterActions';

class UserCenterStore {
    constructor() {
        this.bindActions(UserCenterActions);
        this.order = {};
        this.lecooOrder = {};
    }

    onGetOrderSuccess(data) {
        this.order = data;
    }

    onGetOrderFail(errorMessage) {
        console.log(errorMessage);
    }

    onGetLecooOrderSuccess(data) {
        this.lecooOrder = data;
    }

    onGetLecooOrderFail(errorMessage) {
        console.log(errorMessage);
    }

}

export default alt.createStore(UserCenterStore);

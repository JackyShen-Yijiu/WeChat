import alt from '../alt';
import UserCenterActions from '../actions/UserCenterActions';

class UserCenterStore {
    constructor() {
        this.bindActions(UserCenterActions);
        this.order = {};
    }

    onGetOrderSuccess(data) {
        this.order = data;
    }

    onGetOrderFail(errorMessage) {
        console.log(errorMessage);
    }

}

export default alt.createStore(UserCenterStore);

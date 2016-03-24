import alt from '../alt';
import WechatSuccessActions from '../actions/WechatSuccessActions';

class WechatSuccessStore {
    constructor() {
        this.bindActions(WechatSuccessActions);
        this.order = {};
    }

    onGetOrderSuccess(data) {
        this.order = data;
    }

    onGetOrderFail(errorMessage) {
        console.log(errorMessage);
    }

}

export default alt.createStore(WechatSuccessStore);

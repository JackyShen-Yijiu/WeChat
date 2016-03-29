import alt from '../alt';
import YcodeListActions from '../actions/YcodeListActions';

class YcodeListStore {
    constructor() {
        this.bindActions(YcodeListActions);
        this.list = [];
    }

    onGetListSuccess(data) {
        this.list = data;
    }

    onGetListFail(errorMessage) {
        console.log(errorMessage);
    }

}

export default alt.createStore(YcodeListStore);

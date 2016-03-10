import alt from '../alt';

import ShuttleListActions from '../actions/ShuttleListActions';

class ShuttleListStore {
	constructor() {
        this.bindActions(ShuttleListActions);
        this.list = [];
    }

    onGetShuttleListSuccess(data) {
        this.list = data;
    }

    onGetShuttleListFail(errorMessage) {
        console.log(errorMessage);
    }
}

export default alt.createStore(ShuttleListStore);
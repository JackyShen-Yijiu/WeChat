import alt from '../alt';

import GroundListActions from '../actions/GroundListActions';

class GroundListStore {
	constructor() {
        this.bindActions(GroundListActions);
        this.list = [];
    }

    onGetGroundListSuccess(data) {
        this.list = data;
    }

    onGetGroundListFail(errorMessage) {
        console.log(errorMessage);
    }
}

export default alt.createStore(GroundListStore);
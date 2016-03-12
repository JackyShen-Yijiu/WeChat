import alt from '../alt';
import CoachListActions from '../actions/CoachListActions';

class CoachListStore {
    constructor() {
        this.bindActions(CoachListActions);
        this.list = [];
    }

    onGetCoachListSuccess(data) {
        this.list = data;
    }

    onGetCoachListFail(errorMessage) {
        console.log(errorMessage);
    }

}

export default alt.createStore(CoachListStore);

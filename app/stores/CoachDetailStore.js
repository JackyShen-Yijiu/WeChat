import alt from '../alt';
import CoachDetailActions from '../actions/CoachDetailActions';

class SchoolDetailStore {
    constructor() {
        this.bindActions(CoachDetailActions);
        this.detail = {};
    }

    onGetCoachDetailSuccess(data) {
        this.detail = data;
    }

    onGetCoachDetailFail(errorMessage) {
        console.log(errorMessage);
    }
}

export default alt.createStore(SchoolDetailStore);
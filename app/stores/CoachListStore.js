import alt from '../alt';
import CoachListActions from '../actions/CoachListActions';

class CoachListStore {
    constructor() {
        this.bindActions(CoachListActions);
        this.coachList = [];
    }

    onGetCoachListSuccess(data) {
        this.coachList = data;
    }

    onGetCoachListFail(errorMessage) {
        console.log(errorMessage);
    }

}

export default alt.createStore(CoachListStore);

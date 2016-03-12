import alt from '../alt';
import SchoolDetailActions from '../actions/SchoolDetailActions';

class SchoolDetailStore {
    constructor() {
        this.bindActions(SchoolDetailActions);
        this.detail = {};
    }

    onGetSchoolDetailSuccess(data) {
        this.detail = data;
    }

    onGetSchoolDetailFail(errorMessage) {
        console.log(errorMessage);
    }
}

export default alt.createStore(SchoolDetailStore);
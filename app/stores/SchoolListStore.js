import alt from '../alt';
import SchoolListActions from '../actions/SchoolListActions';

class SchoolListStore {
    constructor() {
        this.bindActions(SchoolListActions);
        this.list = [];
    }

    onGetSchoolListSuccess(data) {
        this.list = data;
    }

    onGetSchoolListFail(errorMessage) {
        console.log(errorMessage);
    }

}

export default alt.createStore(SchoolListStore);

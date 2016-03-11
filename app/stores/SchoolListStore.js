import alt from '../alt';
import SchoolListActions from '../actions/SchoolListActions';

class SchoolListStore {
    constructor() {
        this.bindActions(SchoolListActions);
        this.schoolList = [];
    }

    onGetSchoolListSuccess(data) {
        this.schoolList = data;
    }

    onGetSchoolListFail(errorMessage) {
        console.log(errorMessage);
    }

}

export default alt.createStore(SchoolListStore);

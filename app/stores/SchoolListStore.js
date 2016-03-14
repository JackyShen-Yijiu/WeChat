import alt from '../alt';
import SchoolListActions from '../actions/SchoolListActions';

class SchoolListStore {
    constructor() {
        this.bindActions(SchoolListActions);
        this.list = [];
        this.city = '';
    }

    onGetSchoolListSuccess(data) {
        this.list = data.list;
        this.city = data.city_name;
    }

    onGetSchoolListFail(errorMessage) {
        console.log(errorMessage);
    }

}

export default alt.createStore(SchoolListStore);

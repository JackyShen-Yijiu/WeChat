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
        if(this.city) {
            localStorage.setItem('city', this.city);
        }
    }

    onGetSchoolListFail(errorMessage) {
        console.log(errorMessage);
    }

}

export default alt.createStore(SchoolListStore);

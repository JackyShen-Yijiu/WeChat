import alt from '../alt';
import CityListActions from '../actions/CityListActions';

class CityListStore {
    constructor() {
        this.bindActions(CityListActions);
        this.list = [];
    }

    onGetCityListSuccess(data) {
        this.list = data;
    }

    onGetCityListFail(errorMessage) {
        console.log(errorMessage);
    }

}

export default alt.createStore(CityListStore);

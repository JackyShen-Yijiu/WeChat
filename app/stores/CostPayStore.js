import alt from '../alt';

import CostPayActions from '../actions/CostPayActions';

class CostPayStore {
	constructor() {
        this.bindActions(CostPayActions);
        this.school = [];
    }

    onGetSchoolSuccess(data) {
        this.school = data;
    }

    onGetSchoolFail(errorMessage) {
        console.log(errorMessage);
    }

    onDoPaySuccess(data) {
    	console.log(data);
    }

    onDoPayFail(errorMessage) {
    	console.log(errorMessage);
    }

}


export default alt.createStore(CostPayStore);
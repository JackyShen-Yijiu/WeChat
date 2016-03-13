import alt from '../alt';

import CostPayActions from '../actions/CostPayActions';

class CostPayStore {
	constructor() {
        this.bindActions(CostPayActions);
        this.school = [];
        this.payType = 2;
        this.ycode = '';
        this.bcode = '';
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

    onUpdateBcode(event) {
        this.bcode = event.target.value;
    }

    onUpdateYcode(event) {
        this.ycode = event.target.value;
    }

}


export default alt.createStore(CostPayStore);
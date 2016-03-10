import alt from '../alt';

class ShuttleListActions {
	constructor() {
        this.generateActions(
            'getShuttleListSuccess',
            'getShuttleListFail'
        );
    }

    getShuttleList(schoolId) {
    	
    }
}

export default alt.createActions(ShuttleListActions);
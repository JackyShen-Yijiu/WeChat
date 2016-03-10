import alt from '../alt';

class GroundListActions {
	constructor() {
        this.generateActions(
            'getGroundListSuccess',
            'getGroundListFail'
        );
    }

    getGroundList(schoolId) {
    	
    }
}

export default alt.createActions(GroundListActions);
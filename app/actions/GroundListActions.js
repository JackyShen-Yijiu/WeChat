import alt from '../alt';

class GroundListActions {
	constructor() {
        this.generateActions(
            'getGroundListSuccess',
            'getGroundListFail'
        );
    }

    getGroundList(schoolId) {
    	$.ajax({
            url: '/jzapi/v1/getSchoolTrainingField/' + schoolId
        })
        .done(response => {
            if(response.type === 1) {
                this.actions.getGroundListSuccess(response.data);
            } else {
                this.actions.getGroundListFail(response.msg);
            }
        })
        .fail(jqXhr => {
            this.actions.getGroundListFail('fail');
        });
    }
}

export default alt.createActions(GroundListActions);
import alt from '../alt';

class CoachDetailActions {
    constructor() {
        this.generateActions(
            'getCoachDetailSuccess',
            'getCoachDetailFail'
        );
    }

    getCoachDetail(coachId) {
    	$.ajax({
            url: '/jzapi/v1/getschoolinfo/' + schoolId
        })
        .done(response => {
            if(response.type === 1) {
                this.actions.getCoachDetailSuccess(response.data);
            } else {
                this.actions.getCoachDetailFail(response.msg);
            }
        })
        .fail(jqXhr => {
            this.actions.getCoachDetailFail('fail');
        });
    }

}

export default alt.createActions(CoachDetailActions);
import alt from '../alt';

class CoachListActions {
    constructor() {
        this.generateActions(
            'getCoachListSuccess',
            'getCoachListFail'
        );
    }

    getCoachList(payload) {
        let params = {
            index: 1,
            count: 10
        };

        Object.assign(params, payload);
        
        $.ajax({
            url: '/jzapi/v1/getSchoolCoach/' + payload.id,
            data: params
        })
        .done(response => {
            if(response.type === 1) {
                this.actions.getCoachListSuccess(response.data);
            } else {
                this.actions.getCoachListFail(response.msg);
            }
        })
        .fail(jqXhr => {
            this.actions.getCoachListFail('fail');
        });
    }

}

export default alt.createActions(CoachListActions);

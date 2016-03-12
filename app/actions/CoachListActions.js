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
            count: 1000,
            class_id: payload.lesson_id
        };
        
        $.ajax({
            url: '/jzapi/v1/getSchoolCoach/' + payload.school_id,
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

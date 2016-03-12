import alt from '../alt';

class SchoolDetailActions {
    constructor() {
        this.generateActions(
            'getSchoolDetailSuccess',
            'getSchoolDetailFail'
        );
    }

    getSchoolDetail(schoolId) {
    	$.ajax({
            url: '/jzapi/v1/getSchoolInfo/' + schoolId
        })
        .done(response => {
            if(response.type === 1) {
                this.actions.getSchoolDetailSuccess(response.data);
            } else {
                this.actions.getSchoolDetailFail(response.msg);
            }
        })
        .fail(jqXhr => {
            this.actions.getSchoolDetailFail('fail');
        });
    }

}

export default alt.createActions(SchoolDetailActions);
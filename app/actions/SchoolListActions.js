import alt from '../alt';

class SchoolListActions {
    constructor() {
        this.generateActions(
            'getSchoolListSuccess',
            'getSchoolListFail'
        );
    }

    getSchoolList(payload) {
        let params = {
            index: 1,
            count: 10,
            latitude: '40.096263',
            longitude: '116.1270',
            ordertype: 1
        };

        Object.assign(params, payload);

        $.ajax({
            url: '/jzapi/v1/searchSchool',
            data: params
        })
        .done(response => {
            if(response.type === 1) {
                this.actions.getSchoolListSuccess(response.data);
            } else {
                this.actions.getSchoolListFail(response.msg);
            }
        })
        .fail(jqXhr => {
            this.actions.getSchoolListFail('fail');
        });
    }

}

export default alt.createActions(SchoolListActions);

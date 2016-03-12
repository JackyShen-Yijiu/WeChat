import alt from '../alt';

class CityListActions {
    constructor() {
        this.generateActions(
            'getCityListSuccess',
            'getCityListFail'
        );
    }

    getCityList() {
        $.ajax({
            url: '/jzapi/v1/getCity/'
        })
        .done(response => {
            if(response.type === 1) {
                this.actions.getCityListSuccess(response.data);
            } else {
                this.actions.getCityListFail(response.msg);
            }
        })
        .fail(jqXhr => {
            this.actions.getCityListFail('fail');
        });
    }

}

export default alt.createActions(CityListActions);

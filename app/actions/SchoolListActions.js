import alt from '../alt';
import {assign} from 'underscore';

class SchoolListActions {
    constructor() {
        this.generateActions(
            'getSchoolListSuccess',
            'getSchoolListFail'
        );
    }

    getWeixinConfig(url, callback) {
        $.ajax({
            url: '/jzapi/weixin/getjssign?url=' + url
        }).done(response => {
            if(response.type === 1) {
                callback(response.data);
            } else {
                console.log(response.msg);
            }
        })
        .fail(jqXhr => {
            console.log('getWeixinConfig fail');
        });
    }

    getSchoolList(payload) {
        let params = {
            index: 1,
            count: 10000,
            latitude: '40.096263',
            longitude: '116.1270',
            order_type: 1
        };

        assign(params, payload);

        $.ajax({
            url: '/jzapi/v1/getSchoolList',
            data: params
        })
        .done(response => {
            $('.location-loading').hide();
            if(response.type === 1) {
                this.actions.getSchoolListSuccess(response.data);
            } else {
                this.actions.getSchoolListFail(response.msg);
            }
        })
        .fail(jqXhr => {
            $('.location-loading').hide();
            this.actions.getSchoolListFail('fail');
        });
    }

}

export default alt.createActions(SchoolListActions);

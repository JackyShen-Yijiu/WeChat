import React from 'react';
import {Link} from 'react-router';
import {assign} from 'underscore';

import SortBar from './SortBar';
import School from './common/School';

import SchoolListStore from '../stores/SchoolListStore'
import SchoolListActions from '../actions/SchoolListActions';

class SchoolList extends React.Component {
    constructor(props) {
        super(props);
        this.state = SchoolListStore.getState();
        this.onChange = this.onChange.bind(this);
    }

    onChange(state) {
        this.setState(state);
    }

    isWeixn(){
        var ua = navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i)=="micromessenger") {
            return true;
        } else {
            return false;
        }
    }

    componentDidMount() {
        SchoolListStore.listen(this.onChange);

        let {query} = this.props.location;
        let hash = this.props.location.hash;
        let openid = query.openid;
        let bcode = hash.split('=')[1];
        if(bcode) {
            localStorage.setItem('bcode', bcode);
        } else {
            localStorage.setItem('bcode', '');
        }
        
        if(openid) {
            localStorage.setItem('openid', openid);
        }

        let params = this.props.params;

        // 判断是否在微信中
        if(this.isWeixn()) {
            SchoolListActions.getWeixinConfig(location.href.split('#')[0], (config) => {
                wx.config({
                    debug: false,
                    appId: config.appId,
                    timestamp: config.timestamp,
                    nonceStr: config.nonceStr,
                    signature: config.signature,
                    jsApiList: [
                        'previewImage',
                        'getLocation',
                        'chooseWXPay'
                    ]
                });

                wx.ready(function(){
                    // 定位
                    wx.getLocation({
                        type: 'wgs84',
                        success: function (res) {

                            params.latitude = res.latitude;
                            params.longitude = res.longitude;

                            console.log('----location---')

                            SchoolListActions.getSchoolList(params);
                        }
                    });
                });

                wx.error(function(res){
                    console.log('----location error---')

                    //SchoolListActions.getSchoolList(params);
                });
            });
        } else {
            SchoolListActions.getSchoolList(params);
        }
    }

    componentWillUnmount() {
        SchoolListStore.unlisten(this.onChange);
    }

    handleSort(index) {
        let payload = assign(this.props.params, { order_type: index + 1 });
        SchoolListActions.getSchoolList(payload);
    }

    render() {
        let list = this.state.list.map((school) => {
            return (
                <School key={school.id} school={school} />
            );
        });

        return (
            <div className="sl-wrap">
                <header className="sl-header">
                    <div className="address">
                        <Link to="/cities" className="city">
                            {this.props.params.city_name || this.state.city}
                            <img className="location-loading" src="/img/location.gif" />
                            <i className="icon-more_down"></i>
                        </Link>
                    </div>
                    <div className="searchbar">
                        <Link to="search" className="search">
                            <i className="icon-search"></i> 请输入驾校或教练进行搜索
                        </Link>
                    </div>
                    <div className="user">
                        <Link to="/user"><i className="icon-user"></i></Link>
                    </div>
                </header>
                <SortBar sortType="0" handleSort={this.handleSort.bind(this)}/>
                <div className="sl-main">
                    <div className="sl-list">
                        {list}
                    </div>
                    <a href="#" className="list-footer">加载更多</a>
                </div>
            </div>
        );
    }
}

export default SchoolList;

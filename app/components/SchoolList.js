import React from 'react';
import {Link} from 'react-router';

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

    componentDidMount() {
        SchoolListStore.listen(this.onChange);
        SchoolListActions.getSchoolList(this.props.params);
    }

    componentWillUnmount() {
        SchoolListStore.unlisten(this.onChange);
    }

    handleSort(index) {
        let payload = Object.assign(this.props.params, { order_type: index + 1 });
        SchoolListActions.getSchoolList(payload);
    }

    render() {
        let list = this.state.list ? this.state.list.map((school) => {
            return (
                <School key={school.id} school={school} />
            );
        }) : 'asdfasdf';

        return (
            <div className="sl-wrap">
                <header className="sl-header">
                    <div className="address">
                        <Link to="/cities" className="city">
                            {this.props.params.city_name || '北京市'}
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

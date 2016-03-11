import React from 'react';

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
        SchoolListActions.getSchoolList({ ordertype: index + 1 });
    }

    render() {
        let schoolListNodes = this.state.schoolList.map((school) => {
            return (
                <School key={school.id} school={school} />
            );
        });

        return (
            <div className="sl-wrap">
                <header className="sl-header">
                    <div className="address">
                        <a href="cities" className="city">北京市 <i className="fa fa-angle-down"></i></a>
                    </div>
                    <div className="searchbar">
                        <a href="search" className="search">
                            <i className="fa fa-search"></i> 请输入驾校或教练进行搜索
                        </a>
                    </div>
                    <div className="user">
                        <a href="user"><i className="fa fa-user"></i></a>
                    </div>
                </header>
                <SortBar sortType="0" handleSort={this.handleSort}/>
                <div className="sl-main">
                    <div className="sl-list">
                        {schoolListNodes}
                    </div>
                    <a href="#" className="list-footer">加载更多</a>
                </div>
            </div>
        );
    }
}

export default SchoolList;

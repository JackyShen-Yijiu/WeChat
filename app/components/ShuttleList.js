import React from 'react';
import DocumentTitle from 'react-document-title';

import ShuttleListStore from '../stores/ShuttleListStore';
import ShuttleListActions from '../actions/ShuttleListActions';

class ShuttleList extends React.Component {
	constructor(props) {
        super(props);
        this.state = ShuttleListStore.getState();
        this.onChange = this.onChange.bind(this);
    }

    onChange(state) {
        this.setState(state);
    }

    componentDidMount() {
    	ShuttleListStore.listen(this.onChange);
        ShuttleListActions.getShuttleList(this.props.params.school_id);
    }

    componentWillUnmount() {
		ShuttleListStore.unlisten(this.onChange);
    }

    render() {
    	return (
            <div>
                <DocumentTitle title="班车列表"></DocumentTitle>
                <ul className="list-group simple-list-group">
                    <li className="list-group-item">
                        <div className="title">龙泉驾校第一训练场</div>
                        <div className="address">地址：北京市海淀区海淀大街27号</div>
                    </li>
                </ul>
            </div>
    	);
    }
}

export default ShuttleList;
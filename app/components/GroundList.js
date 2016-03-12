import React from 'react';

import GroundListStore from '../stores/GroundListStore';
import GroundListActions from '../actions/GroundListActions';

class GroundList extends React.Component {
	constructor(props) {
        super(props);
        this.state = GroundListStore.getState();
        this.onChange = this.onChange.bind(this);
    }

    onChange(state) {
        this.setState(state);
    }

    componentDidMount() {
    	GroundListStore.listen(this.onChange);
        GroundListActions.getGroundList(this.props.params.school_id);
    }

    componentWillUnmount() {
		GroundListStore.unlisten(this.onChange);
    }

    render() {
        let list = this.state.list.map((ground) => {
            return (
                <li key={ground.id} className="list-group-item">
                    <div className="title">{ground.name}</div>
                    <div className="address">地址：{ground.address}</div>
                    <div className="desc">班车信息：{ground.school_bus}</div>
                </li>
            );
        });
        
    	return (
            <ul className="list-group simple-list-group">
                {list}
            </ul>
    	);
    }
}

export default GroundList;
import React from 'react';

import ShuttleListStore from '../stores/ShuttleListStore';
import ShuttleListActions from '../actions/ShuttleListActions';

import Shuttle from './common/Shuttle';

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
        ShuttleListActions.getShuttleList(this.props.params.id);
    }

    componentWillUnmount() {
		ShuttleListStore.unlisten(this.onChange);
    }

    render() {
    	return (
    		<div>Hello</div>
    	);
    }
}

export default ShuttleList;
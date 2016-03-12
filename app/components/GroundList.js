import React from 'react';

import GroundListStore from '../stores/GroundListStore';
import GroundListActions from '../actions/GroundListActions';

import Ground from './common/Ground';

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
        GroundListActions.getGroundList(this.props.params.id);
    }

    componentWillUnmount() {
		GroundListStore.unlisten(this.onChange);
    }

    render() {
    	return (
    		<div>Hello</div>
    	);
    }
}

export default GroundList;
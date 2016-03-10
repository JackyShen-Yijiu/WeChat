import React from 'react';

import Coach from './common/Coach';

import CoachListStore from '../stores/CoachListStore'
import CoachListActions from '../actions/CoachListActions';

class CoachList extends React.Component {
	constructor(props) {
        super(props);
        this.state = CoachListStore.getState();
        this.onChange = this.onChange.bind(this);
    }

    onChange(state) {
        this.setState(state);
    }

    componentDidMount() {
        CoachListStore.listen(this.onChange);
        CoachListActions.getCoachList(this.props.params);
    }

    componentWillUnmount() {
        CoachListStore.unlisten(this.onChange);
    }

	render() {
		// 教练列表
		let coachList = this.state.coachList.map((coach) => {
			return (
				<Coach key={coach.id} coach={coach} />
			);
		});

		return (
			<div className="cl-wrap">
		        <div className="cl-main">
		            <div className="cl-list">
		            	{coachList}
		            </div>
		        </div>
		    </div>
		);
	}
}

export default CoachList;
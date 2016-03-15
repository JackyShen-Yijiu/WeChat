import React from 'react';
import DocumentTitle from 'react-document-title';

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
		let lessonId = this.props.params.lesson_id;
		let schoolId = this.props.params.school_id;
		// 教练列表
		let list = this.state.list.map((coach) => {
			return (
				<Coach key={coach.id} coach={coach} schoolId={schoolId} lessonId={lessonId}/>
			);
		});

		return (
			<DocumentTitle title="教练列表">
				<div className="cl-wrap">
			        <div className="cl-main">
			            <div className="cl-list">
			            	{list}
			            </div>
			        </div>
			    </div>
		    </DocumentTitle>
		);
	}
}

export default CoachList;
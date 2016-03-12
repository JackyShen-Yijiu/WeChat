import React from 'react';

import CoachDetailActions from '../actions/CoachDetailActions';
import CoachDetailStore from '../stores/CoachDetailStore';

import Coach from './common/Coach';
import Lesson from './common/Lesson';

class CoachDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = CoachDetailStore.getState();
        this.onChange = this.onChange.bind(this);
	}

	onChange(state) {
        this.setState(state);
    }

    componentDidMount() {
        CoachDetailStore.listen(this.onChange);
        CoachDetailActions.getCoachDetail(this.props.params.id);
    }

    componentWillUnmount() {
        CoachDetailStore.unlisten(this.onChange);
    }

	render() {
		let detail = this.state.detail;

		// 驾校信息
		let school = detail.school_info || {};
		let train = detail.train_info || {};

		// 班型列表
		let lessonList = detail.class_list ? detail.class_list.map((lesson) => {
			return (
				<Lesson key={lesson.id} lesson={lesson} schoolId={school.id} coachId={detail.id}/>
			);
		}) : (() => {
			return (
				<li className="list-group-item">暂无班型信息</li>
			);	
		})();

		return (
			<div className="cd-wrap">

			    <Coach key={detail.id} coach={detail} />
				
				<ul className="list-group prop-list-group mt20">
					<li className="list-group-item">
						<span className="icon"><i className="icon-school"></i></span>
			        	<span className="title">所属驾校：</span>
			        	<span className="info">{school.name}</span>
					</li>
					<li className="list-group-item">
						<span className="icon"><i className="icon-location"></i></span>
			        	<span className="title">练车场地：</span>
			        	<span className="info">{train.name || '暂无场地信息'}</span>
					</li>
					<li className="list-group-item">
						<span className="icon"><i className="icon-car"></i></span>
			        	<span className="title">授课车型：</span>
			        	<span className="info">{'暂无车型信息'}</span>
					</li>
				</ul>

				<ul className="list-group lesson-list-group">
		            <li className="list-group-item">课程班型</li>
		           	{lessonList}
		        </ul>

			</div>
		);
	}
}

export default CoachDetail;
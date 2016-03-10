import React from 'react';

import Coach from './common/Coach';
import Lesson from './common/Lesson';

class CoachDetail extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let detail = this.state.detail;

		// 班型列表
		let lessonList = detail.classList ? detail.classList.map((lesson) => {
			return (
				<Lesson key={lesson.classid} lesson={lesson}/>
			);
		}) : '';

		return (
			<div className="cd-wrap">

			    <Coach key={detail.coachid} coach={detail} />
				
				<ul className="list-group prop-list-group" style="margin-top: 20px;">
					<li className="list-group-item">
						<span className="icon"><i className="fa fa-circle-o"></i></span>
			        	<span className="title">所属驾校：</span>
			        	<span className="info">龙泉驾校</span>
					</li>
					<li className="list-group-item">
						<span className="icon"><i className="fa fa-circle-o"></i></span>
			        	<span className="title">练车场地：</span>
			        	<span className="info">龙泉驾校北部训练场</span>
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
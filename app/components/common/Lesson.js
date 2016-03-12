import React from 'react';
import {Link} from 'react-router';

class Lesson extends React.Component {
	constructor(props) {
        super(props);
    }

	render() {
		let lesson = this.props.lesson;
		let schoolId = this.props.schoolId;
		let coachId = this.props.coachId;

		return (
			<li className="list-group-item">
            	<div className="lesson-item">
            		<div className="header">
	                    <span className="title">{lesson.car_model.code} {lesson.name}</span>
	                    <span className="price">¥ {lesson.price}</span>
	                </div>
	                <div className="info">{lesson.desc}</div>
	                <div className="footer">
	                    <span className="time"><i className="icon-time"></i> {lesson.schedule}</span>
                        <Link to={'/signup/' + schoolId + '/' + coachId + '/' + lesson.id} className="btn btn-default btn-signup">报名</Link>
	                </div>
            	</div>
            </li>
		);
	}
}

export default Lesson;
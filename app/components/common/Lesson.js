import React from 'react';

class Lesson extends React.Component {
	constructor(props) {
        super(props);
    }

	render() {
		let lesson = this.props.lesson;
		return (
			<li className="list-group-item">
            	<div className="lesson-item">
            		<div className="header">
	                    <span className="title">{lesson.carmodel.code} {lesson.classname}</span>
	                    <span className="price">¥ {lesson.onsaleprice}</span>
	                </div>
	                <div className="info">{lesson.classdesc}</div>
	                <div className="footer">
	                    <span className="time"><i className="fa fa-clock-o"></i> {lesson.classchedule}</span>
                        <a href={'/signup/' + lesson.classid} className="btn btn-default btn-signup">报名</a>
	                </div>
            	</div>
            </li>
		);
	}
}

export default Lesson;
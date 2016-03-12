import React from 'react';
import {Link} from 'react-router';

import Stars from './Stars';

class CoachSimple extends React.Component {
	constructor(props) {
        super(props);
    }
    
	render() {
        let coach = this.props.coach;
        // 头像
        let imgUrl = 'http://placehold.it/80x80';
        if(coach && coach.head_img && coach.head_img.originalpic) {
            imgUrl = coach.head_img.originalpic;
        }

        // 科目
        let subjects = coach.subjects || [];
        let subjectText = '';
        subjects.forEach((item) => {
            subjectText = subjectText + '、' + item.name;
        });
        subjectText = subjectText.substring(1, subjectText.length);
        
		return (
			<Link to={''} className="coach-item">
                <div className="left">
                    <img className="img-circle" src={imgUrl} alt=""/>
                </div>
                <div className="middle">
                    <div className="title">{coach.name}</div>
                    <Stars level={coach.level}/>
                    <div className="lesson">{subjectText}</div>
                </div>
            </Link>
		);
	}
}

export default CoachSimple;
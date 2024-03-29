import React from 'react';
import {Link} from 'react-router';

import Stars from './Stars';

class Coach extends React.Component {
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

        // 等级信息
        let desc = '暂无描述信息';

        let toUrl = '/coach/' + coach.id;
        if(this.props.lessonId && this.props.schoolId) {
            toUrl = '/signup/' + this.props.schoolId + '/' + coach.id + '/' + this.props.lessonId;
        }
        
		return (
			<Link to={toUrl} className="coach-item">
                <div className="left">
                    <img className="img-circle" src={imgUrl} alt=""/>
                </div>
                <div className="middle">
                    <div className="title">{coach.name}</div>
                    <div className="lesson">{subjectText}</div>
                    <div className="desc">{desc}</div>
                </div>
                <div className="right">
                    <Stars level={coach.level}/>
                    <div className="age">教龄：{coach.seniority}年</div>
                    <div className="rate">通过率：{coach.pass_rate}%</div>
                </div>
            </Link>
		);
	}
}

export default Coach;
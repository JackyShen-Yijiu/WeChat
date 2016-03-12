import React from 'react';

import Stars from './Stars';

class Coach extends React.Component {
	constructor(props) {
        super(props);
    }
    
	render() {
        let coach = this.props.coach;
        // 头像
        let imgUrl = coach.head_img.originalpic;
        if(!imgUrl) {
            imgUrl = 'http://placehold.it/80x80';
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
        
		return (
			<a href={'/coach/' + coach.coachid} className="coach-item">
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
            </a>
		);
	}
}

export default Coach;
import React from 'react';
import {Link} from 'react-router';

import Stars from './Stars';

class School extends React.Component {
    constructor(props) {
        super(props);
    }

	render() {
        let school = this.props.school;
        // 距离
        let distance = school.distance;
        if(distance > 1000) {
            distance = Math.ceil(distance/1000) + 'km';
        } else {
            distance = distance + 'm';
        }

        // 图片
        let imgUrl = school.logo_img.originalpic;
        if(!imgUrl) {
            imgUrl = 'http://placehold.it/100x80';
        }

        // 价格
        let minPrice = school.min_price;
        let maxPrice = school.max_price;
        let price = '暂无价格';
        if(minPrice && maxPrice) {
            price = '¥' + minPrice + '~¥' + maxPrice; 
        }

		return (
			<Link to={ '/school/' + school.id} className="school-item">
                <div className="left">
                    <img src={imgUrl} alt=""/>
                </div>
                <div className="middle">
                    <div className="title">{school.name}</div>
                    <div className="address">{school.address}</div>
                    <div className="price">{price}</div>
                </div>
                <div className="right">
                    <Stars level={school.school_level}/>
                    <div className="distance">{distance}</div>
                    <div className="coach">{school.coach_count}名认证教练</div>
                </div>
            </Link>
		);
	}
}

export default School;
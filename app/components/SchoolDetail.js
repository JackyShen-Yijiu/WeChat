import React from 'react';

import SchoolDetailActions from '../actions/SchoolDetailActions';
import SchoolDetailStore from '../stores/SchoolDetailStore';

import Stars from './common/Stars';
import Lesson from './common/Lesson';

class SchoolDetail extends React.Component {
	constructor(props) {
        super(props);
        this.state = SchoolDetailStore.getState();
        this.onChange = this.onChange.bind(this);
    }

    onChange(state) {
        this.setState(state);
    }

    componentDidMount() {
        SchoolDetailStore.listen(this.onChange);
        SchoolDetailActions.getSchoolDetail(this.props.params.id);
    }

    componentWillUnmount() {
        SchoolDetailStore.unlisten(this.onChange);
    }

	render() {
		let detail = this.state.detail;

		// 班型列表
		let lessonList = detail.class_list ? detail.class_ist.map((lesson) => {
			return (
				<Lesson key={lesson.id} lesson={lesson}/>
			);
		}) : '';

		// 驾校图片
		let imgUrl = detail.logo_img ? detail.logo_img.originalpic : 'http://placehold.it/400x180';

		// 价格
        let minPrice = detail.min_price;
        let maxPrice = detail.max_price;
        let price = '暂无价格信息'
        if(minPrice && maxPrice) {
            price = '¥' + minPrice + '~¥' + maxPrice; 
        }

		return (
			<div className="sd-wrap">
		        <header className="sd-header">
		        	<img src={imgUrl} />
		            <div className="title">{detail.name}</div>
		            <Stars level={detail.level}/>
		        </header>

		        <ul className="list-group prop-list-group">
		            <li className="list-group-item">
		            	<span className="icon"><i className="fa fa-circle-o"></i></span>
		            	<span className="title">价格：</span>
		            	<span className="info">{price}</span>
		            </li>
		            <li className="list-group-item">
		            	<span className="icon"><i className="fa fa-circle-o"></i></span>
		            	<span className="title">地址：</span>
		            	<span className="info">{detail.address}</span>
		            </li>
		            <li className="list-group-item">
		            	<span className="icon"><i className="fa fa-rmb"></i></span>
		            	<span className="title">通过率：</span>
		            	<span className="info">{detail.pass_rate}%</span>
		            </li>
		            <li className="list-group-item">
		            	<span className="icon"><i className="fa fa-clock-o"></i></span>
		            	<span className="title">营业时间：</span>
		            	<span className="info">{detail.hours}</span>
		            </li>
		        </ul>

		        <ul className="list-group info-list-group">
		            <li className="list-group-item">驾校简介</li>
		            <li className="list-group-item">
		                <div className="school-info">{detail.introduction}</div>
		            </li>
		        </ul>

		        <ul className="list-group link-list-group">
		            <a href={'/coachs/' + detail.id} className="list-group-item">教练信息 <i className="fa fa-angle-right pull-right"></i></a>
		            <a href={'/shuttles/' + detail.id} className="list-group-item">班车信息 <i className="fa fa-angle-right pull-right"></i></a>
		            <a href={'/grounds/' + detail.id} className="list-group-item">训练场地信息 <i className="fa fa-angle-right pull-right"></i></a>
		        </ul>
				
				<ul className="list-group lesson-list-group">
		            <li className="list-group-item">课程班型</li>
		           	{lessonList}
		        </ul>
				
		    </div>
		);
	}
}

export default SchoolDetail;
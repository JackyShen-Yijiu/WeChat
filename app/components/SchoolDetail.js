import React from 'react';
import {Link} from 'react-router';
import DocumentTitle from 'react-document-title';

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
		let lessonList = detail.class_list ? detail.class_list.map((lesson) => {
			return (
				<Lesson key={lesson.id} lesson={lesson} schoolId={detail.id} coachId={-1}/>
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

        // 营业时间
        let hours = detail.hours || '暂无信息';

        // 教练信息 ／ 班车信息 ／ 场地信息
        let coachCount = detail.coach_count;
        let groundCount = detail.ground_count;
        let shuttleCount = detail.bus_count;

        let coachLink = (
        	<Link to={'/school/' + detail.id + '/coachs'} className="list-group-item">教练信息 <i className="icon-more_right pull-right"></i></Link>
        );
        if(coachCount <= 0) {
        	coachLink = (
	        	<li  className="list-group-item">教练信息 <span className="pull-right">暂无信息</span></li>
	        );
        }

        let shuttleLink = (
        	<Link to={'/school/' + detail.id + '/shuttles'} className="list-group-item">班车信息 <i className="icon-more_right pull-right"></i></Link>
        );
        if(shuttleCount <= 0) {
        	shuttleLink = (
	        	<li  className="list-group-item">班车信息 <span className="pull-right">暂无信息</span></li>
	        );
        }

        let groundLink = (
        	<Link to={'/school/' + detail.id + '/grounds/'} className="list-group-item">训练场地信息 <i className="icon-more_right pull-right"></i></Link>
        );
        if(groundCount <= 0) {
        	groundLink = (
	        	<li  className="list-group-item">训练场地信息 <span className="pull-right">暂无信息</span></li>
	        );
        }

		return (
			<DocumentTitle title="驾校详情">
				<div className="sd-wrap">
			        <header className="sd-header">
			        	<img src={imgUrl} />
			            <div className="title">{detail.name}</div>
			            <Stars level={detail.level}/>
			        </header>

			        <ul className="list-group prop-list-group">
			            <li className="list-group-item">
			            	<span className="icon"><i className="icon-money"></i></span>
			            	<span className="title">价格：</span>
			            	<span className="info">{price}</span>
			            </li>
			            <li className="list-group-item">
			            	<span className="icon"><i className="icon-location"></i></span>
			            	<span className="title">地址：</span>
			            	<span className="info">{detail.address}</span>
			            </li>
			            <li className="list-group-item">
			            	<span className="icon"><i className="icon-pass"></i></span>
			            	<span className="title">通过率：</span>
			            	<span className="info">{detail.pass_rate}%</span>
			            </li>
			            <li className="list-group-item">
			            	<span className="icon"><i className="icon-time"></i></span>
			            	<span className="title">营业时间：</span>
			            	<span className="info">{hours}</span>
			            </li>
			        </ul>

			        <ul className="list-group info-list-group">
			            <li className="list-group-item">驾校简介</li>
			            <li className="list-group-item">
			                <div className="school-info">{detail.introduction || '暂无描述'}</div>
			            </li>
			        </ul>

			        <ul className="list-group link-list-group">
						{coachLink}
						{shuttleLink}
						{groundLink}		            
			        </ul>
					
					<ul className="list-group lesson-list-group">
			            <li className="list-group-item">课程班型</li>
			           	{lessonList}
			        </ul>
					
			    </div>
		    </DocumentTitle>
		);
	}
}

export default SchoolDetail;
import React from 'react';
import {Link} from 'react-router';
import DocumentTitle from 'react-document-title';

import UserCenterStore from '../stores/UserCenterStore';
import UserCenterActions from '../actions/UserCenterActions';

class UserCenter extends React.Component {
	constructor(props) {
		super(props);
		this.state = UserCenterStore.getState();
        this.onChange = this.onChange.bind(this);
	}

	onChange(state) {
        this.setState(state);
    }

	componentDidMount() {
		UserCenterStore.listen(this.onChange);
		let openid = localStorage.getItem('openid');
        UserCenterActions.getOrder(openid);
	}

	componentWillUnmount() {
		UserCenterStore.unlisten(this.onChange);
	}

	render() {
		let orderData = this.state.order || {};
		let school = orderData.applyschoolinfo;
		let lesson = orderData.applyclasstypeinfo;
		let payStatus = orderData.paytypestatus; // 0 未 1

		let orderNode = (() => {
			if(!school || !lesson) {
				return (
					<div></div>
				);
			}

			return (
				<ul className="list-group order-list-group mt20">
		            <li className="list-group-item">
		            	<div className="order-item">
		            		<div className="header">
			                    <div className="title">{school.name}</div>
			                    <div className="price">实付款：¥{lesson.onsaleprice}</div>
			                </div>
			                <div className="footer">
			                	<div className="lesson">报车班型：{lesson.name}</div>
			                	<div className="time">报名时间：{orderData.applytime}</div>
			                	<div className="qr">
			                		<img src={'/jzapi/v1/createQrCode?size=10&text=' + orderData.scanauditurl}  alt=""/>
			                	</div>
			                </div>
		            	</div>
		            </li>
		            <li className="list-group-item">
		            	<Link to={'/pay/' + school.id + '/-1/' + lesson.id} className="pay">微信支付 
		            		<span className="pull-right">{payStatus == 0 ? '未支付' : '已支付'} <i className="icon-more_right pull-right"></i></span>
		            	</Link>
		            </li>
		        </ul>
			);
		})();

		return (
			<DocumentTitle title="个人中心">
				<div className="pc-wrap">
					<div className="user-item">
			            <div className="left">
			                <img className="img-circle" src={orderData.logimg || 'http://placehold.it/80x80'} alt=""/>
			            </div>
			            <div className="middle">
			                <div className="name">{orderData.name}</div>
			                <div className="mobile">{orderData.mobile || '暂无'}</div>
			                <div className="ycode">我的Y码：{orderData.Ycode || '暂无'}</div>
			            </div>
			        </div>

			        {orderNode}
				</div>
			</DocumentTitle>
		);
	}
}

export default UserCenter;
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

	handlePreview(imgUrl) {
		let allUrl = location.origin + imgUrl;
		console.log(allUrl);
		wx.previewImage({
		    current: allUrl,
		    urls: [allUrl]
		});
	}

	render() {
		let orderData = this.state.order;
		if(!orderData || !orderData.applyschoolinfo || !orderData.applyclasstypeinfo) {
			return (
				<div className="pc-wrap">
					<DocumentTitle title="个人中心"></DocumentTitle>
					<div className="user-item">
			            <div className="left">
			                <img className="img-circle" src={'http://placehold.it/80x80'} alt=""/>
			            </div>
			            <div className="middle">
			                <div className="name">姓名：未知</div>
			                <div className="mobile">手机号：暂无</div>
			                <div className="ycode">我的Y码：暂无</div>
			            </div>
			        </div>
				</div>
			);
		}

		let school = orderData.applyschoolinfo;
		let lesson = orderData.applyclasstypeinfo;
		let payStatus = orderData.paytypestatus; // 0 未 1
		let payType = orderData.paytype; // 1 现场 2 微信

		let sceneSuccessLink = '/successful/';
		let wechatSuccessLink = '/wechatsuccessful/';
		let payLink = '/pay/' + school.id + '/-1/' + lesson.id;

		let orderStateNode = (() => {
			let link = '';
			if(payType == 1) { // 现场支付
				if(payStatus == 20) { // 已支付
					link = wechatsuccessful;
				} else { // 未支付
					link = sceneSuccessLink;
				}
			} else { // 微信支付
				if(payStatus == 20) { // 已支付
					link = wechatSuccessLink;
				} else { // 未支付
					link = payLink;
				}
			}

			return (
				<li className="list-group-item">
	            	<Link to={link} className="pay">
	            		{payType == 1 ? '现场支付' : '微信支付'}
	            		<span className="pull-right">{payStatus == 20 ? '已支付' : '未支付'}
	            			<i className="icon-more_right pull-right"></i>
	            		</span>
	            	</Link>
	            </li>
			);
		})();

		let orderNode = (() => {
			if(!school.id || !lesson.id) {
				return (
					<div></div>
				);
			}

			let styleObj = {
				display: 'none'
			};

			if(payType == 1) {
				styleObj = {
					display: 'block'
				}
			}

			let imgUrl = '/jzapi/v1/createQrCode?size=10&text=' + orderData.scanauditurl;
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
			                		<img style={styleObj} src={imgUrl}  alt="" onClick={this.handlePreview.bind(this, imgUrl)}/>
			                	</div>
			                </div>
		            	</div>
		            </li>
		            {orderStateNode}
		        </ul>
			);
		})();

		return (
			<div className="pc-wrap">
				<DocumentTitle title="个人中心"></DocumentTitle>
				<div className="user-item">
		            <div className="left">
		                <img className="img-circle" src={orderData.logimg || 'http://placehold.it/80x80'} alt=""/>
		            </div>
		            <div className="middle">
		                <div className="name">姓名：{orderData.name}</div>
		                <div className="mobile">手机号：{orderData.mobile || '暂无'}</div>
		                <div className="ycode">我的Y码：{orderData.Ycode || '暂无'}</div>
		            </div>
		        </div>
		        {orderNode}
			</div>
		);
	}
}

export default UserCenter;

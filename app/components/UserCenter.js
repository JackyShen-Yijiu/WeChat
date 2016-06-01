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
		let {query} = this.props.location;
        let openid = query.openid;
		if(openid) {
            localStorage.setItem('openid', openid);
        } else {
			openid = localStorage.getItem('openid');
		}
        UserCenterActions.getOrder(openid);
		UserCenterActions.getLecooOrder(openid);
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

	num2str(num) {
		var str = num + "";
		var length = 8 - str.length;
		for(var i = 0; i < length; i++) {
			str = '0' + str;
		}
		return str;
	}

	render() {
		let orderData = this.state.order;
		let lecooOrder = this.state.lecooOrder;

		if(!orderData.orderid && !lecooOrder.id) {
			return (
				<div className="pc-wrap">
					<DocumentTitle title="个人中心"></DocumentTitle>
					<div className="user-item">
			            <div className="left">
			                <img className="img-circle" src={''} alt=""/>
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

		let user = {};
		if(orderData) {
			user.name = orderData.name;
			user.mobile = orderData.mobile;
			user.avatar = orderData.logimg;
			user.ycode = orderData.Ycode || '暂无';
		}
		if(lecooOrder) {
			user.name = user.name || lecooOrder.name || '暂无';
			user.mobile = user.mobile || lecooOrder.mobile || '暂无';
			user.avatar = user.avatar || lecooOrder.avatar || '';
		}

		let orderNode = (() => {
			let school = orderData.applyschoolinfo || {};
			let lesson = orderData.applyclasstypeinfo || {};
			let payType = orderData.paytype; // 1 现场 2 微信

			if(!school.id || !lesson.id) {
				return (
					<div></div>
				);
			}

			let orderStateNode = (() => {
				let payStatus = orderData.paytypestatus; // 0 未 1
				let link = '';
				let sceneSuccessLink = '/successful/';
				let wechatSuccessLink = '/wechatsuccessful/';
				let payLink = '/pay/' + school.id + '/-1/' + lesson.id;
				if(payType == 1) { // 现场支付
					if(payStatus == 20) { // 已支付
						link = wechatSuccessLink;
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

		// 利客订单
		let lecooOrderNode = (() => {
			if(!lecooOrder || !lecooOrder.id) {
				return (
					<div></div>
				);
			}

			let lecooSchool = lecooOrder.schoolInfo;
			let createTime = lecooOrder.modifyTime.substring(0, 10);
			let orderNum = this.num2str(lecooOrder.id);

			let payUrl = './lecoo/lecoo/pay.html?id=' + lecooOrder._id;
			let successUrl = './lecoo/lecoo/success.html?id=' + lecooOrder._id;

			let hasPay = lecooOrder.status == 3;

			return (
				<div className="ui-panel ui-panel-order">
	                <div className="ui-panel-hd">订单编号：{orderNum}</div>
	                <div className="ui-panel-bd">
	                    <div className="media-box media-order">
	                        <div className="media-bd">
	                            <h4 className="title">{lecooSchool.name}</h4>
	                            <p className="time">报名时间：{createTime}</p>
	                        </div>
	                        <div className="media-rd">
	                            <h4 className="type">{lecooOrder.payType == 1 ? '现场支付' : '微信支付'}</h4>
	                            <p className="lesson">{lecooSchool.lesson}</p>
	                        </div>
	                    </div>
	                </div>
	                <a href={lecooOrder.status == 3 ? successUrl : payUrl} className="ui-panel-ft">
	                    需付款：<span className="price">¥ {lecooSchool.price}</span>
					<span className={hasPay ? 'status has-pay' : 'status'}>{hasPay ? '已支付' : '未支付'}</span>
						<i className="icon-more_right link-icon"></i>
					</a>
	            </div>
			);
		})();

		return (
			<div className="pc-wrap">
				<DocumentTitle title="个人中心"></DocumentTitle>
				<div className="user-item">
		            <div className="left">
		                <img className="img-circle" src={user.avatar} alt=""/>
		            </div>
		            <div className="middle">
		                <div className="name">姓名：{user.name}</div>
		                <div className="mobile">手机号：{user.mobile}</div>
		                <div className="ycode">我的Y码：{user.ycode}</div>
		            </div>
		        </div>
		        {orderNode}
				{lecooOrderNode}
			</div>
		);
	}
}

export default UserCenter;

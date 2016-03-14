import React from 'react';

class SceneSuccess extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		let orderData = localStorage.getItem('order');
		orderData = JSON.parse(orderData);
		this.setState({
			orderData
		})
	}

	render() {
		let orderData = this.state.orderData || {};
		let school = orderData.applyschoolinfo || {};
		let lesson = orderData.applyclasstypeinfo || {};

		return (
			<div className="sc-wrap">
		        <div className="sc-top">
		            <img src="/img/success_apply.png" alt=""/>
		        </div>
		        <ul className="list-group order-list-group mt20">
		            <li className="list-group-item">
		                <div className="lesson-item">
		                    <div className="header">
		                        <span className="title">{school.name}</span>
		                        <span className="price">需线下支付：¥{lesson.onsaleprice}</span>
		                    </div>
		                    <div className="middle">
		                        <div className="lesson">班型：{lesson.name}</div>
		                        <div className="time">报名时间：{orderData.applytime}</div>
		                        <a href="#" className="btn btn-default btn-cancel">取消订单</a>
		                    </div>
		                </div>
		            </li>
		        </ul>
		        <ul className="list-group info-list-group mt20">
		            <li className="list-group-item">
		                <p>请您于一个月内携带资料前往您所报名的驾校确认报名信息，并支付报名费用。</p>
		                <div className="qr-wrap">
		                    <img src={'/jzapi/v1/createQrCode?size=10&text=' + orderData.scanauditurl} alt=""/>
		                    <div>(扫码提交报名信息)</div>
		                    <div className="sred">您的报名编号：{orderData.orderid}</div>
		                </div>
		            </li>
		            <li className="list-group-item">
		                <div className="title">二维码使用说明：</div>
		                <p>在确认订单信息时，只需将此二维码提供给驾校工作人员即可，由工作人员扫描二维码，确认报名信息。</p>
		                <div className="title">携带资料说明：</div>
		                <p>去驾校缴费时请您携带身份证，体检表，户口本，报名电子订单，相关流程如有疑问，请直接致电：400-626-9255</p>
		            </li>
		        </ul>
		    </div>
		);
	}
}

export default SceneSuccess;
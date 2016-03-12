import React from 'react';
import {Link} from 'react-router';

class UserCenter extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {

	}

	componentWillUnmount() {
		
	}

	render() {
		return (
			<div className="pc-wrap">
				<div className="user-item">
		            <div className="left">
		                <img className="img-circle" src="http://placehold.it/80x80" alt=""/>
		            </div>
		            <div className="middle">
		                <div className="name">张三</div>
		                <div className="mobile">13436306675</div>
		                <div className="ycode">我的Y码：FHGYHGYIBGTU</div>
		            </div>
		        </div>

		        <ul className="list-group order-list-group mt20">
		            <li className="list-group-item">
		            	<div className="order-item">
		            		<div className="header">
			                    <div className="title">一步互联网驾校</div>
			                    <div className="price">实付款：¥ 3600</div>
			                </div>
			                <div className="footer">
			                	<div className="lesson">报车班型：C1全周班</div>
			                	<div className="time">报名时间：2016/03/09</div>
			                	<div className="qr">
			                		<img src="http://placehold.it/60x60" alt=""/>
			                	</div>
			                </div>
		            	</div>
		            </li>
		            <li className="list-group-item">
		            	<Link to="#" className="pay">微信支付 
		            		<span className="pull-right">未支付 <i className="fa fa-angle-right"></i></span>
		            	</Link>
		            </li>
		        </ul>
			</div>
		);
	}
}

export default UserCenter;
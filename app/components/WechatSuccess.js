import React from 'react';

class WechatSuccess extends React.Component {
	render() {
		return (
			<div className="ws-wrap">
				<div className="ws-top">
					<img src="img/success_pay.png" alt=""/>
					<img className="btn-share" src="img/button_share.png" alt=""/>
				</div>
				<div className="ws-content">
					<div className="title">分享Y码 邀请得返现</div>
					<p className="desc">将你的Y码分享给你的小伙伴，当他们收到您的Y码并通过极致驾服也成功报名驾校后，您和报名者均能获得一笔返现金额，Y码能无限分享，分享越多，得到的返现就越多哦。</p>
				</div>
			</div>
		);
	}
}

export default WechatSuccess;
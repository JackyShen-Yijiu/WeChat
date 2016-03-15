import React from 'react';
import DocumentTitle from 'react-document-title';

class WechatSuccess extends React.Component {
	constructor(props) {
		super(props);
	}

	handleShare() {
		// 弹出指示图标

		wx.onMenuShareTimeline({ // 分享到朋友圈
		    title: '', // 分享标题
		    link: '', // 分享链接
		    imgUrl: '', // 分享图标
		    success: function () { 
		        // 用户确认分享后执行的回调函数
		    },
		    cancel: function () { 
		        // 用户取消分享后执行的回调函数
		    }
		});

		wx.onMenuShareAppMessage({ // 分享到朋友
		    title: '', // 分享标题
		    desc: '', // 分享描述
		    link: '', // 分享链接
		    imgUrl: '', // 分享图标
		    type: '', // 分享类型,music、video或link，不填默认为link
		    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
		    success: function () { 
		        // 用户确认分享后执行的回调函数
		    },
		    cancel: function () { 
		        // 用户取消分享后执行的回调函数
		    }
		});
	}

	render() {
		return (
			<DocumentTitle title="报名成功">
				<div className="ws-wrap">
					<div className="ws-top">
						<img src="/img/success_pay.png" alt=""/>
					</div>
					<img className="btn-share" src="/img/button_share.png" onClick={this.handleShare.bind(this)} alt=""/>
					<div className="ws-content">
						<div className="title">分享Y码 邀请得返现</div>
						<p className="desc">将你的Y码分享给你的小伙伴，当他们收到您的Y码并通过极致驾服也成功报名驾校后，您和报名者均能获得一笔返现金额，Y码能无限分享，分享越多，得到的返现就越多哦。</p>
					</div>
				</div>
			</DocumentTitle>
		);
	}
}

export default WechatSuccess;
import React from 'react';
import DocumentTitle from 'react-document-title';

import WechatSuccessStore from '../stores/WechatSuccessStore';
import WechatSuccessActions from '../actions/WechatSuccessActions';

class WechatSuccess extends React.Component {
	constructor(props) {
		super(props);
		this.state = WechatSuccessStore.getState();
        this.onChange = this.onChange.bind(this);
	}

	onChange(state) {
        this.setState(state);
    }

    componentDidMount() {
    	WechatSuccessStore.listen(this.onChange);
		let openid = localStorage.getItem('openid');
        WechatSuccessActions.getOrder(openid);
    }

    componentWillUnmount() {
		WechatSuccessStore.unlisten(this.onChange);
    }

	handleShare() {
		let order = this.state.order;

		if(!order.Ycode) {
			toastr.success('没有获取到Y码，无法分享！');
			return;
		}
		// 弹出指示图标
		$('.ws-share').show();
		setTimeout(function(){
			$('.ws-share').hide();
		}, 2000);

		wx.onMenuShareTimeline({ // 分享到朋友圈
		    title: '摇身一变Y码券，报名可返现', // 分享标题
		    link: 'http://weixin.jizhijiafu.cn/ycode?ycode=' + order.Ycode, // 分享链接
		    imgUrl: 'http://weixin.jizhijiafu.cn/img/logo.png', // 分享图标
		    success: function () {
		        // 用户确认分享后执行的回调函数
		        toastr.success('分享成功！');
		    },
		    cancel: function () {
		        // 用户取消分享后执行的回调函数
		    }
		});

		wx.onMenuShareAppMessage({ // 分享到朋友
		    title: '摇身一变Y码券，报名可返现', // 分享标题
		    desc: '领取此Y码并在报名驾校时使用即可获得巨额返现，同时分享此Y码者也可获得相应返现，这么好的事还不赶快领取使用！', // 分享描述
		    link: 'http://weixin.jizhijiafu.cn/ycode?ycode=' + order.Ycode, // 分享链接
		    imgUrl: 'http://weixin.jizhijiafu.cn/img/logo.png', // 分享图标
		    type: 'link', // 分享类型,music、video或link，不填默认为link
		    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
		    success: function () {
		        // 用户确认分享后执行的回调函数
		        toastr.success('分享成功！');
		    },
		    cancel: function () {
		        // 用户取消分享后执行的回调函数
		    }
		});
	}

	render() {
		let order = this.state.order;
		return (
			<div>
				<div className="ws-share">
			        <i className="icon-point"></i>
			        <span>点击菜单进行分享</span>
			    </div>
				<div className="ws-wrap">
					<DocumentTitle title="报名成功"></DocumentTitle>
					<div className="ws-top">
						<img src="/img/success_pay.png" alt=""/>
						<span className="ws-ycode">您的Y码为：{order.Ycode}</span>
					</div>
					<img className="btn-share" src="/img/button_share.png" onClick={this.handleShare.bind(this)} alt=""/>
					<div className="ws-content">
						<div className="title">分享Y码 邀请得返现</div>
						<p className="desc">将你的Y码分享给你的小伙伴，当他们收到您的Y码并通过极致驾服也成功报名驾校后，您和报名者均能获得一笔返现金额，Y码能无限分享，分享越多，得到的返现就越多哦。</p>
					</div>
					<img className="btn-download" src="/img/app_down.png" alt="" />
				</div>
			</div>
		);
	}
}

export default WechatSuccess;

import React from 'react';
import DocumentTitle from 'react-document-title';

import CollectYcodeStore from '../stores/CollectYcodeStore'
import CollectYcodeActions from '../actions/CollectYcodeActions';

class CollectYcode extends React.Component {
    constructor(props) {
        super(props);
        this.state = CollectYcodeStore.getState();
        this.onChange = this.onChange.bind(this);
        this.regexMobile = /^0?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/;
    }

    onChange(state) {
        this.setState(state);
    }

    componentDidMount() {
        CollectYcodeStore.listen(this.onChange);
        let {query} = this.props.location;
        CollectYcodeActions.getUserInfo(query);
    }

    componentWillUnmount() {
        CollectYcodeStore.unlisten(this.onChange);
    }

    handleCollect() {
    	let mobile = this.state.mobile;
    	let {query} = this.props.location;
    	let ycode = query.ycode;
    	if (!this.regexMobile.test(mobile)) {
    		CollectYcodeActions.invalidMobile();
    	} else {
    		CollectYcodeActions.saveUserYcode({
    			ycode: ycode,
    			mobile: mobile
	    	});
    	}
    }

    handleClick() {
    	toastr.info('请扫描下图的二维码下载APP！');
    }

    render() {
    	let user = this.state.user;
    	let {query} = this.props.location;
    	let ycode = query.ycode;
    	let isSave = this.state.isSave;
    	let imgUrl = '/img/weixin/222.jpg';
    	if(user && user.headportrait && user.headportrait.originalpic) {
    		imgUrl = user.headportrait.originalpic;
    	}
    	return (
    		<div style={{background:'#fff'}}>
	    		<div className="cy-wrap">
					<div className="logo">
						<img src="/img/logo.png" alt="" />
						<span>极致驾服</span>
					</div>
					<div className="title">
						<div className="title-top">Y码摇身一变Y码券</div>
						<p>好友领取并成功报名</p>
						<p>双方将各得<span className="lighthigh">巨额</span>返现</p>
						<div className="head-img">
							<img src={imgUrl} className="img-circle" />
						</div>
						<p className="name">{user.name}</p>
					</div>
					<div className="y-code">
						<p className="code">Y码 <span className="lighthigh">{ycode}</span></p>
					</div>

					<div className="btn-sign" style={this.state.isSave ? {display: 'none'} : {display: 'block'}}>
						<input type="text" className="form-control" placeholder="请输入您的手机号码" value={this.state.mobile} onChange={CollectYcodeActions.updateMobile} />
						<button type="button" className="btn  btn-info btn-lg btn-block" onClick={this.handleCollect.bind(this)}>领取Y码券</button>
					</div>

					<div className="btn-sign other-btn" style={this.state.isSave ? {display: 'block'} : {display: 'none'}}>
						<p className="code-content">Y码券已放入账户 {this.state.mobile}</p>
						<a href="http://weixin.jizhijiafu.cn/jzapi/weixin/authorizeUser" className="btn btn-default btn-lg btn-block">立即微信报名返现</a>
						<button type="button" className="btn btn-info btn-lg btn-block" onClick={this.handleClick.bind(this)}>下载APP报名返现</button>
					</div>
					<div className="ycode-detail">
						<p className="title">Y码券说明</p>
						<div className="content">
							<p className="item_1">1.您所领取的Y码券来自向您分享者的Y码.</p>
							<p>2.Y码券可以让您在报名驾校成功后得到一定金额的返现，每次仅限使用一张Y码券，每张Y码券的返现面值都一样</p>
							<p>3.当您使用Y码券时，该张Y码券的分享者也会得到一定数值的返现，当您报名支付成功后，您也将得到一个Y码并可将Y码分享给你的小伙伴。</p>
							<p>4.Y码券的返现金额将会自动存入"极致驾服学员端"APP中您账号下的"我的钱包"中。请尽快下载APP查看相关内容。</p>
						</div>
					</div>
					<div className="down-app">
						<img src="/img/app_down.png" alt="" />
					</div>
				</div>
			</div>
    	);
    }
}


export default CollectYcode;

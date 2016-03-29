import React from 'react';
import DocumentTitle from 'react-document-title';

import YcodeListStore from '../stores/YcodeListStore';
import YcodeListActions from '../actions/YcodeListActions';

class YcodeList extends React.Component {
	constructor(props) {
		super(props);
		this.state = YcodeListStore.getState();
        this.onChange = this.onChange.bind(this);
	}

	onChange(state) {
        this.setState(state);
    }

	componentDidMount() {
		YcodeListStore.listen(this.onChange);
		let openid = localStorage.getItem('openid');
        YcodeListActions.getList(openid);
	}

	componentWillUnmount() {
		YcodeListStore.unlisten(this.onChange);
	}

	handleClick(ycode) {
		localStorage.setItem('ycode', ycode);
		this.props.history.goBack();
	}

	render() {
		let list = this.state.list.map((ycode, index) => {
            return (
                <div key={'code_' + index} className="yl-item" onClick={this.handleClick.bind(this, ycode.Ycode)}>
		            <div className="left">
		                <div className="name">分享者：<span className="lighthigh">{ycode.name}</span></div>
		                <div className="code">Y码 <span className="lighthigh">{ycode.Ycode}</span></div>
		                <div className="time">创建时间：{ycode.date}</div>
		            </div>
		        </div>
            );
        });

		return (
			<div className="yl-wrap">
				<DocumentTitle title="选择Y码"></DocumentTitle>
		        <div className="desc">
		            <div className="title"><i className="icon-exclamation"></i> Y码券可返现</div>
		            <p>1.Y码券可以让您在报名驾校成功后得到一定金额的返现；</p>
		            <p>2.每次仅限使用一张Y码券，每张Y码券返现面值都一样；</p>
		            <p>3.当您使用Y码券时，该张Y码券的分享者也会得到一定数值的返现；</p>
		            <p>4.当您报名支付完成后，您也将得到一个Y码并可将Y码分享给你的小伙伴；</p>
		            <p>5.Y码券的返现金额将会自动存入“极致驾服学院端”APP中您帐号下的“我的钱包”中。请尽快下载APP查看相关内容。</p>
		        </div>
		        <div className="tips">点击选择使用以下Y码：</div>
		        {list}
		    </div>
		);
	}
}

export default YcodeList;
import React from 'react';

import CostPayStore from '../stores/CostPayStore';
import CostPayActions from '../actions/CostPayActions';

class CostPay extends React.Component {
	constructor(props) {
		super(props);
		this.state = CostPayStore.getState();
        this.onChange = this.onChange.bind(this);
	}

	onChange(state) {
        this.setState(state);
    }

	componentDidMount() {
		CostPayStore.listen(this.onChange);
        CostPayActions.getSchool(this.props.params.school_id);
	}

	componentWillUnmount() {
		CostPayStore.unlisten(this.onChange);
	}

	changePayType(payType) {
		this.setState({payType: payType});
	}

	handlePay(event) {
		event.preventDefault();
		// 发起支付
		// Ycode
		// paytype 支付方式 1  线下支付  2 线上支付
		// openid
		// bcode 
		let ycode = this.state.ycode;
		let payType = this.state.payType;
		let bcode = this.state.bcode;
		let openid = localStorage.getItem('openid');

		console.log('ycode = ', this.state.ycode);
		console.log('payType = ', this.state.payType);
		console.log('bcode = ', this.state.bcode);

		CostPayActions.doPay({
			params: {
				openid: openid,
				ycode: ycode,
				paytype: payType,
				bcode: bcode
			},
			history: this.props.history
		});

	}

	render() {
		let coachId = this.props.params.coach_id;
		let schoolId = this.props.params.school_id;
		let lessonId = this.props.params.lesson_id;
		let school = this.state.school;

		// 驾校图片
		let imgUrl = school.logo_img ? school.logo_img.originalpic : 'http://placehold.it/400x180';

		// 教练
		let selectCoachName = '智能匹配';
		if(coachId != -1) {
			let coachList = school.coach_list ? school.coach_list : [];
			let selectCoach = coachList.filter((coach) => {
				return coach.id == coachId
			})[0];
			selectCoachName = selectCoach.name;
		}
		
		// 班型
		let lessonList = school.class_list ? school.class_list: []; // 班型
		let selectLesson = lessonList.filter((lesson) => {
			return lesson.id == lessonId
		})[0];
		let carModel = selectLesson ? selectLesson.car_model.code :'';
		let lessonName = selectLesson ? selectLesson.name : '';
		let price = selectLesson ? selectLesson.price : '';

		return (
			<div className="cp-wrap">
		        <div className="school-item">
		            <div className="left">
		                <img src={imgUrl} alt=""/>
		            </div>
		            <div className="middle">
		                <div className="title">{school.name}</div>
		                <div className="address">{school.address}</div>
		                <div className="coach">报考教练：{selectCoachName}</div>
		            </div>
		        </div>
		        <ul className="list-group input-list-group mt20">
		            <li className="list-group-item">
		                <span className="title">报名班型</span>
		                <span className="lesson">{carModel} {lessonName}</span>
		            </li>
		            <li className="list-group-item">
		                <span className="title">支付费用</span>
		                <span className="price">¥{price}</span>
		            </li>
		            <a href="#" className="list-group-item ycode-item">
		                <span className="title">Y码返现</span>
		                <span className="ycode">
		                	<input type="text" className="form-control" disabled value={this.state.ycode} onChange={CostPayActions.updateYcode} placeholder="请选择一张你领取的Y码券" />
		                	<i className="icon-more_right pull-right"></i>
		                </span>
		            </a>
		            <li className="list-group-item">
		                <span className="title">邀请码</span>
		                <input type="text" className="form-control"  value={this.state.bcode} onChange={CostPayActions.updateBcode} placeholder="请输入邀请码（选填）"/>
		            </li>
		        </ul>
		        <ul className="list-group pay-list-group mt20 mb20">
		            <li className="list-group-item">付款方式</li>
		            <li className="list-group-item" onClick={this.changePayType.bind(this, 2)}>
		                <div className="left">
		                    <img src="/img/wechat.png" alt=""/>
		                </div>
		                <div className="middle">
		                    <div className="title">微信支付</div>
		                    <div className="tips">推荐开通微信支付的用户使用</div>
		                </div>
		                <div className="right">
		                    <span><i className={this.state.payType == 2 ? 'icon-sure': 'icon-pay_off'}></i></span>
		                </div>
		            </li>
		            <li className="list-group-item" onClick={this.changePayType.bind(this, 1)}>
		                <div className="left">
		                    <img src="/img/scene.png" alt=""/>
		                </div>
		                <div className="middle">
		                    <div className="title">现场支付</div>
		                    <div className="tips">到指定现场了解更多后支付</div>
		                </div>
		                <div className="right">
		                    <span><i className={this.state.payType == 1 ? 'icon-sure': 'icon-pay_off'}></i></span>
		                </div>
		            </li>
		        </ul>

		        <footer className="cp-footer">
		            <div className="btn-group btn-group-justified">
		                <a className="btn btn-default btn-lg disabled">合计 ¥3600</a>
		                <a className="btn btn-default btn-lg btn-pay" onClick={this.handlePay.bind(this)}>确认报名</a>
		            </div>
		        </footer>
		    </div>
		);
	}

}

export default CostPay;
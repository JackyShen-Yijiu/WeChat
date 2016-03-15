import React from 'react';
import DocumentTitle from 'react-document-title';

import SignUpStore from '../stores/SignUpStore';
import SignUpActions from '../actions/SignUpActions';

class SignUp extends React.Component {
	constructor(props) {
		super(props);
		this.state = SignUpStore.getState();
        this.onChange = this.onChange.bind(this);
        this.regexMobile = /^0?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/;
        this.regexCode = /^[0-9]{5}$/;
	}

	onChange(state) {
        this.setState(state);
    }

	componentDidMount() {
		SignUpStore.listen(this.onChange);
        SignUpActions.getSchool(this.props.params.school_id);
	}

	componentWillUnmount() {
		SignUpStore.unlisten(this.onChange);
	}

	handleSend() {
		let mobile = this.state.mobile;
		if(!this.regexMobile.test(mobile)) {
			SignUpActions.invalidMobile();
		} else {
			SignUpActions.getCode(mobile);
		}
	}

	handleSubmit(event) {
		event.preventDefault();

		let coachId = this.props.params.coach_id;
		let schoolId = this.props.params.school_id;
		let lessonId = this.props.params.lesson_id;

		//this.props.history.pushState(null, '/pay/' + schoolId + '/' + coachId + '/' + lessonId);

		/* 测试 */
		let name = this.state.name.trim();
    	let mobile = this.state.mobile;
    	let code = this.state.code;

    	if (!name) {
    		SignUpActions.invalidName();
    	} else if (!this.regexMobile.test(mobile)) {
    		SignUpActions.invalidMobile();
    	} else if (!this.regexCode.test(code)) {
    		SignUpActions.invalidCode();
    	} else {
    		let openid = localStorage.getItem('openid');
    		let params = {
				name,
				mobile,
				smscode: code,
				schoolid: schoolId,
				coachid: coachId,
				classtypeid: lessonId,
				openid
			};
			// 缓存数据

    		// 报名
    		SignUpActions.signUp({
    			params,
    			history: this.props.history
    		});
    	}

	}

	render() {
		let coachId = this.props.params.coach_id;
		let schoolId = this.props.params.school_id;
		let lessonId = this.props.params.lesson_id;

		// '/school/' + schoolId + '/coachs/' + lessonId

		let school = this.state.school;
		let lessonList = school.class_list ? school.class_list: []; // 班型
		let selectLesson = lessonList.filter((lesson) => {
			return lesson.id == lessonId
		})[0];

		let carModel = selectLesson ? selectLesson.car_model.code :'';
		let lessonName = selectLesson ? selectLesson.name : '';
		let price = selectLesson ? selectLesson.price : '';

		return (
			<DocumentTitle title="报名信息">
				<div className="si-wrap">
					<ul className="list-group signup-list-group">
						<li className="list-group-item">
							<span>报考驾校</span>
							<span className="pull-right">{school.name}</span>
						</li>
						<li className="list-group-item">
							<span>报考教练</span>
							<span className="pull-right">智能匹配</span>
						</li>
						<li className="list-group-item">
							<span>班级类型</span>
							<span className="pull-right">{carModel} {lessonName} <em>¥ {price}</em></span>
						</li>
					</ul>

					<ul className="list-group input-list-group">
						<li className="list-group-item">
							<span className="title">您的姓名</span>
							<input type="text" className="form-control" ref="nameTextField" placeholder="请填写您的真实姓名" value={this.state.name} onChange={SignUpActions.updateName}/>
						</li>
						<li className="list-group-item">
							<span className="title">电话号码</span>
							<input type="text" className="form-control" ref="mobileTextField" placeholder="请填写您的电话号码" value={this.state.mobile} onChange={SignUpActions.updateMobile}/>
						</li>
						<li className="list-group-item">
							<span className="title">验证码</span>
							<input type="text" className="form-control" ref="codeTextField" placeholder="请填写您收到的验证码" value={this.state.code} onChange={SignUpActions.updateCode}/>
							<button className="btn btn-default btn-sendcode" type="button" onClick={this.handleSend.bind(this)}>发送验证码</button>
						</li>
					</ul>

					<footer className="si-footer">
						<button className="btn btn-default btn-lg btn-block btn-signup" type="button" onClick={this.handleSubmit.bind(this)}>提交</button>
					</footer>

				</div>
			</DocumentTitle>
		);
	}
}

export default SignUp;
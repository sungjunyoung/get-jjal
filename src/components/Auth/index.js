import React, {Component} from 'react';

import './style.css';

import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton';
import FacebookLogin from 'react-facebook-login';
import AlertContainer from 'react-alert'
import facebookAuth from './facebookAuth.json'

export default class Auth extends Component {

    alertOptions = {
        offset: 14,
        position: 'bottom left',
        theme: 'light',
        time: 5000,
        transition: 'scale'
    };

    constructor(props) {
        super(props);
        this.state = {
            formHeight: 0,
            formWidth: 0,
            userId: '',
            userPw: ''
        }
    }

    showAlert(type, message) {
        this.msg.show(message, {
            time: 2000,
            type: type,
        })
    }

    componentDidMount() {
        let {clientHeight, clientWidth} = this.refs.form;
        this.setState({formHeight: clientHeight, formWidth: clientWidth})
    }

    responseFacebook(response) {
        const component = this;
        if (response.name) {
            response.loginType = 'facebook';
            fetch('/users', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(response)
            }).then((response) => response.json())
                .then((response) => {
                    if (response.code === 'SUCCESS') {
                        sessionStorage.setItem("userId", response.userId);
                        sessionStorage.setItem("menuName", "내 짤방");
                        component.props.history.push('/');
                    } else {
                        // 로그인 실패
                        console.log('로그인 실패');
                        console.log(response)
                    }

                });
        } else {
            console.log('response.name 없어서 실패');
            console.log(response)
        }
    }

    onIdChange(e) {
        this.setState({userId: e.target.value})
    }

    onPwChange(e) {
        this.setState({userPw: e.target.value})
    }

    onLogin() {
        const id = this.state.userId;
        const pw = this.state.userPw;

        const userInfo = {};
        userInfo.username = id;
        userInfo.password = pw;
        userInfo.loginType = 'default';

        const component = this;
        fetch('/users', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userInfo)
        }).then((response) => response.json())
            .then((response) => {
                if (response.code === 'ID_LENGTH')
                    component.showAlert('error', '닉네임은 6자 이상 입력해주세요!');
                else if (response.code === 'PW_LENGTH')
                    component.showAlert('error', '패스워드는 8자 이상 입력해주세요!');
                else if (response.code === 'PW_INVALID')
                    component.showAlert('error', '패스워드를 다시 확인해주세요!');
                else if (response.code === 'DB_ERR')
                    component.showAlert('error', '데이터베이스 에러가 발생했습니다!');
                else if (response.code === 'SUCCESS') {
                    sessionStorage.setItem("userId", response.userId);
                    sessionStorage.setItem("menuName", "최근 짤방");
                    component.props.history.push('/');
                }
            });
    }

    onPressEnter(event) {
        if (event.key === 'Enter') {
            this.onLogin();
        }
    }

    render() {
        return (
            <div className="auth">
                <AlertContainer ref={a => this.msg = a}{...this.alertOptions}/>
                <div ref="form" style={{
                    display: 'inline-block', position: 'absolute',
                    top: '50%', left: '50%',
                    marginTop: -this.state.formHeight / 2, marginLeft: -this.state.formWidth / 2
                }}>
                    <div style={{maxWidth: 300, margin: 'auto', padding: 30}}>
                        <h1 className="logo">겟짤</h1>
                        <h3>
                            자신만의 짤방을 수집하고 공유해보세요!
                        </h3>
                        <div style={{width: 300, margin: 'auto'}}>
                            <TextField
                                style={{width: 300}}
                                onChange={this.onIdChange.bind(this)}
                                hintText="아이디를 입력해주세요"
                                floatingLabelText="아이디"
                                underlineFocusStyle={{borderColor: 'black'}}
                                floatingLabelStyle={{color: 'black'}}
                            />
                            <TextField
                                style={{width: 300, marginTop: -10}}
                                onChange={this.onPwChange.bind(this)}
                                hintText="패스워드를 입력해주세요"
                                floatingLabelText="패스워드"
                                type="password"
                                underlineFocusStyle={{borderColor: 'black'}}
                                floatingLabelStyle={{color: 'black'}}
                                onKeyPress={this.onPressEnter.bind(this)}
                            />
                            <RaisedButton
                                onTouchTap={this.onLogin.bind(this)}
                                style={{width: 300, marginTop: 10}}
                                label="로그인 / 회원가입"/>

                            <FacebookLogin
                                appId={facebookAuth.appId}
                                autoLoad={true}
                                fields="name,email,picture"
                                cssClass="facebook-login"
                                textButton="페이스북으로 로그인"
                                callback={this.responseFacebook.bind(this)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
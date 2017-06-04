import React, {Component} from 'react';

import './style.css';

import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton';
import FacebookLogin from 'react-facebook-login';
import AlertContainer from 'react-alert'


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
                    console.log(response);
                    if (response.code === 'SUCCESS') {
                        sessionStorage.setItem("userId", response.userId);

                        component.props.history.push('/');
                    } else {
                        // 로그인 실패
                    }

                });
        } else {

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
                console.log(response);
                if (response.code === 'SUCCESS') {
                    sessionStorage.setItem("userId", response.userId);

                    component.props.history.push('/');
                } else {
                    if(response.code === 'ID_LENGTH')
                        component.showAlert('error', '닉네임은 6자 이상 입력해주세요!');
                    else if(response.code === 'PW_LENGTH')
                        component.showAlert('error', '패스워드는 8자 이상 입력해주세요!');
                    else if(response.code === 'PW_INVALID')
                        component.showAlert('error', '패스워드를 다시 확인해주세요!');
                    else if(response.code === 'DB_ERR')
                        component.showAlert('error', '데이터베이스 에러가 발생했습니다!');

                }

            });
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
                    <Card style={{maxWidth: 400, margin: 'auto', padding: 30}}>
                        <CardTitle title="겟짤" subtitle="퍼가용"/>
                        <CardText>
                            자신만의 짤방을 수집하고 다른 사람들과 공유해보세요!
                        </CardText>
                        <CardActions style={{width: 300, margin: 'auto'}}>
                            <TextField
                                style={{width: 300}}
                                onChange={this.onIdChange.bind(this)}
                                hintText="아이디를 입력해주세요"
                                floatingLabelText="아이디"
                            />
                            <TextField
                                style={{width: 300, marginTop: -10}}
                                onChange={this.onPwChange.bind(this)}
                                hintText="패스워드를 입력해주세요"
                                floatingLabelText="패스워드"
                                type="password"
                            />
                            <RaisedButton
                                onTouchTap={this.onLogin.bind(this)}
                                style={{width: 300, marginTop: 10}}
                                label="로그인 / 회원가입"/>

                            <FacebookLogin
                                appId="1922219037991500"
                                autoLoad={true}
                                fields="name,email,picture"
                                cssClass="facebook-login"
                                textButton="페이스북으로 로그인"
                                callback={this.responseFacebook.bind(this)}
                            />
                        </CardActions>
                    </Card>
                </div>
            </div>
        );
    }
}
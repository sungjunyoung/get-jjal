// src/components/App/index.js
import React, {Component} from 'react';
import AlertContainer from 'react-alert'

import './style.css';

import Header from '../Header';
import CurrentJjals from '../CurrentJjals';
import MyJjals from "../MyJjals";
import ResgisterJjal from '../RegisterJjal'
import PopularJjals from "../PopularJjals/index";
import {TextField} from "material-ui";
import FoundJjals from "../FoundJjals/index";
import WhoMake from "../WhoMake/index";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userId: sessionStorage.getItem('userId'),
            menuName: sessionStorage.getItem('menuName'),
            userInfo: {},
            onFind: false
        };
    }

    alertOptions = {
        offset: 14,
        position: 'bottom left',
        theme: 'light',
        time: 5000,
        transition: 'scale'
    };


    showAlert(type, message) {
        this.msg.show(message, {
            time: 2000,
            type: type,
        })
    }

    componentDidMount() {
        // 정상접근 안할때
        if (!sessionStorage.getItem('userId')) {
            this.showAlert('error', '로그인해주세요!');
            this.props.history.push('/auth');
        }

        let component = this;
        fetch('/users/' + this.state.userId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((response) => response.json())
            .then((response) => {
                component.setState({userInfo: response});
            });
    }

    selectView() {
        switch (this.state.menuName) {
            case "최근 짤방":
                return (<CurrentJjals/>);
                break;
            case "내 짤방":
                return (<MyJjals/>);
                break;
            case "짤방 등록":
                return (<ResgisterJjal/>);
                break;
            case "인기 짤방":
                return (<PopularJjals/>);
                break;
            case "짤방 검색":
                return (<FoundJjals/>);
                break;
            case "만든이":
                return (<WhoMake/>);
                break;
        }
    }

    onMenuChange(menuName) {
        sessionStorage.setItem('menuName', menuName);
        this.setState({menuName: menuName});
    }

    onClickFind() {
        let onFind = this.state.onFind;
        onFind = !onFind;
        this.setState({onFind: onFind});
        if (onFind === true) {
            this.setState({menuName: '짤방 검색'})
        } else {
            this.setState({menuName: sessionStorage.getItem('menuName')})
        }

    }
    onClickLogo(){
        sessionStorage.setItem('menuName', "내 짤방");
        this.setState({menuName: "내 짤방"});
    }

    render() {


        return (
            <div className="App">
                <AlertContainer ref={a => this.msg = a}{...this.alertOptions}/>
                <Header onClickLogo={this.onClickLogo.bind(this)}
                        onClickFind={this.onClickFind.bind(this)}
                        menuName={this.state.menuName}
                        username={this.state.userInfo.username}
                        history={this.props.history}
                        onMenuChange={this.onMenuChange.bind(this)}/>

                {this.selectView()}
            </div>
        );
    }
}

export default App;
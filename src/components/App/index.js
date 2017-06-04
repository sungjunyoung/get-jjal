// src/components/App/index.js
import React, {Component} from 'react';
import AlertContainer from 'react-alert'

import './style.css';

import Header from '../Header';
import CurrentJjals from '../CurrentJjals';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userId: sessionStorage.getItem('userId'),
            menuName: '내 짤방',
            userInfo: {},
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

    selectView(){
        switch(this.state.menuName){
            case "최근 짤방":
                return (<CurrentJjals/>);
                break;
            default:
                return(<div/>);
                break;
        }
    }

    onMenuChange(menuName){
        this.setState({menuName: menuName});
        sessionStorage.setItem('menuName', menuName);
    }

    render() {
        console.log(this.state.userInfo);

        return (
            <div className="App">
                <AlertContainer ref={a => this.msg = a}{...this.alertOptions}/>
                <Header menuName={this.state.menuName}
                        username={this.state.userInfo.username}
                        history={this.props.history}
                        onMenuChange={this.onMenuChange.bind(this)}/>
                {this.selectView()}
            </div>
        );
    }
}

export default App;
import React, {Component} from 'react';

import './style.css';

export default class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuHeight: 0,
            menuWidth: 0,
            username: ''
        }
    }

    componentDidMount() {
        let {clientHeight, clientWidth} = this.refs.menu;
        this.setState({menuHeight: clientHeight, menuWidth: clientWidth});

    }

    logout(){
        sessionStorage.clear();
        localStorage.clear();
        this.props.history.push('/auth');
    }

    onMenuClick(menuName){
        this.props.closeMenu();
        this.props.onMenuChange(menuName);
    }

    render() {
        return (
            <div className="Menu"
                 style={{
                     position: 'fixed', width: '100%', height: '100%', top: 0,
                     backgroundColor: 'black', opacity: 0.95, zIndex: 998
                 }}>


                <div ref="menu" style={{
                    position: 'fixed', width: '100%', top: '50%',
                    marginTop: -this.state.menuHeight/2, color: 'white', textAlign: 'center'
                }}>
                    <div className="menu_h">메뉴</div>
                    <br/>
                    <div onClick={() => this.onMenuClick("내 짤방")} className="menu_m">내 짤방</div>
                    <div onClick={() => this.onMenuClick("인기 짤방")} className="menu_m">인기 짤방</div>
                    <div onClick={() => this.onMenuClick("최근 짤방")} className="menu_m">최근 짤방</div>
                    <div onClick={() => this.onMenuClick("짤방 등록")} className="menu_m">짤방 등록</div>
                    <div onClick={() => this.onMenuClick("만든이")} className="menu_m">만든이</div>
                    <div className="menu_m logout" onClick={this.logout.bind(this)}>로그아웃</div>
                </div>
                <div className="menu_login_info">로그인 : {this.props.username}</div>
            </div>
        );
    }
}
import React, {Component} from 'react';
import Menu from '../Menu'

import './style.css';

export default class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            onHambug: false
        }
    }

    onHambugClick() {
        this.state.onHambug ?
            this.setState({onHambug: false}) : this.setState({onHambug: true});
    }

    closeMenu(){
        this.setState({onHambug: false});
    }

    render() {
        return (
            <div className="Header" style={{
                position: 'fixed', height: 60, width: '100%',
                opacity: 0.93, top: 0, left: 0,
                textAlign: 'left',
                backgroundColor:'white'
            }}>
                <div className="logo" style={{
                    fontSize: 30, margin: '12px 0 0 20px'
                }}>
                    겟짤
                    <span style={{
                        fontSize: 15, margin: '0 0 0 10px',
                    }}>_ {this.props.menuName}</span>
                </div>
                <div className="hambug_button"
                     style={{
                         position: 'fixed', height: 30, width: 30,
                         right: 0, top: 0, margin: '12px 12px 0 0', zIndex: 999
                     }}>
                    <img onClick={this.onHambugClick.bind(this)}
                         alt="hambug"
                         src={this.state.onHambug ?
                             "/images/close_button.png" : "/images/hambug_button.png"}
                         style={{maxWidth: '100%', maxHeight: '100%'}}/>
                </div>

                {this.state.onHambug ?
                    <Menu username={this.props.username}
                          history={this.props.history}
                          onMenuChange={this.props.onMenuChange}
                          closeMenu={this.closeMenu.bind(this)}
                    /> : null}
            </div>
        );
    }
}
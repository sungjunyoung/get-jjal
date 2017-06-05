import React, {Component} from 'react';
import Menu from '../Menu'
import CloseButton from 'material-ui/svg-icons/navigation/close'
import HambugButton from 'material-ui/svg-icons/image/dehaze'

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

    closeMenu() {
        this.setState({onHambug: false});
    }

    render() {
        return (
            <div className="Header" style={{
                position: 'fixed', height: 80, width: '100%',
                opacity: 0.93, top: 0, left: 0,
                textAlign: 'left', zIndex: 999,
                backgroundColor: 'white'
            }}>
                <div className="logo" style={{
                    fontSize: 50, margin: '12px 0 0 20px'
                }}>
                    겟짤
                    <span style={{
                        fontSize: 20, margin: '0 0 0 10px',
                    }}>_ {this.props.menuName}</span>
                </div>
                <div className="hambug_button"
                     style={{
                         position: 'fixed', height: 40, width: 40,
                         right: 0, top: 0, margin: '20px 20px 0 0', zIndex: 999,
                         cursor: 'pointer'
                     }}>

                    {this.state.onHambug ?
                        <CloseButton color="white"
                                     onClick={this.onHambugClick.bind(this)}
                                     style={{
                                         width: 40, height: 40, float: 'right'
                                     }}/> :
                        <HambugButton color="black"
                                     onClick={this.onHambugClick.bind(this)}
                                     style={{
                                         width: 40, height: 40, float: 'right'
                                     }}/>}

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
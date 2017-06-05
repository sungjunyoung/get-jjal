import React, {Component} from 'react';

import './style.css';
import {WindowResizeListener} from "react-window-resize-listener";

export default class JjalDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            windowWidth: '0',
            windowHeight: '0',
        }
    }

    onCloseDetail() {

    }

    render() {
        return (
            <div className="JjalDetail"
                 style={{
                     position: 'fixed', top: 0, left: 0,
                     width: '100%', height: '100%', backgroundColor: 'black',
                     zIndex: 999
                 }}>
                <WindowResizeListener onResize={windowSize => {
                    this.setState({
                        windowWidth: windowSize.windowWidth,
                        windowHeight: windowSize.windowHeight
                    });
                }}/>

                <div style={{
                    color: 'black', position: 'fixed',
                    top: 0, left: 0, width: '100%', height: 40,
                    textAlign: 'right'
                }}>
                    <div style={{width: 40, height: 40}}>
                        <img onClick={this.onCloseDetail.bind(this)}
                             alt="hambug"
                             src={this.state.onHambug ?
                                 "/images/close_button.png" : "/images/hambug_button.png"}
                             style={{maxWidth: '100%', maxHeight: '100%'}}/>
                    </div>
                </div>


                <div style={Object.assign(
                    {
                        background: 'url(' + this.props.jjal.src + ') no-repeat center center fixed',
                        height: this.state.windowHeight - 120
                    }, {
                        backgroundSize: 'contain', width: '100%', position: 'fixed', top: 40, left: 0
                    })}/>

                <div style={{
                    color: 'black', position: 'fixed', bottom: 0, left: 0,
                    width: '100%', height: 80
                }}>
                    JjalDetail
                </div>
            </div>
        );
    }
}
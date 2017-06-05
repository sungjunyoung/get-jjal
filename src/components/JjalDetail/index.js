import React, {Component} from 'react';

import './style.css';
import {WindowResizeListener} from "react-window-resize-listener";
import CloseButton from 'material-ui/svg-icons/navigation/close'

export default class JjalDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            windowWidth: '0',
            windowHeight: '0',
        }
    }

    onCloseDetail() {
        this.props.onCloseDetail();
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
                    top: 0, left: 0, width: '100%', height: 80,
                    textAlign: 'right'
                }}>
                    <CloseButton color="white"
                                 onClick={this.onCloseDetail.bind(this)}
                                 style={{
                                     marginTop: 20, marginRight: 20,
                                     width: 40, height: 40, float: 'right'
                                 }}/>
                </div>


                <div style={Object.assign(
                    {
                        background: 'url(' + this.props.jjal.src + ') no-repeat center center',
                        height: this.state.windowHeight - 200
                    }, {
                        backgroundSize: 'contain', width: '100%', position: 'fixed', top: 80, left: 0
                    })}/>

                <div style={{
                    color: 'black', position: 'fixed', bottom: 0, left: 0,
                    width: '100%', height: 120
                }}>
                    JjalDetail
                </div>
            </div>
        );
    }
}
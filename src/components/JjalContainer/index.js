import React, {Component} from 'react';
import {WindowResizeListener} from 'react-window-resize-listener'

import './style.css';

export default class JjalContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            windowWidth: '0',
            windowHeight: '0'
        };
    }

    render() {
        var containerWidth;
        if(this.state.windowWidth > 1200){
            containerWidth = this.state.windowWidth / 5 - 10;
        } else if(this.state.windowWidth > 900){
            containerWidth = this.state.windowWidth / 4 - 10;
        } else if(this.state.windowWidth > 400){
            containerWidth = this.state.windowWidth / 3 - 10;
        }

        return (
            <div className="JjalContainer"
                 style={{
                     display: 'inline-block',
                     width: containerWidth,
                     height: containerWidth + 30

                 }}>
                <WindowResizeListener onResize={windowSize => {
                    this.setState({
                        windowWidth: windowSize.windowWidth,
                        windowHeight: windowSize.windowHeight
                    });
                }}/>
                <div className="image" style={{maxWidth: '100%'}}>
                    <img src={this.props.jjal.src} style={{
                        maxWidth: '100%', maxHeight: '100%'
                    }}/>
                </div>
            </div>
        );
    }
}
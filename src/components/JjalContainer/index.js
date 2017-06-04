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
        if (this.state.windowWidth > 1200) {
            containerWidth = this.state.windowWidth / 5 - 51;
        } else if (this.state.windowWidth > 900) {
            containerWidth = this.state.windowWidth / 4 - 41;
        } else if (this.state.windowWidth > 600) {
            containerWidth = this.state.windowWidth / 3 - 31;
        } else {
            containerWidth = this.state.windowWidth / 2 - 21;
        }

        return (
            <div className="JjalContainer"
                 style={{
                     display: 'inline-block',
                     width: containerWidth,
                     margin: 5,
                     height: containerWidth + 80,
                 }}>
                <WindowResizeListener onResize={windowSize => {
                    this.setState({
                        windowWidth: windowSize.windowWidth,
                        windowHeight: windowSize.windowHeight
                    });
                }}/>
                <div className="imageWrapper" style={{position: 'relative'}}>
                    <img src={this.props.jjal.src} height={containerWidth}/>
                    <div style={Object.assign({width: containerWidth - 12}, {
                        position: 'absolute',
                        bottom: 0, right: 0,
                        height: 20,
                        backgroundColor: 'black',
                        opacity: 0.8, color: 'white',
                        padding: 6, textAlign: 'right'
                    })}>
                        {this.props.jjal.own_user_id}
                    </div>
                </div>
                <div className="imageDesc">

                </div>
            </div>
        );
    }
}
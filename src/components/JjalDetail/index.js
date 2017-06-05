import React, {Component} from 'react';

import './style.css';
import {WindowResizeListener} from "react-window-resize-listener";
import CloseButton from 'material-ui/svg-icons/navigation/close'
import TagComponent from "../TagComponent/index";
import StarBorder from 'material-ui/svg-icons/toggle/star-border'
import Star from 'material-ui/svg-icons/toggle/star'

export default class JjalDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            windowWidth: '0',
            windowHeight: '0',
            userInfo: {},
            isLike: false
        }
    }

    componentDidMount() {
        var component = this;
        // 좋아요 여부
        fetch('/users/' + sessionStorage.getItem('userId') +
            '/jjals/' + this.props.jjal.id + '/like', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((response) => response.json())
            .then((response) => {
                if (response.result)
                    component.setState({isLike: true})
            })
            .catch((err) => {
                console.log(err);
            });

        fetch('/users/' + this.props.jjal.own_user_id,
            {
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

    onCloseDetail() {
        this.props.onCloseDetail();
    }

    renderJjal(tags) {
        return tags.map((tag) => {
            return <TagComponent tag={tag} listView={true}/>
        })
    }

    onLike() {
        var container = this;
        fetch('/users/' + sessionStorage.getItem('userId') +
            '/jjals/' + this.props.jjal.id + '/like?flag=' + !this.state.isLike, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: sessionStorage.getItem('userId'),
                jjal_id: this.props.jjal.id
            })
        }).then((response) => response.json())
            .then((response) => {
                container.setState({isLike: !container.state.isLike})
            })
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        console.log(this.state.userInfo);
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

                <div style={Object.assign({width: this.state.windowWidth - 40}, {
                    color: 'black', position: 'fixed',
                    top: 0, left: 0, height: 80,
                    textAlign: 'right', padding: 20
                })}>
                    {this.renderJjal(this.props.tags)}
                    <CloseButton color="white"
                                 onClick={this.onCloseDetail.bind(this)}
                                 style={{
                                     width: 40, height: 40, float: 'right'
                                 }}/>
                </div>


                <div style={Object.assign(
                    {
                        background: 'url(' + this.props.jjal.src + ') no-repeat center center',
                        height: this.state.windowHeight - 240
                    }, {
                        backgroundSize: 'contain', width: '100%', position: 'fixed', top: 80, left: 0
                    })}/>

                <div style={Object.assign({width: this.state.windowWidth - 40}, {
                    color: 'black', position: 'fixed', bottom: 0, left: 0,
                    height: 140, padding: '10px 20px 10px 20px'
                })}>
                    <h3 className="userInfo">{this.state.userInfo.username}
                        <span className="userInfo desc"> 님이 공유한 짤방</span></h3>
                    <div style={{
                        position: 'absolute', bottom: 20,
                        right: 20, width: 100, height: 40, backgroundColor: 'red'
                    }}>
                        {this.state.isLike ?
                            <Star color="white" onClick={this.onLike.bind(this)} style={{
                                width: 40, height: 40,
                                float: 'left'
                            }}/>
                            :
                            <StarBorder color="white" onClick={this.onLike.bind(this)} style={{
                                width: 40, height: 40,
                                float: 'left'
                            }}/>
                        }
                    </div>
                </div>
            </div>
        );
    }
}
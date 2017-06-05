import React, {Component} from 'react';
import {WindowResizeListener} from 'react-window-resize-listener'
import StarBorder from 'material-ui/svg-icons/toggle/star-border'
import Star from 'material-ui/svg-icons/toggle/star'
import './style.css';
import JjalDetail from '../JjalDetail';
import TagComponent from "../TagComponent/index";

export default class JjalContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            windowWidth: '0',
            windowHeight: '0',
            username: '',
            isLike: false,
            isDetail: false,
            tags: []
        };
    }

    componentDidMount() {
        // 유저에 대한 정보들
        fetch('/users/' + this.props.jjal.own_user_id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((response) => response.json())
            .then((response) => {
                this.setState({username: response.username});
            });

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
                    this.setState({isLike: true})
            })
            .catch((err) => {
                console.log(err);
            });

        //짤방에 대한 태그
        fetch('/jjals/' + this.props.jjal.id + '/tags', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((response) => response.json())
            .then((response) => {
                this.setState({tags: response.tags});
            });
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

    onImageClick() {
        this.setState({isDetail: true});
    }

    onCloseDetail() {
        this.setState({isDetail: false});
    }

    renderTags(tags) {
        return tags.map((tag) => {
            return <TagComponent listView={true} tag={tag}/>
        })
    }

    render() {

        var containerWidth;
        if (this.state.windowWidth > 1200) {
            containerWidth = this.state.windowWidth / 5 - 21;
        } else if (this.state.windowWidth > 900) {
            containerWidth = this.state.windowWidth / 4 - 21;
        } else if (this.state.windowWidth > 800) {
            containerWidth = this.state.windowWidth / 3 - 21;
        } else if (this.state.windowWidth > 400) {
            containerWidth = this.state.windowWidth / 2 - 21;
        } else {
            containerWidth = this.state.windowWidth - 11;
        }

        return (
            <div className="JjalContainer"
                 style={{
                     display: 'inline-block',
                     width: containerWidth,
                     margin: 5,
                     height: containerWidth + 80,
                 }}>
                {this.state.isDetail ?
                    <JjalDetail tags={this.state.tags} jjal={this.props.jjal} onCloseDetail={this.onCloseDetail.bind(this)}/> : null}


                <WindowResizeListener onResize={windowSize => {
                    this.setState({
                        windowWidth: windowSize.windowWidth,
                        windowHeight: windowSize.windowHeight
                    });
                }}/>


                <div className="imageWrapper" style={{position: 'relative', overflow: 'auto'}}>
                    <img src={this.props.jjal.src} height={containerWidth}
                         onClick={this.onImageClick.bind(this)}
                         style={{
                             marginLeft: '50%',
                             transform: 'translateX(-50%)'
                         }}/>

                    <div style={Object.assign({width: containerWidth - 12}, {
                        position: 'absolute',
                        bottom: 0, right: 0,
                        height: 30,
                        backgroundColor: 'black',
                        opacity: 0.8, color: 'white',
                        padding: 6
                    })}>
                        <div onClick={this.onLike.bind(this)} style={{
                            height: 29,
                            width: '40%', textAlign: 'left',
                            float: 'left'
                        }}>
                            {this.state.isLike ?
                                <Star color="white"/> : <StarBorder color="white"/>}

                        </div>
                        <div style={{
                            height: 29,
                            paddingTop: 5,
                            width: '60%', textAlign: 'right',
                            float: 'left'
                        }}>
                            {this.state.username}
                        </div>

                    </div>
                </div>
                <div className="imageDesc" style={{height: 80}}>
                    {this.renderTags(this.state.tags)}
                </div>
            </div>
        );
    }
}
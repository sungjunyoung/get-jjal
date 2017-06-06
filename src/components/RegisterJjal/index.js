import React, {Component} from 'react';

import './style.css';
import {RaisedButton} from "material-ui";
import UploadButton from "material-ui/svg-icons/action/backup"
import ByURLButton from "material-ui/svg-icons/action/find-in-page"
import TextField from 'material-ui/TextField';
import TagComponent from '../TagComponent';

import AlertContainer from 'react-alert'

export default class RegisterJjal extends Component {

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


    constructor(props) {
        super(props);
        this.state = {
            isSelectType: false,
            selectType: '',
            jjalSrc: '',
            isUrlRegisterDisabled: true,
            isImageNotExist: false,
            isTagView: false,
            tagTextFieldValue: '',
            jjalWidth: 0,
            jjalHeight: 0,
            tags: []
        }
    }

    onSelect(registerType) {
        this.setState({isSelectType: true, selectType: registerType});
    }

    onUrlChange(e) {
        var imageSrc = e.target.value;
        var image = new Image();
        image.src = imageSrc;
        image.onload = function () {
            this.setState({
                jjalSrc: imageSrc, isUrlRegisterDisabled: false,
                jjalWidth: image.width,
                jjalHeight: image.height,
            })
        }.bind(this);
        image.onerror = function () {
            this.setState({jjalSrc: '', isUrlRegisterDisabled: true})
        }.bind(this);
    }

    registerJjal() {
        if (this.state.tags.length === 0) {
            this.showAlert('error', '태그를 하나이상 달아주세요!');
            return;
        }

        let jjalObj = {};
        jjalObj.own_user_id = localStorage.userId;
        jjalObj.src = this.state.jjalSrc;
        jjalObj.width = this.state.jjalWidth;
        jjalObj.height = this.state.jjalHeight;
        jjalObj.tags = this.state.tags;

        const component = this;
        fetch('/jjals', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jjalObj)
        }).then((response) => response.json())
            .then((response) => {
                if (response.code === 'SUCCESS') {
                    component.setState({
                        isSelectType: false, jjalSrc: '',
                        selectType: '', tags: [], tagTextFieldValue: '',
                        isImageNotExist: false,
                    });
                    component.showAlert('success', '짤방을 등록했어요!');
                }
            });

    }

    renderByType(registerType) {

        if (registerType === 'file') {
            // 파일 업로드일때
            return (<div style={{
                position: 'fixed', top: '50%', left: '50%',
                width: 360, height: 600,
                marginTop: -100, marginLeft: -150
            }}>

            </div>)
        } else {
            // URL 업로드일때
            return (<div style={{
                position: 'fixed', top: '50%', left: '50%',
                width: 360, height: 300,
                marginTop: -150, marginLeft: -180
            }}>

                {/*이미지*/}
                {this.state.jjalSrc === '' ? null :
                    <div style={Object.assign(
                        {
                            background: 'url(' + this.state.jjalSrc + ') no-repeat center center',
                            height: 200
                        }, {
                            backgroundSize: 'contain', width: 360, marginBottom: 5
                        })}/>}

                {this.state.isTagView ?
                    <div>
                        <div>
                            {this.renderTags(this.state.tags)}
                        </div>
                        <TextField
                            onChange={(e) => {
                                this.setState({tagTextFieldValue: e.target.value})
                            }}
                            onKeyPress={this.onTagEnter.bind(this)}
                            value={this.state.tagTextFieldValue}
                            hintText="사진을 구분할 수 있는 태그를 입력해주세요!"
                            fullWidth={true}
                            underlineFocusStyle={{borderColor: 'black'}}
                        />
                        <RaisedButton fullWidth={true} label="완료하기"
                                      onClick={this.registerJjal.bind(this)}
                                      icon={<ByURLButton/>}/>
                    </div>
                    :
                    <div>
                        <TextField
                            onChange={this.onUrlChange.bind(this)}
                            hintText="짤방 이미지의 URL을 붙여넣으세요!"
                            multiLine={true}
                            fullWidth={true}
                            rows={1}
                            rowsMax={3}
                            underlineFocusStyle={{borderColor: 'black'}}
                        />
                        <RaisedButton fullWidth={true} label="태그 작성하기"
                                      onClick={() => this.setState({isTagView: true})}
                                      disabled={this.state.isUrlRegisterDisabled}
                                      icon={<ByURLButton/>}/>
                    </div>
                }

            </div>)
        }
    }

    onTagEnter(event) {
        if (event.key === 'Enter') {
            const tagText = this.state.tagTextFieldValue;
            this.setState({tagTextFieldValue: ''});
            const tagObj = {name: tagText};
            const tags = this.state.tags;

            let alreadyExist = false;
            for (let i in tags) {
                if (tags[i].name === tagObj.name) {
                    alreadyExist = true;
                }
            }
            let limitOver = false;
            if (tagText.length > 5) {
                limitOver = true;
            }

            if (tags.length >= 5) {
                this.showAlert('error', '태그는 다섯개까지만 가능합니다!');
            } else if (alreadyExist) {
                this.showAlert('info', '이미 존재하는 태그입니다.')
            } else if (limitOver) {
                this.showAlert('error', '태그는 5자 이내로 써주세요')
            } else {
                tags.push(tagObj);
                this.setState({tags: tags});
            }
        }
    }

    deleteTag(deleteTag) {
        const currentTags = this.state.tags;
        const filteredTags = currentTags.filter((tag) => {
            return tag.name !== deleteTag.name;
        });

        this.setState({tags: filteredTags});
    }

    renderTags(tags) {
        return tags.map((tag) => {
            return <TagComponent key={tag.name} deleteTag={this.deleteTag.bind(this)} tag={tag}/>
        })
    }

    render() {
        return (
            <div className="RegisterJjal" style={{
                marginTop: 90
            }}>
                <AlertContainer ref={a => this.msg = a}{...this.alertOptions}/>
                {this.state.isSelectType ?
                    this.renderByType(this.state.selectType)
                    :
                    <div className="selectType" style={{
                        position: 'fixed', top: '50%', left: '50%',
                        width: 300, height: 200,
                        marginTop: -100, marginLeft: -150
                    }}>
                        <RaisedButton fullWidth={true} label="파일로 업로드"
                                      style={{marginBottom: 20}}
                                      onClick={() => this.onSelect('file')}
                                      disabled={true}
                                      icon={<UploadButton/>}/>

                        <RaisedButton fullWidth={true} label="URL 로 등록"
                                      onClick={() => this.onSelect('url')}
                                      icon={<ByURLButton/>}/>
                    </div>
                }
            </div>
        );
    }
}
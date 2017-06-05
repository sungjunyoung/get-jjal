import React, {Component} from 'react';

import './style.css';
import {RaisedButton} from "material-ui";
import UploadButton from "material-ui/svg-icons/action/backup"
import ByURLButton from "material-ui/svg-icons/action/find-in-page"
import TextField from 'material-ui/TextField';

export default class RegisterJjal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSelectType: false,
            selectType: '',
            jjalSrc: ''
        }
    }

    onSelect(registerType) {
        this.setState({isSelectType: true, selectType: registerType});
    }

    onUrlChange(e){
        if((/\.(gif|jpg|jpeg|tiff|png)$/i).test(e.target.value)){
            this.setState({jjalSrc: e.target.value})
        } else if(e.target.value === ''){
            this.setState({jjalSrc: ''})
        } else {
            this.setState({jjalSrc: ''})
        }
    }

    renderByType(registerType) {
        if (registerType === 'file') {
            return (<div style={{
                position: 'fixed', top: '50%', left: '50%',
                width: 360, height: 600,
                marginTop: -100, marginLeft: -150
            }}>

            </div>)
        } else {
            return (<div style={{
                position: 'fixed', top: '50%', left: '50%',
                width: 360, height: 300,
                marginTop: -150, marginLeft: -180
            }}>

                {this.state.jjalSrc === '' ? null :
                    <div style={Object.assign(
                        {
                            background: 'url(' + this.state.jjalSrc + ') no-repeat center center',
                            height: 200
                        }, {
                            backgroundSize: 'contain', width: 360, marginBottom: 5
                        })}/>}

                <TextField
                    onChange={this.onUrlChange.bind(this)}
                    hintText="짤방 이미지의 URL을 붙여넣으세요! "
                    multiLine={true}
                    fullWidth={true}
                    rows={1}
                    rowsMax={3}
                    underlineFocusStyle={{borderColor: 'black'}}
                />
            </div>)
        }
    }

    render() {
        return (
            <div className="RegisterJjal" style={{
                marginTop: 90
            }}>
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
import React, {Component} from 'react';
import JjalContaier from '../JjalContainer';
import './style.css';
import {TextField} from "material-ui";

export default class FoundJjals extends Component {

    constructor(props) {
        super(props);
        this.state = {
            jjals: [],
            page: 1,
            findText: '',
            findHintText:'태그로 짤방을 검색해보세요!'
        }
    }

    handleScroll() {
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        const windowBottom = windowHeight + window.pageYOffset;

        // console.log('windowBottom : ' + windowBottom);
        // console.log('docHeight : ' + docHeight);
        if (windowBottom + 1 >= docHeight) {
            this.loadMore();
        }
    }

    loadMore() {
        var jjals = this.state.jjals;
        var component = this;

        var nextPage = this.state.page + 1;
        fetch('/jjals/tags?tagName=' + this.state.findText + '&page=' + nextPage, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((response) => response.json())
            .then((response) => {
                var moreJjals = response.jjals;
                component.setState({jjals: jjals.concat(moreJjals)});
            });
    }

    componentDidMount() {
        window.addEventListener("scroll", this.handleScroll.bind(this));

        const component = this;
        fetch('/jjals/tags?tagName=' + this.state.findText + '&page=1', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((response) => response.json())
            .then((response) => {
                var jjals = response.jjals;
                component.setState({jjals: jjals});
            });
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll.bind(this));
    }

    onFindTextChange(e) {
        if(e.target.value === ''){
            this.setState({findHintText: '태그로 짤방을 검색해보세요!'})
        } else {
            this.setState({findHintText: ''})
        }


        const findText = e.target.value;
        this.setState({findText: e.target.value});
        const component = this;
        fetch('/jjals/tags?tagName=' + findText + '&page=1', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((response) => response.json())
            .then((response) => {
                var jjals = response.jjals;
                component.setState({jjals: jjals});
            });
    }


    loadJjals(jjals) {
        return jjals.map((jjal) => {
            return <JjalContaier jjal={jjal}/>
        })
    }

    render() {
        return (
            <div className="FoundJjals" style={{
                marginTop: 150
            }}>
                <div style={{
                    position: 'fixed', top: 80, left: 0, width: '92%',
                    height: 40, padding: '0 4% 0 4%'
                }}>
                    <TextField
                        onChange={this.onFindTextChange.bind(this)}
                        value={this.state.tagTextFieldValue}
                        hintText={this.state.findHintText}
                        fullWidth={true}
                        underlineFocusStyle={{borderColor: 'black'}}
                    />
                </div>

                {this.loadJjals(this.state.jjals)}

            </div>
        );
    }
}
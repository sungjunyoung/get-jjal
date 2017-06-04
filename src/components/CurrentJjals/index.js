import React, {Component} from 'react';
import JjalContaier from '../JjalContainer';
import './style.css';

export default class CurrentJjals extends Component {

    constructor(props) {
        super(props);
        this.state = {
            jjals: [],
            page: 1
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

        console.log(this.state.page);
        var nextPage = this.state.page + 1;
        fetch('/jjals?page=' + nextPage, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((response) => response.json())
            .then((response) => {
                var moreJjals = response.jjals;
                component.setState({
                    page: component.state.page + 1,
                    jjals: jjals.concat(moreJjals)
                });
            });
    }

    componentDidMount() {
        window.addEventListener("scroll", this.handleScroll.bind(this));

        const component = this;
        fetch('/jjals?page=1', {
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


    loadJjals(jjals) {
        return jjals.map((jjal) => {
            return <JjalContaier jjal={jjal}/>
        })
    }

    render() {
        return (
            <div className="CurrentJjals" style={{
                marginTop: 60
            }}>
                {this.loadJjals(this.state.jjals)}

            </div>
        );
    }
}
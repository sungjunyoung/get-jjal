import React, {Component} from 'react';
import JjalContaier from '../JjalContainer';
import './style.css';

export default class MyJjals extends Component {

    constructor(props) {
        super(props);
        this.state = {
            likeJjals: [],
            usersJjals: [],
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
        var likeJjals = this.state.likeJjals;
        var usersJjals = this.state.usersJjals;

        var component = this;

        var nextPage = this.state.page + 1;
        fetch('/users/' + sessionStorage.userId + '/jjals/like?page=' + nextPage, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((response) => response.json())
            .then((response) => {
                let moreLikeJjals = response.likeJjals;
                component.setState({
                    likeJjals: likeJjals.concat(moreLikeJjals),
                    page: nextPage
                });
            });

        fetch('/jjals/users/' + sessionStorage.userId + '?page=' + nextPage, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((response) => response.json())
            .then((response) => {
                let moreUsersJjals = response.userJjals;
                component.setState({
                    usersJjals: usersJjals.concat(moreUsersJjals),
                    page: nextPage
                });
            });
    }

    componentDidMount() {
        window.addEventListener("scroll", this.handleScroll.bind(this));
        const component = this;
        fetch('/users/' + sessionStorage.userId + '/jjals/like?page=1', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((response) => response.json())
            .then((response) => {
                let likeJjals = response.likeJjals;
                component.setState({likeJjals: likeJjals});
            });

        fetch('/jjals/users/' + sessionStorage.userId + '?page=1', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((response) => response.json())
            .then((response) => {
                let usersJjals = response.userJjals;
                component.setState({usersJjals: usersJjals});
            });
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll.bind(this));
    }

    loadJjals(likeJjals) {
        return likeJjals.map((likeJjal) => {
            return <JjalContaier jjal={likeJjal}/>
        })
    }

    arrayUnique(array) {
        var a = array.concat();
        for (var i = 0; i < a.length; ++i) {
            for (var j = i + 1; j < a.length; ++j) {
                if (a[i].id === a[j].id)
                    a.splice(j--, 1);
            }
        }

        return a;
    }


    render() {
        let myJjals = this.arrayUnique(this.state.likeJjals.concat(this.state.usersJjals));

        return (
            <div className="MyJjals" style={{
                marginTop: 90
            }}>

                {this.loadJjals(myJjals)}
            </div>
        );
    }
}
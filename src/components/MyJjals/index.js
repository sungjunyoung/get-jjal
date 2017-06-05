import React, {Component} from 'react';
import JjalContaier from '../JjalContainer';
import './style.css';

export default class MyJjals extends Component {

    constructor(props) {
        super(props);
        this.state = {
            likeJjals: []
        }
    }

    componentDidMount() {
        const component = this;
        fetch('/users/' + sessionStorage.userId + '/jjals/like', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((response) => response.json())
            .then((response) => {
                var likeJjals = response.likeJjals;
                component.setState({likeJjals: likeJjals});
            });
    }

    loadJjals(likeJjals) {
        return likeJjals.map((likeJjal) => {
            return <JjalContaier jjal={likeJjal}/>
        })
    }

    render() {
        console.log(this.state.likeJjals);
        return (
            <div className="MyJjals" style={{
                marginTop: 90
            }}>
                {this.loadJjals(this.state.likeJjals)}
                {/*<div>내가 올린 짤방</div>*/}
                {/*{this.loadJjals(this.state.likeJjals)}*/}
            </div>
        );
    }
}
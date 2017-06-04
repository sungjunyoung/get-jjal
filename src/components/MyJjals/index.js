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
        // fetch('/jjals?page=1', {
        //     method: 'GET',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //     }
        // }).then((response) => response.json())
        //     .then((response) => {
        //         var likeJjals = response.likeJjals;
        //         component.setState({likeJjals: jjals});
        //     });
    }

    loadJjals(jjals) {
        return jjals.map((jjal) => {
            return <JjalContaier jjal={jjal}/>
        })
    }

    render() {
        return (
            <div className="MyJjals" style={{
                marginTop: 60
            }}>
                <div>좋아한 짤방</div>
                {this.loadJjals(this.state.jjals)}
                <div>내가 올린 짤방</div>
                {this.loadJjals(this.state.jjals)}
            </div>
        );
    }
}
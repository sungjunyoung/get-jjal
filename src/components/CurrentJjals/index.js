import React, {Component} from 'react';
import JjalContaier from '../JjalContainer';
import './style.css';

export default class CurrentJjals extends Component {

    constructor(props) {
        super(props);
        this.state = {
            jjals: []
        }
    }

    componentDidMount() {
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
                <div>CurrentJjals</div>

                {this.loadJjals(this.state.jjals)}

            </div>
        );
    }
}
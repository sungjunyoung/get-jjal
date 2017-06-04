// src/components/App/index.js
import React, {Component} from 'react';

import './style.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: localStorage.getItem('userId')
        };
        if(!localStorage.getItem('userId')){
            console.log('로그인해주세요!');
            this.props.history.push('/auth');
        }
    }

    render() {

        return (
            <div className="App">
                메인페이지 하잉
            </div>
        );
    }
}

export default App;
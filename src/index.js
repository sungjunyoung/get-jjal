import React from 'react';
import ReactDOM from 'react-dom';
import createBroswerHistory from 'history/createBrowserHistory'
import './index.css';
import {Router, Route, Switch} from 'react-router';

import App from './components/App';
import About from './components/About';
import NotFound from './components/NotFound';

const browserHistory = createBroswerHistory();


ReactDOM.render((
        <Router history={browserHistory}>
            <Switch>
                <Route path="/" exact component={App}/>
                <Route path="/about" component={About}/>
                <Route path="*" component={NotFound}/>
            </Switch>
        </Router>),
    document.getElementById('root')
);
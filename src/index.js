import React from 'react';
import ReactDOM from 'react-dom';
import createBroswerHistory from 'history/createBrowserHistory'
import './index.css';
import {Router, Route, Switch} from 'react-router';

import App from './components/App';
import About from './components/About';
import NotFound from './components/NotFound';
import Auth from './components/Auth';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const browserHistory = createBroswerHistory();

injectTapEventPlugin();

ReactDOM.render((
        <MuiThemeProvider>
            <Router history={browserHistory}>
                <Switch>
                    <Route path="/" exact component={App}/>
                    <Route path="/about" component={About}/>
                    <Route path="/auth" component={Auth}/>
                    <Route path="*" component={NotFound}/>
                </Switch>
            </Router>
        </MuiThemeProvider>),
    document.getElementById('root')
);
/**
 * Created by junyoung on 2017. 6. 2..
 */
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();

// APIs
const users = require('../apis/users');
const jjals = require('../apis/jjals');
const browser = require('detect-browser');
console.log(browser);

// API Routing
app.use('/users', users);
app.use('/jjals', jjals);

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

module.exports = app;

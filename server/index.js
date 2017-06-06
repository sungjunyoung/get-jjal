/**
 * Created by junyoung on 2017. 6. 2..
 */
'use strict';

const app = require('./app');

const PORT = process.env.PORT || 3000;


const browser = require('detect-browser');
app.listen(PORT, () => {
    console.log(browser);
    console.log(`App listening on port ${PORT}!`);
});
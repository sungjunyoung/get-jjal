/**
 * Created by junyoung on 2017. 6. 2..
 */

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const moment = require('moment');

const mysql = require('mysql');
const mysqlConfig = require('../config/mysql.json');
const connection = mysql.createConnection(mysqlConfig);

// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({extended: false}));

// parse application/json
router.use(bodyParser.json());


// 유저 관련 API

// uri : GET /users/:userId
router.get('/:userId', function (req, res, next) {
    // 여기에 쿼리날려서 유저검색 후 반환
    res.send({userId: req.param("userId")})
});

// 유저 등록
router.post('/', function (req, res, next) {
    var userInfo = {};

    // 페이스북 로그인일때
    if (req.body.loginType === 'facebook') {
        userInfo.username = req.body.name;
        userInfo.profile_url = req.body.picture.data.url;
        userInfo.password = req.body.accessToken;
        userInfo.created_at = moment().format('YYYY-MM-DD HH:mm:ss');
        userInfo.login_type = req.body.loginType;

        // TODO 디비 중복체크
        connection.query('INSERT INTO gj_users SET ?', userInfo, function (err, rows) {
            if (err) {
                res.status(500);
                res.send(err);
            } else {
                res.status(201);
                res.send('유저 생성 완료');
            }

        })
    } else {
        res.status(500).send('미구현');
    }

});

module.exports = router;
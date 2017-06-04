/**
 * Created by junyoung on 2017. 6. 2..
 */

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const moment = require('moment');

const mysql = require('mysql-promise')();
const mysqlConfig = require('../config/mysql.json');
mysql.configure(mysqlConfig);

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
        userInfo.fb_id = req.body.id;
        userInfo.created_at = moment().format('YYYY-MM-DD HH:mm:ss');
        userInfo.login_type = req.body.loginType;

        // 디비 확인 후 해다 유저가 이미 있으면 UPDATE, 없으면 INSERT
        mysql.query('SELECT * FROM gj_users WHERE ' +
            'login_type = \'' + userInfo.login_type + '\' AND ' +
            'fb_id = \'' + userInfo.fb_id + '\'')
            .spread(function (rows) {
                if (rows.length > 0) {
                    // 유저가 이미 로그인했다면
                    return mysql.query('UPDATE gj_users SET ? ' +
                        'WHERE password = \'' + userInfo.password + '\'', userInfo)
                } else {
                    // 새로 등록하는 유저라면
                    return mysql.query('INSERT INTO gj_users SET ?', userInfo)
                }
            })
            .then(function () {
                res.status(201);
                res.json({code: 'SUCCESS', message: '페이스북 로그인/회원가입 완료'})
            })
            .catch(function (err) {
                res.status(500);
                res.json({code: 'DB_ERR', message: '데이터베이스 에러'});
            })
    } else {
        // 일반 로그인일 때

        // 예외처리
        if (req.body.username.length < 10) {
            res.status(400);
            res.json({code: 'ID_LENGTH', message: '닉네임 길이제한 10자'});
        }
        if (req.body.password.length < 8) {
            res.status(400);
            res.json({code: 'PW_LENGTH', message: '패스워드 길이제한 8자'});
        }

        userInfo.username = req.body.username;
        userInfo.profile_url = '';
        userInfo.password = req.body.password;
        userInfo.fb_id = '-';
        userInfo.created_at = moment().format('YYYY-MM-DD HH:mm:ss');
        userInfo.login_type = 'default';

        mysql.query('SELECT * FROM gj_users WHERE ' +
            'login_type = \'' + userInfo.login_type + '\' AND ' +
            'username = \'' + userInfo.username + '\'')
            .spread(function (rows) {
                if (rows.length > 0) {
                    // 유저 닉네임 존재
                    if(rows[0].password === req.body.password){
                        // 패스워드도 일치
                        return true;
                    } else {
                        // 패스워드 불일치
                        throw 'PW_INVAILD';
                    }
                } else {
                    // 새로 등록하는 유저
                    return mysql.query('INSERT INTO gj_users SET ?', userInfo)
                }
            })
            .then(function () {
                res.status(201);
                res.json({code: 'SUCCESS', message: '로그인/회원가입 완료'});
            })
            .catch(function (err) {
                console.log(err);
                if(err === 'PW_INVAILD'){
                    res.status(400);
                    res.json({code: err, message: '패스워드 불일치'});
                } else {
                    res.status(500);
                    res.json({code: 'DB_ERR', message: '데이터베이스 에러'});
                }

            });

    }

});

module.exports = router;
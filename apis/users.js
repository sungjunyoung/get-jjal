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

// 아이디에 해당하는 유저 정보 얻기
router.get('/:userId', function (req, res, next) {
    mysql.query('SELECT * FROM gj_users WHERE id = ?', req.params.userId)
        .spread(function (rows) {
            const userInfo = rows[0];
            res.json(userInfo);
        })
});

// 유저가 좋아요 한 짤방 얻기
router.get('/:userId/jjals/like', function(req,res,next){
    var userId = req.params.userId;

    var page = req.query.page - 1;
    var pagingQuery = page * 30 + ', 30';

    mysql.query('SELECT gj_jjals.* FROM gj_user_likes JOIN gj_jjals ' +
        'ON gj_jjals.id = gj_user_likes.jjal_id WHERE gj_user_likes.user_id = ? LIMIT ' + pagingQuery, userId)
        .spread(function(rows){
            res.status(200);
            res.json({likeJjals: rows})
        })
});

// 유저 짤방 좋아요 / 해제 (쿼리파라미터에 따라서)
// ?flag=true : 좋아요 / ?flag=false : 해제
router.post('/:userId/jjals/:jjalId/like', function (req, res, next) {
    var userLike = req.body;
    var flag = req.query.flag;

    if (flag === 'true') {
        userLike.created_at = moment().format('YYYY-MM-DD HH:mm:ss');
        mysql.query('INSERT INTO gj_user_likes SET ?', userLike)
            .then(function () {
                res.status(201);
                res.json({code: 'SUCCESS', message: '좋아요 성공'});
            })
            .catch(function (err) {
                console.log(err);
                res.status(500);
                res.json({code: 'DB_ERR', message: '데이터베이스 에러'});
            })
    } else {
        mysql.query('DELETE FROM gj_user_likes ' +
            'WHERE user_id = ? AND jjal_id = ?', [userLike.user_id, userLike.jjal_id])
            .then(function () {
                res.status(201);
                res.json({code: 'SUCCESS', message: '삭제 성공'});
            })
            .catch(function (err) {
                console.log(err);
                res.status(500);
                res.json({code: 'DB_ERR', message: '데이터베이스 에러'});
            })
    }

});

// 유저가 해당 짤방을 좋아요 했는지 아닌지 확인
router.get('/:userId/jjals/:jjalId/like', function (req, res, next) {
    mysql.query('SELECT * FROM gj_user_likes WHERE user_id = ? AND jjal_id = ?',
        [req.params.userId, req.params.jjalId])
        .spread(function (rows) {
            var isLike = false;
            if (rows.length > 0) {
                isLike = true;
            }
            res.status(200);
            res.json({code: 'SUCCESS', message: '확인', result: isLike});
        })
        .catch(function (err) {
            console.log(err);
            res.status(500);
            res.json({code: 'DB_ERR', message: '데이터베이스 에러'});
        })
});

// 유저 등록 / 로그인
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
                return mysql.query('SELECT id FROM gj_users WHERE fb_id = ?', userInfo.fb_id)
            })
            .spread(function (rows) {
                res.status(201);
                res.json({code: 'SUCCESS', message: '페이스북 로그인/회원가입 완료', userId: rows[0].id})
            })
            .catch(function (err) {
                console.log(err);
                res.status(500);
                res.json({code: 'DB_ERR', message: '데이터베이스 에러'});
            })
    } else {
        // 일반 로그인일 때

        // 예외처리
        if (req.body.username.length < 6) {
            res.status(400);
            res.json({code: 'ID_LENGTH', message: '닉네임 길이제한 6자'});
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
                    if (rows[0].password === req.body.password) {
                        // 패스워드도 일치
                        return true;
                    } else {
                        // 패스워드 불일치
                        throw 'PW_INVALID';
                    }
                } else {
                    // 새로 등록하는 유저
                    return mysql.query('INSERT INTO gj_users SET ?', userInfo)
                }
            })
            .then(function () {
                return mysql.query('SELECT id FROM gj_users WHERE username = ? AND password = ?',
                    [userInfo.username, userInfo.password])
            })
            .spread(function (rows) {
                res.status(201);
                res.json({code: 'SUCCESS', message: '로그인/회원가입 완료', userId: rows[0].id});
            })
            .catch(function (err) {
                if (err === 'PW_INVALID') {
                    res.status(400);
                    res.json({code: err, message: '패스워드 불일치'});
                } else {
                    console.log(err);
                    res.status(500);
                    res.json({code: 'DB_ERR', message: '데이터베이스 에러'});
                }

            });

    }

});

module.exports = router;
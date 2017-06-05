/**
 * Created by junyoung on 2017. 6. 2..
 */

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mysql = require('mysql-promise')();
const mysqlConfig = require('../config/mysql.json');


mysql.configure(mysqlConfig);

// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({extended: false}));
// parse application/json
router.use(bodyParser.json());


// 짤 정보 관련 API

//인기 짤방
router.get('/popular', function (req, res, next) {
    var page = req.query.page - 1;
    var pagingQuery = page * 30 + ', 30';
    mysql.query('SELECT gj_jjals.* FROM gj_user_likes JOIN gj_jjals ON gj_jjals.id = gj_user_likes.jjal_id GROUP BY jjal_id ORDER BY count(*) DESC LIMIT ' + pagingQuery)
        .spread(function (rows) {
            const popular_jjals = {jjals: rows};
            res.json(popular_jjals);
        });
});

// uri : GET /jjals/:jjalId
router.get('/:jjalId', function (req, res, next) {
    // 여기에 쿼리날려서 반환
    res.json({jjalId: req.param("jjalId")})
});

router.post('/', function (req, res, next) {
    console.log(req.body);
    res.json(req.body);
});

// 유저가 올린 짤방
router.get('/users/:userId', function (req, res, next) {
    var page = req.query.page - 1;
    var pagingQuery = page * 30 + ', 30';
    mysql.query('SELECT * FROM gj_jjals WHERE own_user_id = ?' +
        ' ORDER BY created_at DESC LIMIT ' + pagingQuery, req.params.userId)
        .spread(function (rows) {
            const userJjals = {userJjals: rows};
            res.json(userJjals);
        })
});

router.get('/', function (req, res, next) {
    var page = req.query.page - 1;
    var pagingQuery = page * 30 + ', 30';
    mysql.query('SELECT * FROM gj_jjals ORDER BY created_at DESC LIMIT ' + pagingQuery)
        .spread(function (rows) {
            const jjals = {jjals: rows};
            res.json(jjals);
        })
});


// User가 Like 한 짤방
/*
 router.get('/:userId',function(req,res,next)
 {
 mysql.query('SELECT * FROM user_id='+req.param.userId)
 .spread(function (rows)
 {
 const like_jjals = {jjals : rows};
 res.json(like_jjals);
 });
 });
 */


//최근 짤방
/*
 router.get('/recent',function(req,res,next) {
 mysql.query('SELECT * FROM gj_jjals ORDER BY created_at DESC')
 .spread(function (rows)
 {
 const recent_jjals = {jjals : rows};
 res.json(recent_jjals);
 });
 });
 */

module.exports = router;

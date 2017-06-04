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

// uri : GET /jjals/:jjalId
router.get('/:jjalId', function (req, res, next) {
    // 여기에 쿼리날려서 유저검색 후 반환
    res.send({jjalId: req.param("jjalId")})
});

//TODO 페이징
router.get('/', function (req, res, next) {
    var page = req.query.page - 1;
    var pagingQuery = page * 30 + ', 30';
    mysql.query('SELECT * FROM gj_jjals ORDER BY created_at DESC LIMIT '+pagingQuery)
        .spread(function (rows) {
            const jjals = {jjals: rows};
            res.json(jjals);
        })
});

module.exports = router;
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


// 짤방 아이디에 대한 태그들 리턴
router.get('/:jjalId/tags', function (req, res, next) {
    var jjalId = req.params.jjalId;
    mysql.query('SELECT gj_tags.name FROM gj_jjal_tags' +
        ' JOIN gj_tags ON gj_jjal_tags.tag_id = gj_tags.id WHERE gj_jjal_tags.jjal_id = ' + jjalId)
        .spread(function (rows) {
            const jjal_tags = {tags: rows};
            res.json(jjal_tags);
        })

});


//짤 등록
router.post('/', function (req, res, next) {

    var jjals_info = req.body;
    var tags_info = jjals_info.tags;
    var jjal_id;
    console.log(tags_info);

    mysql.query('SELECT AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA = \'get-jjal\' AND TABLE_NAME = \'gj_jjals\'')
        .spread(function (rows) {
            console.log(rows[0]);
            jjal_id = rows[0].AUTO_INCREMENT;
            console.log(jjal_id);
            return mysql.query("INSERT INTO gj_jjals (src,width,height,own_user_id) VALUES (?,?,?,?)",
                [jjals_info.src, jjals_info.width, jjals_info.height, jjals_info.own_user_id]);
        })
        .then(function () {
            var insert_tag_query = "INSERT IGNORE INTO gj_tags (name) VALUES ";
            tags_info.forEach(
                function addValues(value) {
                    insert_tag_query += "('";
                    insert_tag_query += value.name;
                    insert_tag_query += "'),";
                }
            );
            insert_tag_query = insert_tag_query.substring(0, insert_tag_query.length - 1);
            console.log(insert_tag_query);
            return mysql.query(insert_tag_query);
        })
        .then(function () {
            var select_tag_query = "SELECT * FROM gj_tags WHERE name IN (";
            tags_info.forEach(
                function addValues(value) {
                    select_tag_query += "'";
                    select_tag_query += value.name;
                    select_tag_query += "',";
                }
            );
            select_tag_query = select_tag_query.substring(0, select_tag_query.length - 1);
            select_tag_query += ')';
            return mysql.query(select_tag_query);
        })
        .spread(function (rows) {
            rows.forEach(
                function jjals_tags_insert(value) {
                    mysql.query("INSERT INTO gj_jjal_tags (jjal_id,tag_id) VALUES (?,?)", [jjal_id, value.id]);
                }
            )
        })
        .then(function () {
            res.status(201);
            res.json({code: 'SUCCESS', message: '작성 성공'});
        })
        .catch(function(err){
            console.log(err);
            res.status(500);
            res.json({code: 'DB_ERR', message: '데이터베이스 에러'});
        });


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

    if(req.query.tagId)
    {
      console.log("tagId");
      mysql.query('SELECT * FROM gj_jjals WHERE id IN ((SELECT jjal_id FROM gj_jjal_tags WHERE tag_id = ?)) ORDER BY created_at DESC LIMIT '+pagingQuery,[req.query.tagId])
          .spread(function (rows) {
              const jjals = {jjals: rows};
              res.json(jjals);
          })
    }
    else {
      mysql.query('SELECT * FROM gj_jjals ORDER BY created_at DESC LIMIT ' + pagingQuery)
          .spread(function (rows) {
              const jjals = {jjals: rows};
              res.json(jjals);
          })
    }
});

router.get('/:userId',function(req,res,next)
{
    mysql.query('SELECT * FROM user_id='+req.param.userId)
        .spread(function (rows)
    {
        const like_jjals = {jjals : rows};
        res.json(like_jjals);
    });
});

router.get('/:jjalId/users/like',function(req,res,next)
{
  mysql.query('SELECT * FROM gj_users WHERE id IN (SELECT user_id FROM gj_user_likes WHERE jjal_id = ?)',[req.param.jjalId])
      .spread(function (rows)
  {
      const like_user_jjals = {jjals : rows};
      res.json(like_jjals);
  });
});

module.exports = router;

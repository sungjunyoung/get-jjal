/**
 * Created by junyoung on 2017. 6. 2..
 */

var express = require('express');
var router = express.Router();


// 유저 관련 API

// uri : GET /users/:userId
router.get('/:userId', function(req, res, next){
    // 여기에 쿼리날려서 유저검색 후 반환
    res.send({userId: req.param("userId")})
});

module.exports = router;
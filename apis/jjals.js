/**
 * Created by junyoung on 2017. 6. 2..
 */

var express = require('express');
var router = express.Router();


// 짤 정보 관련 API

// uri : GET /jjals/:jjalId
router.get('/:jjalId', function(req, res, next){
    // 여기에 쿼리날려서 유저검색 후 반환
    res.send({jjalId: req.param("jjalId")})
});

module.exports = router;
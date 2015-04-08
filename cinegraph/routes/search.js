var express = require('express');
var http = require('http');
var router = express.Router();
var dbLocal = require("seraph")(); // default is http://localhost:7474/db/data

/* GET movies listing. */
router.get('/movie', function(req, res) {
    var limit = 10;
    if (req.query.limit)
    {
        limit = parseInt(req.query.limit);
    }
    var cypher = "START movie=node:node_auto_index('title:(" + req.query.query + "*)') RETURN movie LIMIT 10";
    dbLocal.query(cypher,
        function(err, result)
        {
            if (err) throw err;
            res.json(result);
        });
});

router.get('/person', function(req, res) {
    var limit = 10;
    if (req.query.limit)
    {
        limit = parseInt(req.query.limit);
    }
    var cypher = "MATCH (person:Person) WHERE person.fullname =~ \"" + req.query.query + ".*\" RETURN person LIMIT 10";
    dbLocal.query(cypher,
        function(err, result)
        {
            if (err) throw err;
            res.json(result);
        });
});


module.exports = router;

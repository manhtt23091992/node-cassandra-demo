var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');
var async = require('async');
var client = new cassandra.Client({contactPoints: ['127.0.0.1'], keyspace: 'nodetest'});

/* GET home page. */
router.get('/', function (req, res, next) {
    var status = req.param('status');
    if (typeof status !== 'undefined') {
        if (status == "1") {
            res.render('index', {title: 'VN-CMS', status: "Username or Password is invalid"});
        }
    } else {
        res.render('index', {title: 'VN-CMS'});
    }
});

router.get('/index.htm', function (req, res, next) {
    res.render('index', {title: 'VN-CMS'});
});

router.get('/loginsuccess.htm', function (req, res, next) {
    res.render('login-success');
    var _send = res.send;
    var sent = false;
    res.send = function (data) {
        if (sent) return;
        _send.bind(res)(data);
        sent = true;
    };
    next();
});

router.post('/login', function (req, res, next) {
    var results = [];
    var username = req.body.username;
    var password = req.body.password;
    //var username = req.param('username');
    //var password = req.param('password');

    client.connect(function (err) {
        if (err) {
            client.shutdown();
            return console.error('There was an error when connecting', err);
        }

        var query = 'SELECT * FROM users WHERE  username = ? and password = ? ALLOW FILTERING;';

        client.execute(query, [username, password], function (err, result) {
            if (err) {
                client.shutdown();
                return console.error('There was while trying to retrieve data from system.local', err);
            }
            //var row = result.rows[0];
            //results.push(row);
            if (result.rows.length > 0) {
                return res.redirect('/loginsuccess.htm');
            } else {
                return res.redirect('/?status=1');
            }
            client.shutdown();
        });
    });

});
module.exports = router;

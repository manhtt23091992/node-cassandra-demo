/**
 * Created by manhtt on 1/28/2016.
 */
var cassandra = require('cassandra-driver');
var async = require('async');
var client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'nodetest'});

async.series([
    //CreateTable
    function (callback) {
        client.execute("CREATE TABLE users (userid int, username text, password text,PRIMARY KEY (userid, username, password));", function (err, result) {
            // Run next function in series
            callback(err, null);
        });
    },
    // Insert
    function (callback) {
        client.execute("INSERT INTO users(userid, username, password) VALUES (1, 'admin', '123456');", function (err, result) {
            // Run next function in series
            callback(err, null);
        });
    }
], function (err, results) {
    // All finished, quit
    process.exit();
});
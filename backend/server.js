"use strict";

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
var cors = require('cors');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var router = require('express-router');
var App = require('../src/App');

var app = express();
var port = 8080;
app.use(cors());
app.use(bodyParser.json()); // get information from html forms

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(fileUpload());
app.listen(port);
console.log('Server running on port: ' + port + '🐶'); // DB Connection URL

var url = 'mongodb://wilburFranklin:w1lburFrankl1n@ds121593.mlab.com:21593/photo_test'; // Database Name
var dbName = 'photo_test'; // Create a new MongoClient
var client = new MongoClient(url); // serve the main page

app.use(express.static(__dirname + '/dist'));

app.get("/", (req, res) => { 
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.post('/upload', function () {
  client.connect(function (err, client) {
    assert.equal(null, err);
    console.log("Connected correctly to database server");
    var db = client.db(dbName); // Insert a single document

    db.collection('inserts').insertOne({
      a: 1
    }, function (err, r) {
      assert.equal(null, err);
      assert.equal(1, r.insertedCount); // Insert multiple documents
      console.log('inserting this many files into mongo: ', r.insertedCount);
      db.collection('inserts').insertMany([{
        a: 2
      }, {
        a: 3
      }], function (err, r) {
        assert.equal(null, err);
        assert.equal(2, r.insertedCount);
        client.close();
      });
    });
  }, {
    useNewUrlParser: true
  });
});
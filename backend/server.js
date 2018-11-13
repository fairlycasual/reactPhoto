"use strict";

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
var cors = require('cors');
var MongoClient = require('mongodb').MongoClient;
var router = require('express-router');
var Blob = require('blob');
const multer = require('multer');

var firebase = require("firebase/app");
var { Storage } = require('@google-cloud/storage');
const storageBucket = 'gs://reactphoto-332d3.appspot.com';
var admin = require("firebase-admin");
//const bucket = storage.bucket(storageBucket);

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
// Multer is required to process file uploads and make them available via req.files.
var storage = multer.memoryStorage()
var upload = multer({ storage: storage })

// Initialize Firebase
const config = {
  apiKey: "AIzaSyBAEdhnT3ZYCxDDBgvdaDFeMH1Ve1OPe6c",
  authDomain: "reactphoto-332d3.firebaseapp.com",
  databaseURL: "https://reactphoto-332d3.firebaseio.com",
  projectId: "reactphoto-332d3",
  storageBucket: "reactphoto-332d3.appspot.com",
  messagingSenderId: "1023097647997"
};
admin.initializeApp(config);


app.use(express.static(__dirname + '/dist'));

app.get("/", (req, res) => { 
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.post('/upload', upload.single("file"), (req, res) => {
  console.log('opening post of server.js, file: ', req.file);

	res.json({'msg': 'File uploaded successfully!', 'file': req.file});


});

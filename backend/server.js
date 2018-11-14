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
var FormData = require('form-data');
var fs = require('fs');

var firebase = require("firebase/app");
var { Storage } = require('@google-cloud/storage');
const storageBucket = 'gs://reactphoto-332d3.appspot.com';
var admin = require('firebase-admin');
var serviceAccount = require("../reactphoto-332d3-firebase-adminsdk-2o0k8-86f07ff19b.json");
//const bucket = Storage.bucket(storageBucket);
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
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://reactphoto-332d3.firebaseio.com"
});

// initialize firebase storage
var db = admin.database();
var ref = db.ref("server/image-uploads");
var imagesRef = ref.child("images");

// serve static resources bundled by webpack
app.use(express.static(__dirname + '/dist'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => { 
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.post('/upload', upload.any(), (req, res) => {
  // convert the uploaded images to form
  var form = new FormData();
  form.append('imgFile', fs.createReadStream('req.file'));
  console.log('opening post of server.js, file: ', form);
	res.json({'msg': 'File uploaded successfully to node'});

  // need to determine if this is actually how to access the stream data? 
  imagesRef.push({
    title: 'imgUpload' + Date.now(),
    image: form._streams[0]
  });
});

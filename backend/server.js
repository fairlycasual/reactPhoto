"use strict";

const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const Blob = require('blob');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');
const admin = require('firebase-admin');
var Busboy = require('busboy');
const serviceAccount = require("../reactphoto-332d3-firebase-adminsdk-2o0k8-86f07ff19b.json");

const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json()); // get information from html forms
app.use(cookieParser());
app.use(fileUpload());
app.listen(port);
// serve static resources bundled by webpack
app.use(express.static(__dirname + '/dist'));
console.log('Server running on port: ' + port + '🐶'); // DB Connection URL
// Multer is required to process file uploads and make them available via req.files.
var storage = multer.memoryStorage();
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

app.get("/", (req, res) => { 
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.post('/upload', (req, res) => {

  console.log('/upload, url string? ', req.body);
  //TODO: TODO: EDIT TO PARSE UINT8 DATA!!! no more form data TODO: TODO:
  // let form = new FormData();
  // form.append('imgFile', fs.createReadStream('req.file'));
  // console.log('opening post of server.js, req.body: ', req.body);
	// res.json({'msg': 'File uploaded successfully to node', 'form buffer? req.file': req.file});

  // TODO: send the byte array instead of the form with appropraite headers
  imagesRef.putString(req.body, 'data_url').then((snapshot) => {
    console.log('uploaded a url string', req.body);
  })

  // attempting to get download urls

  // let url = ref.getDownloadUrl();
  // console.log('url?? ', url);

  // ref.on("value", function(snapshot) {
  //   console.log('download url: ', snapshot.databaseURL());
  // }, function (errorObject) {
  //   console.log("The read failed: " + errorObject.code);
  // });

});

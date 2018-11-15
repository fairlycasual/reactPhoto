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
const serviceAccount = require("../reactphoto-332d3-firebase-adminsdk-2o0k8-86f07ff19b.json");

const app = express();
const port = 8080;

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

app.get("/", (req, res) => { 
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.post('/upload', upload.any('fileArray'), (req, res) => {
  // if (Object.keys(req.files).length == 0) {
  //   return res.status(400).send('No files were uploaded.');
  // }
  console.log('multer test, req.files: ', req.files);
  let imageInput = req.files.filesInput;

  // convert the uploaded images to form
  console.log('TESTTESTTEST, imageInput: ', imageInput);
  var form = new FormData();

  form.append('imgFile', fs.createReadStream('req.file'));
  console.log('opening post of server.js, file: ', req.file);

	res.json({'msg': 'File uploaded successfully to node'});

  // need to determine if this is actually how to access the stream data? 
  imagesRef.push({
    title: 'imgUpload' + Date.now(),
    image: form._streams[0]
  });

  // let url = ref.getDownloadUrl();
  // console.log('url?? ', url);

  ref.on("value", function(snapshot) {
    console.log('download url: ', snapshot.val());
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

});

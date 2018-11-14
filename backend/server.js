"use strict";

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
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

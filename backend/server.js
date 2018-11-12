"use strict";

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
var cors = require('cors');
var MongoClient = require('mongodb').MongoClient;
var router = require('express-router');
var App = require('../src/App');

var firebase = require("firebase/app");
var {Storage} = require('@google-cloud/storage');
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
const storage = admin.storage();
const bucket = storage.bucket();

/* const storage = new Storage({
  projectId: config.projectId,
}); */

 

app.use(express.static(__dirname + '/dist'));

app.get("/", (req, res) => { 
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.post('/upload', function (fileListObj) {

  let storageRef = storage.ref();
  let imagesRef = storageRef.child('images');
  let firebaseArr = [];

  for (image in fileListObj) {
    
    let blob = new Blob([JSON.stringify(image, null, 2)], {type : 'image/jpeg'})
    let name = image.name + Date.now().toString;
    const metadata = { contentType: image.type };
    const task = imagesRef.child(name).put(blob, metadata);

    task.on('state_changed', function(snapshot){
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, function(error) {
      switch (error.code) {
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
    
        case 'storage/canceled':
          // User canceled the upload
          break;
        case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    }, function() {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        console.log('File available at', downloadURL);
        firebaseArr.push(downloadURL);
      });
    });

  }
console.log('array of download urls: ', firebaseArr);

});
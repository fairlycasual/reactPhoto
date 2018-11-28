"use strict";
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require("../reactphoto-332d3-firebase-adminsdk-2o0k8-86f07ff19b.json");
const firebase = require('firebase');
require("firebase/storage");

const app = express();
const port = 8080;

global.XMLHttpRequest = require("xhr2");

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
console.log('Server running on port: ' + port + ' 🐶'); 

const config = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://reactphoto-332d3.firebaseio.com",
  storageBucket: "reactphoto-332d3.appspot.com"
}

// initialize firebase sdk
firebase.initializeApp(config);

// function to upload image to firebase
async function uploadImage(file, title) {
  try {
    let buffer = Buffer.from(file);
    let arrayBuffer = Uint8Array.from(buffer).buffer;

    const ref = firebase
      .storage()
      .ref("server/image-uploads")
      .child(title);

    const snapshot = await ref.put(arrayBuffer);
    console.log('did this func work? ', snapshot);
  } catch(error) {
    console.log(error);
  }
}

// send the build html? 
app.get("/", (req, res) => { 
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// upload file route
app.post('/upload', (req, res) => {

  //console.log('/upload, req.body: ', req.body);

  console.log('finna call ref.put');
  uploadImage(req.body.fileArray, req.body.imageTitle);
  console.log('image title: ', req.body.imageTitle)
  console.log('just called ref.put');
  // attempting to get download urls
  //let url = imagesRef.getDownloadUrl();
  

  // ref.on("value", function(snapshot) {
  //   console.log('download url: ', snapshot.databaseURL());
  // }, function (errorObject) {
  //   console.log("The read failed: " + errorObject.code);
  // });

});

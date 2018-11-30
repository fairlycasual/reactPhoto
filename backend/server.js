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
const app = express();
const port = 8080;
require("firebase/storage");

global.XMLHttpRequest = require("xhr2");

app.use(cors());
app.use(bodyParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()); 
app.use(cookieParser());
app.use(fileUpload());
app.listen(port);

// serve static resources bundled by webpack
app.use(express.static(__dirname + '/dist'));
console.log('Server running on port: ' + port + ' 🐶'); 

// firebase config
const config = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://reactphoto-332d3.firebaseio.com",
  storageBucket: "reactphoto-332d3.appspot.com"
}

// initialize firebase sdk
firebase.initializeApp(config);

// upload image to firebase
async function uploadImage(file, title) {
  try {
    let buffer = Buffer.from(file);
    let arrayBuffer = Uint8Array.from(buffer).buffer;
    // need to regex out special characters for firebase naming
    title = title.replace(/.jpg*$/,"");

    const ref = firebase
      .storage()
      .ref("server/image-uploads")
      .child(title);

    const urlRef = firebase
      .database()
      .ref("server/image-urls");

    await ref.put(arrayBuffer);
    let url = await firebase.storage().ref("server/image-uploads").child(title).getDownloadURL();

    urlRef.push().set({
      [title]: url
    });
  } catch(error) {
    console.log(error);
  }
}

// retrieve files from firebase
let itemsArray;
async function getImages() {
  // create a ref for the realtime database to store download url object
  const urlRef = firebase
  .database()
  .ref("server/image-urls");

  // Lists files in the bucket
  urlRef.on('value', function(snapshot) {
    itemsArray = snapshotToArray(snapshot);
  })
}

// create an array of download URLs from firebase
const snapshotToArray = (snapshot) => {
  var returnArr = [];
  snapshot.forEach(function(childSnapshot) {
      var item = childSnapshot.val();
      item.key = childSnapshot.key;

      returnArr.push(item);
  });
  return returnArr;
};

// send the build html? 
app.get("/", (req, res) => { 
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// upload file route
app.post('/upload', async (req, res) => {
  console.log('/upload route on server hit');
  let promiseFunctions = [];
  promiseFunctions.push(uploadImage(req.body.fileArray, req.body.imageTitle));
  promiseFunctions.push(getImages());

  await Promise.all(promiseFunctions);
  console.log('promise.all results: ', itemsArray);
  res.send({urlList: itemsArray});
});

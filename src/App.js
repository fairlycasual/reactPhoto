import React, { Component } from "react";
import './app.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      imageURL: '',
      loaded: 0,
      firebaseImages: [],
      images: [],
    }

    this.file;
    this.fileInput = React.createRef();
    
    this.previewFile = this.previewFile.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.fileSelectHandler = this.fileSelectHandler.bind(this);
    this.fileUploadHandler = this.fileUploadHandler.bind(this);
    this.getPhotoHandler = this.getPhotoHandler.bind(this);
      
  }

  // preview an image live
  previewFile(fileUpload) {
    let preview = document.querySelector('img');
    this.file = fileUpload;
    const reader = new FileReader();
  
    // TODO: change preview from div to modal
    reader.addEventListener("load", function () {
      preview.src = reader.result;
    }, false);
  
    if (this.file) {
      reader.readAsDataURL(this.file);
    }
  }

  // upload file handler
  uploadFile(file) {
    const reader = new FileReader();
    if (file) {
      reader.onload = () => {
        let uint8array = new Uint8Array(reader.result);
        let formData = new FormData();

        formData.append('fileArray', uint8array);
        formData.append('imageTitle', this.file.name);

        fetch('http://localhost:8080/upload', {
          method: 'POST',
          body: formData,
        }).then(res => {
          res.json().then(body => {
            this.setState({
              firebaseImages: body
            });
            console.log('this.state.firebaseImages: ', this.state.firebaseImages);
          })
        })
      };
      reader.readAsArrayBuffer(file);
    }
    else {
      console.log('no file mang');
    }
  }

  
  // select a file
  fileSelectHandler = (e) => {
    this.setState({
      // iterate e.target.files for multiple
      selectedFile: e.target.files[0],
    })
    // iterate through the files array, generate preview and upload
    this.previewFile(e.target.files[0]);
    console.log('selected data: ', this.state.selectedFile);
  }

  // dispatch file to server
  fileUploadHandler = (e, req, res) => {
    e.preventDefault();
    this.uploadFile(this.file);
    let preview = document.querySelector('img');
    preview.src = '';
    }

  // get photos from server
  // will need to translate from byte array to a proper file and put into the array of photo objects for the gallery
  // should I GET from node or just go direct from firebase?? 
  getPhotoHandler = () => {
    console.log('get clicked');
    let imagesUrlObject = this.state.firebaseImages;
    console.log('imagesArray: ', imagesUrlObject['urlList'])
    for (let i = 0; i < imagesUrlObject['urlList'].length; i++) {
      let url = imagesUrlObject['urlList'][i][Object.keys(imagesUrlObject['urlList'][i])[0]]
      console.log('testing url in getPhoto, url: ', url);
        fetch(url, {
          method: 'GET',
        }).then((response) => {
          return response.body.arrayBuffer()})
            .then((buffer) => {
              console.log('in response of fetch, buffer: ', buffer);
              let blob = new Blob(buffer['[[Uint8Array]]'], 'image/jpg');
              let imageSource = {
                original: blob,
                thumbnail: blob
              }

              this.state.images.push(imageSource);
              console.log('this.state.images: ', this.state.images);
              //document.querySelector('imgGallery').src = base64Flag + imageStr;
          });
        }
      
  }
  

  // component did mount to generate gallery

  render() {
    return (
      <div className="App">
        <div className="header">
        </div>
        <div className="upload">
          <input type="file" id="input" name="imageUpload" onChange={this.fileSelectHandler} multiple ref = {(ref) => {this.uploadInput = ref;}}/>
          <button onClick={this.fileUploadHandler}>Upload!</button>
        </div>
        <div className="preview">
          <img></img>
        </div>
        <button onClick={this.getPhotoHandler}>TEST</button>
        <div className="imgGallery">
        </div>
      </div>
    )
  }
}

export default App;
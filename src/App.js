import React, { Component } from "react";
import './app.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      imageURL: '',
      loaded: 0,
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
    console.log('uploadFile() called, this.file: ', file);
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
            console.log(body);
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
  fileSelectHandler = (event) => {
    this.setState({
      selectedFile: event.target.files[0],
    })
    // iterate through the files array, generate preview and upload
    this.previewFile(event.target.files[0]);
    console.log('selected data: ', this.state.selectedFile);
  }

  // dispatch file to server
  fileUploadHandler = (e, req, res) => {
    console.log('fileUploadHandler(), this.file: ', this.file);
    e.preventDefault();
    this.uploadFile(this.file);
    let preview = document.querySelector('img');
    preview.src = '';
    }

  // get photos from server
  // will need to translate from byte array to a proper file and put into the array of photo objects for the gallery
  // should I GET from node or just go direct from firebase?? 
  getPhotoHandler = () => {
    fetch('http://localhost:8080/read', {
      method: 'GET',
    }).then((res) => {
      res.arrayBuffer().then((buffer) => {
        var base64Flag = 'data:image/jpeg;base64,';
        var imageStr = arrayBufferToBase64(buffer);
        document.querySelector('imgGallery').src = base64Flag + imageStr;
      });
    });
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
       
      </div>
    )
  }
}

export default App;
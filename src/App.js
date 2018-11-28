import React, { Component } from "react";
//import FileReader from 'filereader';
import Axios from "axios";

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
    
    
    // bind all my functions here
      // this.function = this.function.bind(this);
      
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

  // upload file similar to preview. 
  uploadFile(file) {
    console.log('uploadFile() called, this.file: ', file);
    const reader = new FileReader();

    if (file) {
      reader.onload = () => {
        console.log('in reader addEventListener, result: ', reader.result);

        // TODO: make a uint8array of the read file to feed to the blobber? 
        let uint8array = new Uint8Array(reader.result);
        console.log('uint8array: ', uint8array);
        let formData = new FormData();

        formData.append('fileArray', uint8array);
        formData.append('imageTitle', this.file.name);
        // TODO: chunk file and blob the chunks by iterating over the length of the uint8array?

        fetch('http://localhost:8080/upload', {
          method: 'POST',
          body: formData,
          //headers: { "Content-Type": "application/octet-stream" },
        }).then(res => {
          res.json().then(body => {
            this.setState({ imageURL: `http://localhost:8080/${dataUrlString}` });
          })
        })
        .then(res => {
          console.log('res in fetch', res);
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
  fileUploadHandler = (e) => {
    // experimenting with uploading different formats, ie byte arrays and avoiding form data
   
    console.log('fileUploadHandler(), this.file: ', this.file);
    e.preventDefault();
    this.uploadFile(this.file);


    // THIS WORKS!!! NOW WORK FROM SERVER.JS to parse the byte array!!!
    //let urlString = reader.readAsDataURL(this.file);
    //console.log('buffer in post: ', buffer);
    //let data = new Uint8Array(urlString);


    }


  getPhotoHandler = () => {
    fetch('http://localhost:8080/read', {
      method: 'GET',
    }).then((res) => {
      res.arrayBuffer().then((buffer) => {
        var base64Flag = 'data:image/jpeg;base64,';
        var imageStr = arrayBufferToBase64(buffer);

        document.querySelector('img').src = base64Flag + imageStr;
      });
    });
  }

  // component did mount to generate gallery

  render() {
    return (
      <div className="App">
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
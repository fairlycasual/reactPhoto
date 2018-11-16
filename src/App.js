import React, { Component } from "react";
//import FileReader from 'filereader';

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
    let filePreview    = fileUpload;
    const reader  = new FileReader();
  
    // TODO: change preview from div to modal
    reader.addEventListener("load", function () {
      preview.src = reader.result;
    }, false);
  
    if (filePreview) {
      this.file = filePreview;
      reader.readAsDataURL(this.file);
    }
  }

  // upload file similar to preview. 
  uploadFile() {
    console.log('upload file called');
    const reader = new FileReader();

    if (this.file) {
      // either convert url to bytes, or send this straight to firebase?
      let dataUrlString = reader.readAsDataURL(this.file);

      fetch('http://localhost:8080/upload', {
        method: 'POST',
        body: dataUrlString,
      }).then(res => {
        res.json().then(body => {
          this.setState({ imageURL: `http://localhost:8080/${dataUrlString}` });
        })
      })
      .then(res => {
        console.log('res in fetch', res);
      })
    }
    else {
      console.log('this.file undefined: ', this.file);
    }
      // re-render gallery
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
   
    console.log('upload clicked, file: ', this.file);
    e.preventDefault();
    this.uploadFile();


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
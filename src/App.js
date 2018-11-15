import React, { Component } from "react";
//import FileReader from 'filereader';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      imageURL: '',
    }

    // bind all my functions here
      // this.function = this.function.bind(this);
      
  }
  
  // select a file
  fileSelectHandler = (event) => {
    this.setState({
      selectedFile: event.target.files
    })

    console.log('selected data: ', this.state.selectedFile);
  }

  // dispatch file to server
  fileUploadHandler = (e) => {
    // experimenting with uploading different formats, ie byte arrays and avoiding form data
   
    console.log('upload clicked');
    e.preventDefault();

    // THIS WORKS!!! NOW WORK FROM SERVER.JS to parse the byte array!!!
    let data = new Uint8Array(this.state.selectedFile);


    // send post request to server with image files in array 
    for (let i = 0; i < this.state.selectedFile.length; i++) {
    
      fetch('http://localhost:8080/upload', {
        method: 'POST',
        body: data,
        headers: {'Content-Type':'img/jpg'}
      }).then(res => {
        res.json().then(body => {
          this.setState({ imageURL: `http://localhost:8080/${body.file}` });
        })
      }).then(err => {
        if (err) console.log('error posting: ', err);
      })

        console.log('posting to server, request data sent from App.js: ', this.state.selectedFile[i]);
    }
    console.log('after for loop, formData object: ', data);
    // refresh the gallery and pass it data as props 
    // fetch, method: GET

      //.then

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

  arrayBufferToBase64 = (buffer) => {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
  
    bytes.forEach((b) => binary += String.fromCharCode(b));
  
    return window.btoa(binary);
  };

  // component did mount to generate gallery

  render() {
    return (
      <div className="App">
        <div className="upload">
          <input type="file" name="imageUpload" onChange={this.fileSelectHandler} multiple ref = {(ref) => {this.uploadInput = ref;}}/>
          <button onClick={this.fileUploadHandler}>Upload!</button>
        </div>
       
      </div>
    )
  }
}

export default App;
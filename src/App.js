import React, { Component } from "react";


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
  }

  // dispatch file to server
  fileUploadHandler = (e) => {
    console.log('upload clicked');
    e.preventDefault();

    const data = new FormData();
    data.append('file', this.state.selectedFile);

    // send post request to server
    fetch('http://localhost:8080/upload', {
      method: 'POST',
      body: data,
    }).then(res => {
      res.json().then(body => {
        this.setState({ imageURL: `http://localhost:8080/${body.file}` });
      })
    }).then(err => {
      if (err) console.log('error posting: ', err);
    })

      console.log('posting to server, request data: ', this.state.selectedFile);
     
  
    // refresh the gallery and pass it data as props 
    // fetch, method: GET

      //.then

  }


  render() {
    return (
      <div className="App">
        <div className="upload">
          <input type="file" onChange={this.fileSelectHandler} multiple ref = {(ref) => {this.uploadInput = ref;}}/>
          <button onClick={this.fileUploadHandler}>Upload!</button>
        </div>
       
      </div>
    )
  }
}

export default App;
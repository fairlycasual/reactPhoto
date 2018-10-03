import React, { Component } from "react";
import axios from 'axios';

class App extends Component {
  state = {
    selectedFile: null,
  }

  fileSelectHandler = (event) => {
    this.setState({
      selectedFile: event.target.files[0]
    })
  }

  // use this method to dispatch file to server/db express? Axios -> firebase (video)? mongo?
  fileUploadHandler = () => {
    console.log('upload clicked');
   
  }

  render() {
    return (
      <div className="App">
        <input type="file" onChange={this.fileSelectHandler}/>
        <button onClick={this.fileUploadHandler}>Upload!</button>
      </div>
    )
  }
}

export default App;
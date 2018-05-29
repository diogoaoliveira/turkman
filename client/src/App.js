import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

const RIGHT_ARROW = 39;
const LEFT_ARROW = 37;
const DOWN_ARROW = 40;

const API_URL = 'http://localhost:5000';
const config = {
  headers: { 'Content-Type': 'application/json' },
};

class App extends Component {
  state = {
    step: 0,
    photos: [],
  };

  componentDidMount() {
    axios.get(API_URL).then(res => {
      this.setState({ photos: res.data.data });
    });
  }

  classifyPhoto = (currentPhotoPath, choice) => {
    return axios.post(
      `${API_URL}/move`,
      { photoPath: currentPhotoPath, folderSelected: choice },
      config
    );
  };

  onKeyPress = (event, currentPhotoPath) => {
    event.preventDefault();
    event.stopPropagation();
    const { keyCode } = event;
    switch (keyCode) {
      case RIGHT_ARROW:
        this.classifyPhoto(currentPhotoPath, 'men')
          .then(res => console.log(res.data.message))
          .catch(err => console.log(err.data.error));

        break;
      case LEFT_ARROW:
        this.classifyPhoto(currentPhotoPath, 'women')
          .then(res => console.log(res.data.message))
          .catch(err => console.log(err.data.error));

        break;
      case DOWN_ARROW:
        this.classifyPhoto(currentPhotoPath, 'undefined')
          .then(res => console.log(res.data.message))
          .catch(err => console.log(err.data.error));

        break;
      default:
        return;
    }
    this.setState({ step: this.state.step + 1 });
  };

  returnFileName(absolutePath) {
    if (!absolutePath) return '';
    const path = absolutePath.split('/');
    return path[path.length - 1];
  }

  render() {
    const { step, photos } = this.state;

    if (step > photos.length - 1)
      return (
        <div>
          <h1>No more photos to classify!</h1>
        </div>
      );
    if (photos.length > 0) {
      let imagePath = this.returnFileName(photos[step]);
      const photoObj = (
        <img
          src={require(`../../photos/${imagePath}`)}
          style={{ width: 300 }}
        />
      );
      return (
        <div
          className="App"
          tabIndex="0"
          onKeyDown={e => this.onKeyPress(e, photos[step])}
        >
          <h1>Turkman!</h1>
          {photoObj}
          <div>
            <h2>Select with arrows to classify:</h2>
            <h4>Right arrow: Men</h4>
            <h4>Left arrow: Women</h4>
            <h4>Down arrow: Undefined</h4>
          </div>
        </div>
      );
    }
  }
}

export default App;

import React, { Component } from "react";
import Recaptcha from "react-recaptcha";
import { storage } from "../firebase/firebase";

import "./button.css";

class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recaptcha: false,
      images: [], //Image files
      urls: [], //Stored URL
      progresses: [] //Progress bar value
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  updateList = (list, index, value) => {
    const newList = list.map((item, i) => {
      if (i === index) {
        return value;
      } else {
        return item;
      }
    });
    return newList;
  };

  handleChange = e => {
    if (e.target.files[0]) {
      const newProgresses = new Array(e.target.files.length).fill(0);
      this.setState({ images: [...this.state.images, ...e.target.files] });
      this.setState({
        progresses: [...this.state.progresses, ...newProgresses]
      });
    }
  };

  handleUpload = () => {
    if (this.state.recaptcha === false) {
      alert("Please verify recaptcha");
    } else {
      const { images } = this.state;
      // console.log(images);
      const storageRef = storage.ref();
      const processingRef = storageRef.child("images");
      //Upload multiple images in parallel
      // const uploadTasks =
      images.map((image, index) => {
        var uploadTask = processingRef.child(`${image.name}`).put(image);
        uploadTask.on(
          "state_changed",

          snapshot => {
            // progrss display function ....
            var progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            console.log("Upload is" + progress + "% done");

            const newList = this.updateList(
              this.state.progresses,
              index,
              progress
            );
            this.setState({ progresses: [...newList] });
            // console.log(this.state);
          },

          error => {
            // error handling function ....
            console.log(error);
          },

          () => {
            // complete callback function ....
            processingRef
              .child(image.name)
              .getDownloadURL()
              .then(url => {
                // console.log(url);
                this.setState({ urls: [...this.state.urls, url] });
                console.log(this.state);
              });
          }
        );
        return uploadTask;
      });
      // console.log(this.state);
      // console.log(uploadTasks);
    }
  };

  verifyRecaptcha = res => {
    if (res) {
      this.setState({ recaptcha: true });
    }
  };

  render() {
    return (
      <div className="flex flex-column items-center mt0">
        <script src="https://www.gstatic.com/firebasejs/6.3.3/firebase-app.js"></script>
        <br />
        <progress className="w-75" value={this.state.progress} max="100" />
        <input
          id="img_input"
          type="file"
          multiple
          onChange={this.handleChange}
        />
        <br />
        <img
          src={this.state.urls[0] || "https://dummyimage.com/640x480/fff/fff"}
          alt="Uploaded images"
          height="480"
          width="640"
        />
        <br />
        <Recaptcha
          sitekey="6LfWDbQUAAAAAMBcLHa6ld7lnDowMvC9gA-EKxga"
          // render="explicit"
          // onloadCallback={this.recaptchaLoaded}
          verifyCallback={this.verifyRecaptcha}
        />
        <button className="button" onClick={this.handleUpload}>
          Upload
        </button>
      </div>
    );
  }
}

export default ImageUpload;

import React, { Component } from "react";
import Recaptcha from "react-recaptcha";
import { storage } from "../firebase/firebase";
import "./ImageUpload.css";

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

  renderProgress = () => {
    const { progresses, images } = this.state;
    const listItems = progresses.map((progress, index) => {
      return (
        <li>
          <p>
            {images[index].name} : {progress}
          </p>
        </li>
      );
    });
    return listItems;
  };

  render() {
    return (
      <div>
        <div class="work-feature-block row">
          <div class="columns medium-8">
            <img
              src={
                this.state.urls[0] || "https://dummyimage.com/640x480/fff/fff"
              }
              alt="Uploaded images"
              height="480"
              width="640"
              class="shadow"
            />
          </div>

          <div class="columns medium-4">
            <h2 class="work-feature-block-header">Dataset Description</h2>
            <ul class="clean-list margin-top-2">
              <li>Date: </li>
              <li>Variety: </li>
              <li>EL Stage: </li>
              <li>Vinyard: </li>
              <li>Block ID: </li>
            </ul>
            <input
              id="img_input"
              type="file"
              multiple
              onChange={this.handleChange}
            />
            <Recaptcha
              sitekey="6LfWDbQUAAAAAMBcLHa6ld7lnDowMvC9gA-EKxga"
              // render="explicit"
              // onloadCallback={this.recaptchaLoaded}
              verifyCallback={this.verifyRecaptcha}
            />
            <button
              type="button"
              className="button radius bordered shadow success margin-top-1"
              onClick={this.handleUpload}
            >
              Upload
            </button>
          </div>
        </div>

        <div class="work-feature-block row">
          <div
            data-closable="fade-out"
            class="todo-list-card card columns medium-8"
          >
            <div class="card-divider">
              <h3>Upload Progress</h3>
            </div>
            <div class="card-section">
              <ul>{this.renderProgress()}</ul>
            </div>
          </div>
          <div class="columns medium-4">
            <div
              class="clipped-circle-graph margin-left-3 margin-top-2"
              data-clipped-circle-graph
              data-percent="50"
            >
              <div class="clipped-circle-graph-progress">
                <div class="clipped-circle-graph-progress-fill"></div>
              </div>
              <div class="clipped-circle-graph-percents">
                <div class="clipped-circle-graph-percents-wrapper">
                  <span class="clipped-circle-graph-percents-number"></span>
                  <span class="clipped-circle-graph-percents-units">
                    of 100
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ImageUpload;

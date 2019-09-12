import React, { Component } from "react";
import Recaptcha from "react-recaptcha";
import { storage } from "../firebase/firebase";
// import "./ImageUpload.scss";

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
    // console.log(this.state);
  };

  handleUpload = () => {
    const {
      // name,
      email,
      date,
      variety,
      EL_stage,
      vineyard,
      block_id
    } = this.props.formFields;
    const { id } = this.props.user;
    if (this.state.recaptcha === false) {
      alert("Please verify recaptcha");
    } else {
      const { images } = this.state;
      // console.log(images);
      const storageRef = storage.ref();
      var processingRef;
      if (id === 0) {
        processingRef = storageRef.child(
          `images/${id}/${email}/${vineyard}/${block_id}/${variety}@${EL_stage}/${date}`
        );
      } else {
        processingRef = storageRef.child(
          `images/${id}/${vineyard}/${block_id}/${variety}@${EL_stage}/${date}`
        );
      }
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

  renderStatus = () => {
    const { progresses, images } = this.state;

    const tableItems = images.map((image, index) => {
      console.log(image);
      const url = URL.createObjectURL(image);
      // console.log(url);
      return (
        <tr key={index}>
          <td>
            <div className="flex-container align-justify align-top">
              <div className="flex-child-shrink">
                <img
                  className="dashboard-table-image"
                  src={url}
                  alt="preview"
                  height="50px"
                  width="50px"
                />
              </div>
              <div className="flex-child-grow">
                <h6 className="dashboard-table-text">{image.name}</h6>
                <span className="dashboard-table-timestamp">
                  {image.size / 1000}KB
                </span>
              </div>
            </div>
          </td>
          <td>{progresses[index]}</td>
          <td className="bold">A Bold Line</td>
          <td>A Date</td>
        </tr>
      );
    });
    return tableItems;
  };

  renderTable = () => {
    return (
      <table className="dashboard-table">
        <colgroup>
          <col width="150" />
          <col width="80" />
          <col width="100" />
          <col width="60" />
        </colgroup>
        <thead>
          <tr>
            <th>
              <a href="/">
                Image Preview <i className="fa fa-caret-down"></i>
              </a>
            </th>
            <th>
              <a href="/">
                Status <i className="fa fa-caret-down"></i>
              </a>
            </th>
            <th>
              <a href="/">
                Count <i className="fa fa-caret-down"></i>
              </a>
            </th>
            <th>
              <a href="/">
                Some data <i className="fa fa-caret-down"></i>
              </a>
            </th>
          </tr>
        </thead>
        <tbody>{this.renderStatus()}</tbody>
      </table>
    );
  };

  render() {
    const {
      date,
      variety,
      EL_stage,
      vineyard,
      block_id
    } = this.props.formFields;
    return (
      <div>
        <div className="work-feature-block row">
          <div className="row column medium-8 container">
            <img
              className="thumbnail work-feature-block-image margin-top-1"
              height="500px"
              width="650px"
              src={
                this.state.urls[0] || "https://dummyimage.com/650x500/fff/fff"
              }
              alt="Uploaded images"
            />
          </div>

          <div className="column medium-4">
            <h2 className="work-feature-block-header">Dataset Description</h2>
            <ul className="clean-list margin-top-1">
              <li>Date: {date}</li>
              <li>Variety: {variety}</li>
              <li>EL Stage: {EL_stage}</li>
              <li>Vinyard: {vineyard}</li>
              <li>Block ID: {block_id}</li>
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
            <button
              type="button"
              className="button radius bordered shadow success margin-top-1"
              onClick={() => {
                // this.setState({ dataSaved: false });
                this.props.isSaved(false);
              }}
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div className="work-feature-block row">
          <div
            data-closable="fade-out"
            className="todo-list-card card columns medium-9"
          >
            <div className="card-divider">
              <h3>Upload Progress</h3>
            </div>
            <div className="card-section">
              {/* <ul>{this.renderProgress()}</ul> */}
              {this.renderTable()}
            </div>
          </div>
          <div className="columns medium-3">
            <div
              className="clipped-circle-graph margin-left-3 margin-top-2"
              data-clipped-circle-graph
              data-percent="50"
            >
              <div className="clipped-circle-graph-progress">
                <div className="clipped-circle-graph-progress-fill"></div>
              </div>
              <div className="clipped-circle-graph-percents">
                <div className="clipped-circle-graph-percents-wrapper">
                  {/* // Animation for circle progress indicator -> need Sass manipulation
                  {    $("[data-clipped-circle-graph]").each(function() {
                        var $graph = $(this),
                          percent = parseInt($graph.data("percent"), 10),
                          deg = 30 + (300 * percent) / 100;
                        if (percent > 50) {
                          $graph.addClass("gt-50");
                        }
                        $graph
                          .find(".clipped-circle-graph-progress-fill")
                          .css("transform", "rotate(" + deg + "deg)");
                        $graph.find(".clipped-circle-graph-percents-number").html(percent + "%");
                      });
                  } */}
                  <span className="clipped-circle-graph-percents-number">
                    {this.state.urls.length}
                  </span>
                  <span className="clipped-circle-graph-percents-units">
                    of {this.state.images.length}
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

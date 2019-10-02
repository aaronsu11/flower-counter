import React, { Component } from "react";
import Recaptcha from "react-recaptcha";
import { storage } from "../firebase/firebase";
// import "./ImageUpload.scss";

const getTimeID = () => {
  let curDate = new Date();
  let dateID =
    curDate.getFullYear() +
    (curDate.getMonth() + 1 < 10 ? "0" : "") +
    (curDate.getMonth() + 1) +
    (curDate.getDate() < 10 ? "0" : "") +
    curDate.getDate();

  let timeID =
    (curDate.getHours() < 10 ? "0" : "") +
    curDate.getHours() +
    (curDate.getMinutes() < 10 ? "0" : "") +
    curDate.getMinutes() +
    (curDate.getSeconds() < 10 ? "0" : "") +
    curDate.getSeconds();

  let id = dateID + timeID;

  return id;
};

class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recaptcha: false,
      sendEmail: false,
      stage: 2,
      images: [], //Image files
      urls: [], //Stored URL
      progresses: [], //Progress bar value
      results: [] //Result from api
    };
  }

  // Handle recaptcha response
  verifyRecaptcha = res => {
    if (res) {
      this.setState({ recaptcha: true });
    }
  };

  // Dynamically update state array
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

  // Handle files changes
  handleChange = e => {
    if (e.target.files[0]) {
      // create empty array fields for new files
      const addedList = new Array(e.target.files.length).fill("pending");
      this.setState({
        images: [...this.state.images, ...e.target.files],
        progresses: [...this.state.progresses, ...addedList],
        results: [...this.state.results, ...addedList],
        urls: [...this.state.urls, ...addedList]
      });
    }
  };

  // Calling counter API when upload finished
  callAPI = (index, name, path, batchID) => {
    const { id } = this.props.user;
    // const { name } = this.state.images[0];
    return fetch(this.props.apiURL + "add_task", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userid: id,
        batchid: batchID,
        path: path,
        name: name
      })
    })
      .then(response => response.json())
      .then(res => {
        const resultList = this.updateList(
          this.state.results,
          index,
          res.result
        );
        this.setState({ results: resultList });
        console.log("API complete");
      });
  };

  emailReport = (email, path, batchID) => {
    const { id } = this.props.user;
    fetch(this.props.apiURL + "report", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userid: id,
        batchid: batchID,
        email: email,
        path: path
      })
    })
      .then(response => response.json())
      .then(res => {
        // console.log(res);
        console.log("Email sent");
      });
  };

  // Handle upload and api calling
  processFiles = (path, batchID) => {
    // Extracting images
    const { images } = this.state;

    // Firebase locations
    const storageRef = storage.ref();
    const processingRef = storageRef.child(path);

    //Upload multiple images in parallel
    return Promise.all(
      images.map((image, index) => {
        return (
          new Promise((resolve, reject) => {
            // Upload file
            var uploadTask = processingRef.child(`${image.name}`).put(image);

            // Event listener
            uploadTask.on(
              "state_changed",
              // progrss display function ....
              snapshot => {
                var progress = Math.round(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                // console.log("Upload is" + progress + "% done");
                const progressList = this.updateList(
                  this.state.progresses,
                  index,
                  progress
                );
                this.setState({ progresses: progressList });
              },
              // error handling function ....
              error => {
                console.log(error);
                // reject function pass parameter to .catch()
                reject(error);
              },
              // complete callback function ....
              () => {
                // resolve function return promise and pass parameter to .then()
                resolve();
              }
            );
          })
            // Functions after upload completion
            // Double check image is in storage
            .then(() => {
              return processingRef.child(image.name).getDownloadURL();
            })
            .then(url => {
              const urlList = this.updateList(this.state.urls, index, url);
              this.setState({ urls: urlList });
              return urlList;
            })
            // Call image processing API
            .then(() => {
              return this.callAPI(index, image.name, path, batchID);
            })
        );
      })
    );
  };

  // Complete upload handler
  handleUpload = async () => {
    if (this.state.recaptcha === false) {
      alert("Please verify recaptcha");
    } else {
      // Transfer to progress page
      this.setState({ stage: 3 });
      this.props.setStage(3);

      // Extracting batch info
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

      //Create a batch ID
      const batchID = getTimeID();
      this.props.setBatchID(batchID);

      // Setting upload path
      let path;
      if (id === 0) {
        path = `images/${id}/${email}/${vineyard}/${block_id}/${variety}@${EL_stage}/${date}/`;
      } else {
        path = `images/${id}/${vineyard}/${block_id}/${variety}@${EL_stage}/${date}/`;
      }

      // Wait for all images to be uploaded and processed
      await this.processFiles(path, batchID);

      // Sending email report
      if (this.state.sendEmail) {
        this.emailReport(email, path, batchID);
      }
      console.log("All Done!");
    }
  };

  // Display tasks upload profile
  renderProfile = () => {
    const {
      date,
      variety,
      EL_stage,
      vineyard,
      block_id
    } = this.props.formFields;
    return (
      <div className="work-feature-block row">
        <div className="row column medium-8 container">
          <img
            className="thumbnail work-feature-block-image margin-top-1"
            height="500px"
            width="650px"
            src={this.state.urls[0] || "https://dummyimage.com/650x500/fff/fff"}
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
            className="button radius bordered shadow success margin-top-1 margin-left-1"
            onClick={() => {
              this.props.setStage(1);
            }}
          >
            Edit Profile
          </button>
          {/* <button onClick={this.callAPI}>Call API</button> */}
          <input
            type="checkbox"
            name="sendEmail"
            value="email"
            className="margin-left-1"
          />
          Send report to email
          <br></br>
        </div>
      </div>
    );
  };

  // Get the status tag for each task
  getStatus = index => {
    if (this.state.results[index] !== "pending") {
      return <div>Processed</div>;
    } else if (this.state.urls[index] !== "pending") {
      return <div>Uploaded</div>;
    } else if (this.state.images[index]) {
      return <div>Ready</div>;
    } else {
      return <div>Idle</div>;
    }
  };

  getReport = () => {
    // const { images, results } = this.state;
    // let imageNames = images.map(image => image.name);
    // this.props.setResults(imageNames, results);

    this.setState({ stage: 4 });
    this.props.setStage(4);
  };

  // Display upload and processing status for individual task
  renderTask = () => {
    const { images, progresses, results } = this.state;

    const tableItems = images.map((image, index) => {
      const url = URL.createObjectURL(image);
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
          <td className="bold">
            {results[index] ? results[index] : "Pending"}
          </td>
          <td>{this.getStatus(index)}</td>
        </tr>
      );
    });
    return tableItems;
  };

  // Display the entire status table
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
                Upload Progress <i className="fa fa-caret-down"></i>
              </a>
            </th>
            <th>
              <a href="/">
                Count <i className="fa fa-caret-down"></i>
              </a>
            </th>
            <th>
              <a href="/">
                Status <i className="fa fa-caret-down"></i>
              </a>
            </th>
          </tr>
        </thead>
        <tbody>{this.renderTask()}</tbody>
      </table>
    );
  };

  // Display the entire progress window
  renderProgress = () => {
    return (
      <div className="work-feature-block row">
        <div
          data-closable="fade-out"
          className="todo-list-card card column medium-9"
        >
          <div className="card-divider">
            <h3>Upload Progress</h3>
          </div>
          <div className="card-section">
            {/* <ul>{this.renderProgress()}</ul> */}
            {this.renderTable()}
          </div>
        </div>
        <div className="column medium-3">
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
                <span className="clipped-circle-graph-percents-number">
                  {this.state.urls.length}
                </span>
                <span className="clipped-circle-graph-percents-units">
                  of {this.state.images.length}
                </span>
              </div>
            </div>
          </div>
          <div>
            <button
              type="button"
              className="button radius bordered shadow success margin-top-1"
              onClick={this.getReport}
            >
              Get Report
            </button>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { stage } = this.state;
    if (stage === 2) {
      return <div>{this.renderProfile()}</div>;
    } else if (stage === 3) {
      return <div>{this.renderProgress()}</div>;
    } else if (stage === 4) {
      this.props.setStage(4);
    }
  }
}

export default ImageUpload;

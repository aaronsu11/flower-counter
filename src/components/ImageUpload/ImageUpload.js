import React, { Component } from "react";
import Recaptcha from "react-recaptcha";
import { storage } from "../firebase/firebase";
import {
  Alert,
  Position,
  Tooltip,
  AnchorButton,
  Icon,
  Intent,
  ProgressBar,
  Spinner
} from "@blueprintjs/core";
// import { IconNames } from "@blueprintjs/icons";
import _ from "lodash";
// import DraggableUploader from "./DraggableUploader";
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

const IMG_PER_PAGE = 10;

const alertMsg = {
  UploadError: (
    <div>
      <p>
        An Error occurs during <b> Upload </b>. Would you like to
        <b> Reset</b> or <b>Continue</b> the Upload?
      </p>
      <p>You can also contact our support at aaronsu@unsw.edu.au</p>
    </div>
  ),
  LargeFile: (
    <div>
      <p>
        One or more images you selected is over 10MB, this can make the upload
        slow depending on your internet condition.
      </p>
      <p>
        <b>Recommend</b>: Go back and edit your files into a size smaller than
        5MB.
      </p>
      <p>Or you can continue the upload anyway.</p>
    </div>
  ),
  Recaptcha: ""
};

class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recaptcha: false,
      fileCheck: false,
      alert: false,
      error: "",
      stage: 2,
      imgPage: 1,
      images: [], //Image files
      urls: [], //Stored URL
      progresses: [], //Progress bar value
      results: [] //Result from api
    };
    this.leaveHandler = e => {
      e.preventDefault();
      return (e.returnValue = "Are you sure you want to close?");
    };
  }

  componentDidMount() {
    // Activate the event listener
    window.addEventListener("beforeunload", this.leaveHandler);
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.leaveHandler);
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
    // console.log(e.target.files);
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

  // Remove existing image
  removeLoadedFile(file) {
    //Remove file from the State
    let loadedFiles = this.state.images;
    let newLoadedFiles = _.filter(loadedFiles, ldFile => {
      return ldFile !== file;
    });
    this.setState({ images: newLoadedFiles });
    // console.log(this.state.images);
  }

  // Calling counter API when upload finished
  callAPI = (index, name, path, batchID) => {
    const { uid } = this.props.user;
    const {
      email,
      variety,
      EL_stage,
      vineyard,
      block_id,
      date
    } = this.props.formFields;
    let userid;
    if (uid) {
      userid = uid;
    } else {
      userid = email;
    }
    // const { name } = this.state.images[0];
    return fetch(this.props.apiURL + "add_task", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userid: userid,
        batchid: batchID,
        path: path,
        vineyard: vineyard,
        block: block_id,
        variety: variety,
        el_stage: EL_stage,
        date: date,
        name: name
      })
    })
      .then(response => response.json())
      .then(res => {
        console.log(res);
        const resultList = this.updateList(
          this.state.results,
          index,
          res.estimate // or res.result for raw result
        );
        this.setState({ results: resultList });
        console.log("API complete");
      })
      .catch(error => {
        console.log("API Error: ");
        console.log(error);
        console.log({
          userid: userid,
          batchid: batchID,
          path: path,
          name: name
        });
        throw error;
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
                // reject("Test");
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
              console.log("Uploaded");
              return this.callAPI(index, image.name, path, batchID);
            })
            .catch(error => {
              this.setState({ alert: true, error });
              console.log(error);
            })
        );
      })
    );
  };

  checkImages = () => {
    let image;
    for (image of this.state.images) {
      if (image.size > 10 * 1024 * 1024) {
        return false;
      }
    }
    this.setState({ fileCheck: true });
    return true;
  };

  // Master upload handler
  handleUpload = async () => {
    if (this.state.recaptcha === false) {
      alert("Please verify recaptcha");
    } else {
      if (this.checkImages() === false && !this.state.fileCheck) {
        this.setState({ alert: true });
        return;
      }
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
      const { uid } = this.props.user;

      //Create a batch ID
      const batchID = getTimeID();
      this.props.setBatchID(batchID);

      // Setting upload path
      let path;
      if (uid) {
        path = `images/${uid}/${vineyard}/${block_id}/${variety}@${EL_stage}/${date}/`;
      } else {
        path = `images/guest/${email}/${vineyard}/${block_id}/${variety}@${EL_stage}/${date}/`;
      }

      // Wait for all images to be uploaded and processed
      await this.processFiles(path, batchID);

      // Sending email report
      // if (this.state.sendEmail) {
      //   this.emailReport(email, path, batchID);
      // }
      console.log("All Done!");
    }
  };

  // Get the status tag for each task
  getStatus = index => {
    if (this.state.results[index] !== "pending") {
      return <div>Processed</div>;
    } else if (this.state.urls[index] !== "pending") {
      return <div>Processing...</div>;
    } else if (this.state.images[index]) {
      return <div>Uploading...</div>;
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
    const { images, progresses, results, imgPage } = this.state;
    let pageImages = images.slice(
      (imgPage - 1) * IMG_PER_PAGE,
      imgPage * IMG_PER_PAGE
    );
    // console.log(pageImages);
    const tableItems = pageImages.map((image, indexInPage) => {
      const url = URL.createObjectURL(image);
      let index = (indexInPage + 1) * imgPage - 1;
      let progress = progresses[index] / 100;
      let result = results[index];

      let imgName;
      if (image.name.length > 12) {
        let split = image.name.split(".");
        let filename = split[0];
        let extension = split[1];
        let nameHead = filename.slice(0, 4);
        let nameTail = filename.slice(-4);
        imgName = nameHead + "..." + nameTail + "." + extension;
      } else {
        imgName = image.name;
      }

      return (
        <tr key={index}>
          <td>
            <div className="flex-container align-justify align-top">
              <div className="flex-child-shrink medium-5">
                <img
                  className="dashboard-table-image"
                  src={url}
                  alt="preview"
                />
              </div>
              <div className="flex-child-grow medium-7">
                <h6 className="dashboard-table-text">{imgName}</h6>
                <span className="dashboard-table-timestamp">
                  {image.size / 1000}KB
                </span>
              </div>
            </div>
          </td>
          <td>
            <ProgressBar
              intent={result === "pending" ? Intent.PRIMARY : Intent.SUCCESS}
              value={progress}
              animate={true}
              stripes={result === "pending"}
            />
          </td>
          <td className="bold">
            {result ? parseFloat(result).toFixed(2) : "Pending"}
          </td>
          {/* <td className="bold">
            {results[index] ? parseFloat(results[index]).toFixed(2) : "Pending"}
          </td> */}
          <td>{this.getStatus(index)}</td>
        </tr>
      );
    });
    return tableItems;
  };

  pageNew = page => {
    const { imgPage } = this.state;
    const imgLength = this.state.images.length;
    let lastPage = Math.ceil(imgLength / 5);
    let newPage = imgPage + page;
    if (newPage >= 1 && newPage <= lastPage) {
      this.setState({ imgPage: newPage });
    }
  };

  renderPagination = () => {
    const { imgPage } = this.state;
    const imgLength = this.state.images.length;
    let lastPage = Math.ceil(imgLength / 5);
    let disablePrev = imgPage > 1 ? "enabled" : "disabled";
    let disableNext = imgPage !== lastPage ? "enabled" : "disabled";
    return (
      <nav aria-label="Pagination">
        <ul className="pagination text-center">
          <li
            className={"pagination-previous " + disablePrev}
            onClick={() => this.pageNew(-1)}
          >
            Previous
          </li>
          {imgPage > 2 ? (
            <li
              className="ellipsis"
              onClick={() => this.pageNew(1 - imgPage)}
            ></li>
          ) : (
            <span></span>
          )}
          <li onClick={() => this.pageNew(-1)}>
            {imgPage > 1 ? `${imgPage - 1}` : ``}
          </li>
          <li className="current">
            {imgPage}
            {/* <span className="show-for-sr">You're on page</span> 1 */}
          </li>
          <li onClick={() => this.pageNew(1)}>
            {imgLength > 5 * imgPage ? `${imgPage + 1}` : ``}
          </li>
          {imgPage < lastPage - 1 ? (
            <li
              className="ellipsis"
              onClick={() => this.pageNew(lastPage - imgPage)}
            ></li>
          ) : (
            <span></span>
          )}
          {/* {imgLength > 10 ? (
            <li>
              <a href="#uploader">{Math.ceil(imgLength / 5)}</a>
            </li>
          ) : (
            <li></li>
          )} */}
          <li
            className={"pagination-next " + disableNext}
            onClick={() => this.pageNew(1)}
          >
            Next
          </li>
        </ul>
      </nav>
    );
  };

  // Display the entire status table
  renderTable = () => {
    return (
      <div>
        <table className="dashboard-table">
          <colgroup>
            <col width="20%" />
            <col width="25%" />
            {/* <col width="20%" /> */}
            <col width="20%" />
            <col width="15%" />
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
              {/* <th>
                <a href="/">
                  Detected <i className="fa fa-caret-down"></i>
                </a>
              </th> */}
              <th>
                <a href="/">
                  Estimated <i className="fa fa-caret-down"></i>
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
        <div>{this.renderPagination()}</div>
      </div>
    );
  };

  // Display the entire progress window
  renderProgress = () => {
    const num_tasks = this.state.progresses.length;
    let uProgress =
      this.state.progresses.reduce((acc, progress) => {
        return acc + progress;
      }, 0) /
        (100 * num_tasks) || 0;
    let pProgress =
      this.state.results.reduce((acc, result) => {
        return result === "pending" ? acc : acc + 1;
      }, 0) / num_tasks || 0;
    return (
      <div className="work-feature-block row">
        <div
          data-closable="fade-out"
          className="todo-list-card column medium-9"
        >
          {/* <div className="card-divider">
            <h3>Progress</h3>
          </div> */}
          <div className="">{this.renderTable()}</div>
        </div>
        <div className="column medium-3 text-center">
          {uProgress === 1 ? (
            pProgress === 1 ? (
              <h4>Done</h4>
            ) : (
              <h4>Processing</h4>
            )
          ) : (
            <h4>Uploading</h4>
          )}
          <div className="row align-center">
            <Spinner
              intent={uProgress === 1 ? Intent.SUCCESS : Intent.PRIMARY}
              value={uProgress === 1 ? pProgress : uProgress}
              size={Spinner.SIZE_LARGE}
            />
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
        <Alert
          className="bp3-dark"
          cancelButtonText="Reset"
          confirmButtonText="Continue"
          icon="error"
          intent={Intent.DANGER}
          isOpen={this.state.alert}
          onCancel={() => {
            this.props.reset();
            this.setState({ alert: false });
          }}
          onConfirm={() => this.setState({ alert: false })}
        >
          {alertMsg.UploadError}
        </Alert>
      </div>
    );
  };

  renderUploader = () => {
    const {
      date,
      variety,
      EL_stage,
      vineyard,
      block_id
    } = this.props.formFields;
    const { images } = this.state;
    return (
      <div>
        <div className="work-feature-block row">
          <div className="column medium-8 inner-container">
            <div className="draggable-container">
              <input
                type="file"
                id="file-browser-input"
                name="file-browser-input"
                ref={input => (this.fileInput = input)}
                onDragOver={e => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                // onDrop={this.handleChange}
                onChange={this.handleChange}
                multiple
              />
              <div className="files-preview-container ip-scrollbar">
                {images.map((file, idx) => {
                  const url = URL.createObjectURL(file);
                  return (
                    <div key={`img${idx}`}>
                      <Tooltip content={file.name} position={Position.LEFT_TOP}>
                        <div className="file">
                          <img src={url} alt="preview" />
                          <div className="container">
                            {/* <span className="progress-bar">
                          {file.isUploading && <ProgressBar />}
                        </span> */}
                            <span
                              className="remove-btn"
                              onClick={() => this.removeLoadedFile(file)}
                            >
                              <Icon icon="cross" size={19} />
                            </span>
                          </div>
                        </div>
                        {/* <div className="row align-center">{file.name}</div> */}
                      </Tooltip>
                    </div>
                  );
                })}
              </div>
              <div className="helper-text">
                {images.length > 0 ? <p></p> : <p>Drag and Drop Images Here</p>}
              </div>
              <div className="file-browser-container">
                <AnchorButton
                  text="Browse"
                  intent={Intent.PRIMARY}
                  minimal={true}
                  onClick={() => this.fileInput.click()}
                />
              </div>
            </div>
          </div>

          <div className="column medium-4">
            <h2 className="work-feature-block-header">Dataset Description</h2>
            <h5>
              <ul className="clean-list margin-top-1">
                <li>Date: {date}</li>
                <li>Variety: {variety}</li>
                <li>EL Stage: {EL_stage}</li>
                <li>Vinyard: {vineyard}</li>
                <li>Block ID: {block_id}</li>
              </ul>
            </h5>

            <Recaptcha
              sitekey="6LdclscUAAAAAAfz1i9Y-OGf-y0_1zwclxHNjCr-"
              // render="explicit"
              // onloadCallback={this.recaptchaLoaded}
              verifyCallback={this.verifyRecaptcha}
            />
            <div className="row align-center">
              <button
                type="button"
                className="button radius bordered shadow margin-top-1 margin-right-1"
                onClick={() => {
                  this.props.setStage(1);
                }}
              >
                Back
              </button>
              <button
                type="button"
                className="button radius bordered shadow success margin-top-1"
                onClick={this.handleUpload}
              >
                Upload
              </button>
            </div>
            <br></br>
          </div>
        </div>
        <Alert
          className="bp3-dark"
          cancelButtonText="Back"
          confirmButtonText="Continue Upload"
          icon="warning-sign"
          intent={Intent.WARNING}
          isOpen={this.state.alert}
          onCancel={() => {
            // this.props.reset();
            this.setState({ alert: false });
          }}
          onConfirm={() => {
            this.setState({ alert: false, fileCheck: true });
          }}
        >
          {alertMsg.LargeFile}
        </Alert>
      </div>
    );
  };

  render() {
    const { stage } = this.state;
    if (stage === 2) {
      return <div id="uploader">{this.renderUploader()}</div>;
    } else if (stage === 3) {
      return <div>{this.renderProgress()}</div>;
    } else if (stage === 4) {
      this.props.setStage(4);
    }
  }
}

export default ImageUpload;

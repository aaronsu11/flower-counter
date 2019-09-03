import React, { Component } from "react";
import Recaptcha from "react-recaptcha";
import { storage } from "../firebase/firebase";

class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recaptcha: false,
      image: null,
      url: "",
      progress: 0
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }
  handleChange = e => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      this.setState(() => ({ image }));
    }
  };
  handleUpload = () => {
    if (this.state.recaptcha === false) {
      alert("Please verify recaptcha");
    } else {
      const { image } = this.state;
      const uploadTask = storage.ref(`images/${image.name}`).put(image);
      uploadTask.on(
        "state_changed",
        snapshot => {
          // progrss function ....
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          this.setState({ progress });
        },
        error => {
          // error function ....
          console.log(error);
        },
        () => {
          // complete function ....
          storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then(url => {
              console.log(url);
              this.setState({ url });
            });
        }
      );
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
        <input type="file" onChange={this.handleChange} />
        <Recaptcha
          sitekey="6LfWDbQUAAAAAMBcLHa6ld7lnDowMvC9gA-EKxga"
          // render="explicit"
          // onloadCallback={this.recaptchaLoaded}
          verifyCallback={this.verifyRecaptcha}
        />
        <button onClick={this.handleUpload}>Upload</button>
        <br />
        <img
          src={this.state.url || "http://via.placeholder.com/640x480"}
          alt="Uploaded images"
          height="480"
          width="640"
        />
      </div>
    );
  }
}

export default ImageUpload;

import React, { Component } from "react";

// import Rank from "../components/Rank/Rank";
import { BreadcrumbNav } from "../components/BreadcrumbNav/BreadcrumbNav";
import DatasetProfile from "../components/DatasetProfile/DatasetProfile";
import ImageUpload from "../components/ImageUpload/ImageUpload";
import DatasetReport from "../components/DatasetReport/DatasetReport";
// import { Link, Button, Colors } from "react-foundation";

const initialState = {
  stage: 1,
  batchID: "",
  formFields: {
    name: "",
    email: "",
    date: "",
    variety: "chardonnay",
    EL_stage: 15,
    vineyard: "",
    block_id: ""
  }
};

// Counter container control steps and dataset info
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    // console.log(this.props);
    // Check if local storage data available from last refresh
    const time = localStorage.getItem("saveTime");
    const saveTime = time && new Date(parseInt(time));
    const now = new Date();
    const dataAge = Math.round((now - saveTime) / (1000 * 60)); // in minutes
    console.log(dataAge);
    if (dataAge < 10) {
      console.log("Using data from local storage");
      if (localStorage.getItem("formFields")) {
        this.state.formFields = JSON.parse(localStorage.getItem("formFields"));
      }
      if (localStorage.getItem("stage")) {
        this.state.stage = JSON.parse(localStorage.getItem("stage"));
      }
    }

    if (this.props.isSignedIn) {
      this.state.formFields.name = this.props.user.name;
      this.state.formFields.email = this.props.user.email;
    }
  }

  componentDidUpdate() {
    // console.log(this.state);
  }

  resetCounter = () => {
    if (localStorage.getItem("saveTime")) {
      console.log("clean local storage");
      localStorage.removeItem("saveTime");
      localStorage.removeItem("stage");
    }
    this.setState(initialState);
  };

  resetForm = () => {
    if (localStorage.getItem("formFields")) {
      console.log("clean form storage");
      localStorage.removeItem("formFields");
      // localStorage.removeItem("formTime");
    }
    this.resetCounter();
    console.log(this.state);
  };

  setStage = stage => {
    this.setState({ stage });
    localStorage.setItem("stage", stage);
    localStorage.setItem("saveTime", Date.now());
  };

  setBatchID = id => {
    this.setState({ batchID: id });
  };

  setResults = (names, results) => {
    this.setState({ imageNames: names, results: results });
  };

  saveForm = formFields => {
    this.setState({ formFields: formFields });
    localStorage.setItem("formFields", JSON.stringify(formFields));
    // localStorage.setItem("formTime", Date.now());
  };

  renderLayout = () => {
    const { user } = this.props;
    const { stage, formFields, batchID } = this.state;
    // console.log(this.state);
    if (stage === 4) {
      return (
        <div>
          <DatasetReport
            user={user}
            formFields={formFields}
            batchID={batchID}
            setStage={this.setStage}
            apiURL={this.props.apiURL}
            reset={this.resetCounter}
          />
        </div>
      );
    } else if (stage >= 2) {
      return (
        <div>
          {/* <Rank name={user.name} entries={user.entries} /> */}
          <ImageUpload
            user={user}
            formFields={formFields}
            setStage={this.setStage}
            setBatchID={this.setBatchID}
            apiURL={this.props.apiURL}
            reset={this.resetCounter}
          />
        </div>
      );
    } else {
      return (
        <div>
          <DatasetProfile
            user={user}
            formFields={formFields}
            setStage={this.setStage}
            saveForm={this.saveForm}
            reset={this.resetForm}
          />
        </div>
      );
    }
  };

  render() {
    // console.log(this.state);
    return (
      <div>
        <BreadcrumbNav stage={this.state.stage} />
        {this.renderLayout()}
      </div>
    );
  }
}

export default Counter;

import React, { Component } from "react";

// import Rank from "../components/Rank/Rank";
import { BreadcrumbNav } from "../components/BreadcrumbNav/BreadcrumbNav";
import DatasetProfile from "../components/DatasetProfile/DatasetProfile";
import ImageUpload from "../components/ImageUpload/ImageUpload";

// import { Link, Button, Colors } from "react-foundation";

const initialState = {
  dataSaved: false,
  formFields: {
    name: "",
    email: "",
    date: "",
    variety: "chardonay",
    EL_stage: 15,
    vineyard: "",
    block_id: ""
  }
};

class Home extends Component {
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
    if (dataAge < 5) {
      console.log("Using data from local storage");
      if (localStorage.getItem("formFields")) {
        this.state.formFields = JSON.parse(localStorage.getItem("formFields"));
      }
      if (localStorage.getItem("dataSaved")) {
        this.state.dataSaved = JSON.parse(localStorage.getItem("dataSaved"));
      }
    }

    if (this.props.isSignedIn) {
      this.state.formFields.name = this.props.user.name;
      this.state.formFields.email = this.props.user.email;
    }
  }

  componentDidMount() {}

  componentDidUpdate() {
    localStorage.setItem("dataSaved", this.state.dataSaved);
    localStorage.setItem("saveTime", Date.now());
  }

  isSaved = saved => {
    this.setState({ dataSaved: saved });
  };

  saveForm = formFields => {
    this.setState({ formFields: formFields });
    this.isSaved(true);
  };

  renderLayout = () => {
    const { user } = this.props;
    const { dataSaved, formFields } = this.state;
    // console.log(this.state);
    if (dataSaved) {
      return (
        <div>
          {/* <Rank name={user.name} entries={user.entries} /> */}
          <ImageUpload
            user={user}
            formFields={formFields}
            isSaved={this.isSaved}
          />
        </div>
      );
    } else {
      return (
        <div>
          <DatasetProfile
            user={user}
            formFields={formFields}
            saveForm={this.saveForm}
          />
        </div>
      );
    }
  };

  render() {
    return (
      <div>
        <BreadcrumbNav state={this.state.dataSaved} />
        {this.renderLayout()}
      </div>
    );
  }
}

export default Home;

import React, { Component } from "react";
import "./DatasetProfile.css";

import { ProfileCard } from "./ProfileCard";
// import ImageUpload from "../ImageUpload/ImageUpload";

const emailRegex = RegExp(
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);

const formValid = ({ formErrors, ...rest }) => {
  let valid = true;

  // validate form errors being empty
  Object.values(formErrors).forEach(val => {
    val.length > 0 && (valid = false);
  });

  // validate the form was filled out
  Object.values(rest).forEach(val => {
    val === null && (valid = false);
  });

  return valid;
};

class DatasetProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSaved: false,
      recaptcha: false,
      name: "",
      email: "",
      date: "",
      variety: "chardonay",
      EL_stage: "15",
      vineyard: "",
      block_id: "",
      formErrors: {
        name: "",
        email: "",
        date: "",
        variety: "",
        EL_stage: "",
        vineyard: "",
        block_id: ""
      }
    };
  }

  handleSubmit = e => {
    e.preventDefault();

    const { user } = this.props;
    // console.log(this.props);
    if (user !== null && user.id > 0) {
      this.setState({
        name: user.name,
        email: user.email
      });
    }
    if (formValid(this.state)) {
      this.setState({ dataSaved: true });
      this.props.isSaved(true);
      console.log(`
        --SUBMITTING--
        Data Saved: ${this.state.dataSaved}
        Name: ${this.state.name}
        Email: ${this.state.email}
        Date: ${this.state.date}
        Variety: ${this.state.variety}
        EL Stage: ${this.state.EL_stage}
        Vineyard: ${this.state.vineyard},
        Block ID: ${this.state.block_id},
      `);
    } else {
      this.props.isSaved(false);
      console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
    }
  };

  // Set Error Messages
  handleChange = e => {
    e.preventDefault();
    // console.log(this.state);
    const { name, value } = e.target;
    let formErrors = { ...this.state.formErrors };

    switch (name) {
      case "name":
        formErrors.name = value.length < 1 ? "Minimum 1 characater" : "";
        break;
      case "email":
        formErrors.email = emailRegex.test(value)
          ? ""
          : "Invalid email address";
        break;
      case "date":
        break;
      default:
        break;
    }
    // this.setState({ formErrors, [name]: value }, () => console.log(this.state));
    this.setState({ formErrors, [name]: value });
  };

  renderUser = () => {
    const { formErrors } = this.state;
    const { user } = this.props;
    if (user !== null && user.id > 0) {
      return;
    } else {
      return (
        <div>
          <div className="name">
            <label htmlFor="name">Name</label>
            <input
              className={formErrors.name.length > 0 ? "error" : null}
              placeholder="Name"
              value={this.state.name}
              type="text"
              name="name"
              required
              onChange={this.handleChange}
            />
            {formErrors.name.length > 0 && (
              <span className="errorMessage">{formErrors.name}</span>
            )}
          </div>

          <div className="email">
            <label htmlFor="email">Email</label>
            <input
              className={formErrors.email.length > 0 ? "error" : null}
              placeholder="Email"
              value={this.state.email}
              type="email"
              name="email"
              required
              onChange={this.handleChange}
            />
            {formErrors.email.length > 0 && (
              <span className="errorMessage">{formErrors.email}</span>
            )}
          </div>
        </div>
      );
    }
  };

  renderProfile = () => {
    const { formErrors } = this.state;
    if (this.state.dataSaved) {
      return (
        <div className="wrapper mb3">
          <p className="f6 white db">Profile saved</p>
          <div>
            <ProfileCard state={this.state} />
            <button
              className="pbutton center"
              onClick={() => {
                this.setState({ dataSaved: false });
                // this.props.isSaved(false);
              }}
            >
              Edit
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="wrapper mb3">
          <p className="f6 white db">
            Please create your dateset profile first
          </p>
          <div className="profile form-wrapper tl">
            <h1>Create Dataset</h1>
            <form onSubmit={this.handleSubmit}>
              {this.renderUser()}
              <div className="date">
                <label htmlFor="date">Date</label>
                <input
                  className="pa2 input-reset ba bg-transparent w-100"
                  value={this.state.date}
                  type="date"
                  name="date"
                  id="date"
                  onChange={this.handleChange}
                  required
                />
                {formErrors.date.length > 0 && (
                  <span className="errorMessage">{formErrors.date}</span>
                )}
              </div>

              <div className="variety mt2">
                <label htmlFor="variety">Variety</label>
                <select
                  className="pa2 input-reset ba bg-transparent w-100"
                  value={this.state.variety}
                  name="variety"
                  id="variety"
                  onChange={this.handleChange}
                  required
                >
                  <option value="chardonay"> Chardonay </option>
                  <option value="shiraz"> Shiraz </option>
                </select>
              </div>

              <div className="EL_stage mt2 ml2">
                <label htmlFor="EL_stage">EL-Stage</label>
                <input
                  className="pa2 input-reset ba bg-transparent w-100"
                  value={this.state.EL_stage}
                  type="number"
                  name="EL_stage"
                  id="EL_stage"
                  min="15"
                  max="20"
                  onChange={this.handleChange}
                  required
                />
              </div>

              <div className="vineyard mt2">
                <label htmlFor="vineyard">Vineyard</label>
                <input
                  className="pa2 input-reset ba bg-transparent w-100"
                  value={this.state.vineyard}
                  type="text"
                  name="vineyard"
                  id="vineyard"
                  maxLength="100"
                  onChange={this.handleChange}
                  required
                />
              </div>

              <div className="block_id mt2 mb3">
                <label htmlFor="block_id">Block ID</label>
                <input
                  className="pa2 input-reset ba bg-transparent w-100"
                  value={this.state.block_id}
                  type="text"
                  name="block_id"
                  id="block_id"
                  maxLength="100"
                  onChange={this.handleChange}
                  required
                />
              </div>

              <div className="createAccount">
                <button className="pbutton" type="submit">
                  Save Dataset
                </button>
                <div className="lh-copy mt0">
                  <p className="f6 link dim black db pointer">
                    Already have an account?
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      );
    }
  };

  render() {
    return <div>{this.renderProfile()}</div>;
  }
}

export default DatasetProfile;

import React, { Component } from "react";
import {
  // Position,
  Button,
  Card,
  Elevation,
  Divider,
  // Intent,
  FormGroup,
  // InputGroup,
  Classes,
  H3,
  H5
} from "@blueprintjs/core";
// import { DateInput } from "@blueprintjs/datetime";
import "./DatasetProfile.scss";

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

const initialState = {
  name: "",
  email: "",
  date: "",
  variety: "chardonnay",
  EL_stage: 15,
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

class DatasetProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props.formFields,
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
    // console.log(props);
  }

  resetForm = () => {
    this.setState(initialState);
    this.props.reset();
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

  handleSubmit = e => {
    e.preventDefault();

    const { formErrors, ...formFields } = this.state;
    if (formValid(this.state)) {
      this.props.saveForm(formFields);
      this.props.setStage(2);
      console.log(`
        --SUBMITTING--
        Name: ${formFields.name}
        Email: ${formFields.email}
        Date: ${formFields.date}
        Variety: ${formFields.variety}
        EL Stage: ${formFields.EL_stage}
        Vineyard: ${formFields.vineyard},
        Block ID: ${formFields.block_id},
      `);
    } else {
      console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
    }
  };

  renderUser = () => {
    const { formErrors } = this.state;
    const { user } = this.props;
    if (user.uid) {
      return;
    } else {
      return (
        <div className="group-wrapper">
          <FormGroup
            className="input"
            helperText={formErrors.name}
            label="Name"
            labelFor="text-input"
          >
            <input
              placeholder="Name"
              value={this.state.name}
              type="text"
              name="name"
              required
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup
            className="input"
            helperText={formErrors.email}
            label="Email"
            labelFor="text-input"
          >
            <input
              placeholder="Email"
              value={this.state.email}
              type="email"
              name="email"
              required
              onChange={this.handleChange}
            />
          </FormGroup>
          {/* <div className="name">
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
          </div> */}

          {/* <div className="email">
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
          </div> */}
        </div>
      );
    }
  };

  renderProfile = () => {
    const { formErrors } = this.state;
    const { user } = this.props;
    return (
      <div className="wrapper">
        <Card
          interactive={false}
          elevation={Elevation.THREE}
          className="card-wrapper"
        >
          <H5>Hi, {user.uid ? user.name : "Guest"}</H5>
          <p>
            Please fill in the details of the dataset you want to estimate, and
            follow the instructions.
          </p>
          {user.uid ? null : (
            <p>
              <a href="/register" className="pointer">
                Register
              </a>{" "}
              to enjoy more functionalities!
            </p>
          )}
          <Divider />
          <form onSubmit={this.handleSubmit} className="form-wrapper">
            {/* <p className="">
            Please create your dateset profile first
          </p> */}

            <H3 className="form-title">Create Dataset</H3>
            {/* <FormGroup
                helperText={true && "Helper text with details..."}
                inline={false}
                intent={Intent.NONE}
                label={true && "Label"}
                labelFor="text-input"
                labelInfo={true && "(required)"}
              >
                <InputGroup
                  id="text-input"
                  placeholder="Placeholder text"
                  intent={Intent.NONE}
                  type={"text"}
                  fill={false}
                />
              </FormGroup> */}
            {this.renderUser()}
            <div className="group-wrapper">
              <FormGroup
                className="input"
                helperText={formErrors.date}
                label="Date Collected"
                labelFor="text-input"
              >
                <input
                  value={this.state.date}
                  type="date"
                  name="date"
                  id="date"
                  onChange={this.handleChange}
                  required
                />
              </FormGroup>
              <FormGroup
                className="small-input"
                helperText={formErrors.variety}
                label="Variety"
                labelFor="text-input"
              >
                <select
                  value={this.state.variety}
                  name="variety"
                  id="variety"
                  onChange={this.handleChange}
                  required
                >
                  <option value="chardonnay"> Chardonnay </option>
                  <option value="shiraz"> Shiraz </option>
                </select>
              </FormGroup>
              <FormGroup
                className="small-input"
                helperText={formErrors.EL_stage}
                label="EL Stage"
                labelFor="text-input"
              >
                <input
                  value={this.state.EL_stage}
                  type="number"
                  name="EL_stage"
                  id="EL_stage"
                  min="15"
                  max="20"
                  onChange={this.handleChange}
                  required
                />
              </FormGroup>
              <FormGroup
                className="input"
                helperText={formErrors.vineyard}
                label="Vineyard ID"
                labelFor="text-input"
              >
                <input
                  value={this.state.vineyard}
                  type="text"
                  name="vineyard"
                  id="vineyard"
                  maxLength="100"
                  onChange={this.handleChange}
                  required
                />
              </FormGroup>
              <FormGroup
                className="input"
                helperText={formErrors.block}
                label="Block ID"
                labelFor="text-input"
              >
                <input
                  value={this.state.block_id}
                  type="text"
                  name="block_id"
                  id="block_id"
                  maxLength="100"
                  onChange={this.handleChange}
                  required
                />
              </FormGroup>
            </div>
            <div className="profile-button">
              <Button
                text="Save dataset profile and continue"
                className={Classes.BUTTON}
                rightIcon="arrow-right"
                intent="success"
                minimal={true}
                type="submit"
              />
              <Divider />
              {user.uid ? null : (
                <div className="lh-copy mt0">
                  <a href="/signin" className="pointer small">
                    Already have an account?
                  </a>
                </div>
              )}
            </div>
          </form>
        </Card>
      </div>

      // <div className="date">
      //   <label htmlFor="date">Date</label>
      //   <input
      //     className="input-reset"
      //     value={this.state.date}
      //     type="date"
      //     name="date"
      //     id="date"
      //     onChange={this.handleChange}
      //     required
      //   />
      //   {formErrors.date.length > 0 && (
      //     <span className="errorMessage">{formErrors.date}</span>
      //   )}
      // </div>

      // <div className="variety mt2">
      //   <label htmlFor="variety">Variety</label>
      //   <select
      //     className="pa2 input-reset ba bg-transparent w-100"
      //     value={this.state.variety}
      //     name="variety"
      //     id="variety"
      //     onChange={this.handleChange}
      //     required
      //   >
      //     <option value="chardonnay"> Chardonnay </option>
      //     <option value="shiraz"> Shiraz </option>
      //   </select>
      // </div>

      // <div className="EL_stage mt2 ml2">
      //   <label htmlFor="EL_stage">EL-Stage</label>
      //   <input
      //     className="pa2 input-reset ba bg-transparent w-100"
      //     value={this.state.EL_stage}
      //     type="number"
      //     name="EL_stage"
      //     id="EL_stage"
      //     min="15"
      //     max="20"
      //     onChange={this.handleChange}
      //     required
      //   />
      // </div>

      // <div className="vineyard mt2">
      //   <label htmlFor="vineyard">Vineyard</label>
      //   <input
      //     className="pa2 input-reset ba bg-transparent w-100"
      //     value={this.state.vineyard}
      //     type="text"
      //     name="vineyard"
      //     id="vineyard"
      //     maxLength="100"
      //     onChange={this.handleChange}
      //     required
      //   />
      // </div>

      // <div className="block_id mt2 mb3">
      //   <label htmlFor="block_id">Block ID</label>
      //   <input
      //     className="pa2 input-reset ba bg-transparent w-100"
      //     value={this.state.block_id}
      //     type="text"
      //     name="block_id"
      //     id="block_id"
      //     maxLength="100"
      //     onChange={this.handleChange}
      //     required
      //   />
      // </div>

      // <div className="createAccount">
      //   <button
      //     type="submit"
      //     className="button radius bordered shadow success"
      //   >
      //     Save Dataset
      //   </button>
      //   <button type="button" onClick={this.resetForm}>
      //       Reset
      //     </button>
      // </div>
    );
  };

  render() {
    return <div className="padding-top-1">{this.renderProfile()}</div>;
  }
}

export default DatasetProfile;

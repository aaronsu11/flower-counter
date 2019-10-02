import React, { Component } from "react";
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
      name: props.formFields.name,
      email: props.formFields.email,
      date: props.formFields.date,
      variety: props.formFields.variety,
      EL_stage: props.formFields.EL_stage,
      vineyard: props.formFields.vineyard,
      block_id: props.formFields.block_id,
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
    // props.setStage(1);
  }

  componentDidUpdate() {
    // const { formErrors, ...formFields } = this.state;
    // localStorage.setItem("formFields", JSON.stringify(formFields));
    // localStorage.setItem("formTime", Date.now());
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

    const { user } = this.props;
    // console.log(this.props);
    // If an user is logged in, update name and email
    if (user !== null && user.id > 0) {
      this.setState({
        name: user.name,
        email: user.email
      });
    }

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
    return (
      <div className="wrapper mb3">
        {/* <p className="">
            Please create your dateset profile first
          </p> */}
        <div className="form-wrapper">
          <h1>Create Dataset</h1>
          <form onSubmit={this.handleSubmit}>
            {this.renderUser()}
            <div className="date">
              <label htmlFor="date">Date</label>
              <input
                className="input-reset"
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
                <option value="chardonnay"> Chardonnay </option>
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
              <button
                type="submit"
                className="button radius bordered shadow success"
              >
                Save Dataset
              </button>
              {/* <button type="button" onClick={this.resetForm}>
                Reset
              </button> */}
              <div className="lh-copy mt0">
                <a href="/signin" className="pointer">
                  Already have an account?
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
    // }
  };

  render() {
    return <div className="padding-top-1">{this.renderProfile()}</div>;
  }
}

export default DatasetProfile;

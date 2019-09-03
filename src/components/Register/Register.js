import React from "react";
import Recaptcha from "react-recaptcha";

const formValid = ({ recaptcha }) => {
  let valid = true;

  if (recaptcha === false) {
    alert("Please verify recaptcha");
    valid = false;
  }

  return valid;
};

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recaptcha: false,
      email: "",
      password: "",
      name: ""
    };
  }

  onNameChange = event => {
    this.setState({ name: event.target.value });
  };

  onEmailChange = event => {
    this.setState({ email: event.target.value });
  };

  onPasswordChange = event => {
    this.setState({ password: event.target.value });
  };

  onSubmitRegister = () => {
    console.log(this.state);
    if (formValid(this.state)) {
      fetch(this.props.hostURL + "register", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password,
          name: this.state.name
        })
      })
        .then(response => response.json())
        .then(user => {
          if (user.id) {
            this.props.login(user, false);
            // this.props.onRouteChange("home");
            this.props.history.push("/home");
          }
        });
    } else {
      // console.log(this.state);
      console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
    }
  };

  verifyRecaptcha = res => {
    if (res) {
      this.setState({ recaptcha: true });
    }
  };

  render() {
    return (
      <article className="br3 ba bg-white b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80">
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Register</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="name">
                  Name
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="text"
                  name="name"
                  id="name"
                  maxLength="100"
                  onChange={this.onNameChange}
                  required
                />
              </div>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">
                  Email
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="email"
                  name="email-address"
                  id="email-address"
                  onChange={this.onEmailChange}
                  required
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">
                  Password
                </label>
                <input
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="password"
                  name="password"
                  id="password"
                  minLength="3"
                  onChange={this.onPasswordChange}
                  required
                />
              </div>
            </fieldset>
            <Recaptcha
              sitekey="6LfWDbQUAAAAAMBcLHa6ld7lnDowMvC9gA-EKxga"
              // render="explicit"
              // onloadCallback={this.recaptchaLoaded}
              verifyCallback={this.verifyRecaptcha}
            />
            <div className="">
              <input
                onClick={this.onSubmitRegister}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                value="Register"
              />
            </div>
          </div>
        </main>
      </article>
    );
  }
}

export default Register;

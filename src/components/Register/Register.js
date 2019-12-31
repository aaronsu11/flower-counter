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
      <div className="row column padding-top-3">
        <div className="login-box">
          <div className="row collapse expanded">
            <div className="small-12 medium-6 column small-order-2 medium-order-1">
              <div className="login-box-form-section">
                <h1 className="login-box-title">Sign up</h1>
                <input
                  className="login-box-input"
                  type="text"
                  name="name"
                  placeholder="Name"
                  id="name"
                  maxLength="100"
                  onChange={this.onNameChange}
                  required
                />
                <input
                  className="login-box-input"
                  type="email"
                  name="email-address"
                  placeholder="E-mail"
                  id="email-address"
                  onChange={this.onEmailChange}
                  required
                />
                <input
                  className="login-box-input"
                  type="password"
                  name="password"
                  placeholder="Password"
                  id="password"
                  minLength="3"
                  onChange={this.onPasswordChange}
                  required
                />
                <input
                  className="login-box-input"
                  type="password"
                  name="password2"
                  placeholder="Retype password"
                />
                <Recaptcha
                  className="margin-bottom-1"
                  sitekey="6LdclscUAAAAAAfz1i9Y-OGf-y0_1zwclxHNjCr-"
                  // render="explicit"
                  // onloadCallback={this.recaptchaLoaded}
                  verifyCallback={this.verifyRecaptcha}
                />
                <input
                  className="login-box-submit-button"
                  type="submit"
                  name="signup_submit"
                  value="Sign me up"
                  onClick={this.onSubmitRegister}
                />
              </div>
              <div className="or">OR</div>
            </div>
            <div className="small-12 medium-6 column small-order-1 medium-order-2 login-box-social-section">
              <div className="login-box-social-section-inner">
                <span className="login-box-social-headline">
                  Sign up with
                  <br />
                  your social network
                </span>
                <div className="login-box-social-button-facebook">
                  Sign up with facebook
                </div>
                <div className="login-box-social-button-twitter">
                  Sign up with Twitter
                </div>
                <div className="login-box-social-button-google">
                  Sign up with Google+
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;

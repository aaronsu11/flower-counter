import React from "react";
// import firebase from "firebase";
import firebase, { auth } from "../firebase/firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

import SigninHeader from "../../assets/SigninHeader.png";

class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signInEmail: "",
      signInPassword: "",
      firebaseAuth: false
    };
  }

  uiConfig = {
    signInFlow: "popup",
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
    callbacks: {
      signInSuccessWithAuthResult: () => false
    }
  };

  onEmailChange = event => {
    this.setState({ signInEmail: event.target.value });
  };

  onPasswordChange = event => {
    this.setState({ signInPassword: event.target.value });
  };

  onSubmitSignIn = () => {
    fetch(this.props.hostURL + "signin", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: this.state.signInEmail,
        password: this.state.signInPassword,
        auth: this.state.firebaseAuth
      })
    })
      .then(response => response.json())
      .then(user => {
        if (user.id) {
          this.props.login(user, this.firebaseAuth);
          // this.props.onRouteChange("home");
          this.props.history.push("/home");
        }
      });
  };

  componentDidMount = () => {
    auth.onAuthStateChanged(user => {
      const authState = !!user;
      this.setState({ firebaseAuth: authState });
      if (authState) {
        this.setState({ signInEmail: user.email });
        // console.log(user.email);
        this.onSubmitSignIn();
      }
    });
  };

  render() {
    // console.log(this.props);
    return (
      <div className="row column medium-5 large-4 padding-top-1">
        <div className="form-registration">
          <figure className="form-registration-img">
            <img src={SigninHeader} alt="Signin header" />
            <figcaption className="form-registration-img-caption">
              Experience everything Yeti+ has to offer through Yeti e-shoppe and
              our related apps.
            </figcaption>
          </figure>

          <div className="form-registration-group">
            <input
              className="form-registration-input"
              type="email"
              placeholder="Email"
              name="email-address"
              id="email-address"
              onChange={this.onEmailChange}
            />
            <input
              className="form-registration-input"
              type="password"
              placeholder="Password"
              name="password"
              id="password"
              onChange={this.onPasswordChange}
            />
            <input
              className="form-registration-submit-button"
              type="submit"
              value="Sign in"
              onClick={this.onSubmitSignIn}
            />
            <p className="or-divider">
              <span>or</span>
            </p>
            <div className="row align-center">
              {this.state.firebaseAuth ? (
                <button onClick={() => auth.signOut()}>Signout</button>
              ) : (
                <StyledFirebaseAuth
                  uiConfig={this.uiConfig}
                  firebaseAuth={auth}
                />
              )}
            </div>

            {/* <a className="form-registration-social-button" href="#">
              <i className="fa fa-facebook-official" aria-hidden="true"></i>{" "}
              Sign Up With facebook
            </a> */}
            <p className="form-registration-member-signin">
              Not a member yet? <a href="/register">Register</a>
            </p>
            <p className="form-registration-terms">
              <a href="/">Terms &amp; Conditions</a>|<a href="/">Privacy</a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Signin;

import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//Imported style files (Zurb Foundation framework)
import "./App.scss";

//Imported inidividual components
import Navigation from "./components/Navigation/Navigation";

//Imported containers
// import { ProtectedRoute } from "./containers/ProtectedRoute";
import Counter from "./containers/Counter";
import AboutPage from "./components/AboutPage/AboutPage";
import ContactPage from "./components/ContactPage/ContactPage";

// const hostURL = "https://cryptic-beyond-77196.herokuapp.com/"; //Heroku server
// const hostURL = "https://auth-dot-flower-counter.appspot.com/"; //GCP server
const consoleURL = "http://console.flowercounter.yieldestimation.com/";
// const apiURL = "http://localhost:5000/";
const apiURL = "https://flower-counter.appspot.com/";

const initialState = {
  isSignedIn: false,
  user: {
    uid: "",
    email: "",
    name: ""
  }
};

// App container control user info
class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  login = user => {
    localStorage.setItem("dataSaved", false);
    localStorage.setItem("saveTime", Date.now());
    this.setState({
      isSignedIn: true,
      user
    });
    console.log("log in");
  };

  logout = () => {
    // auth.signOut();
    this.setState(initialState);
    console.log("log out");
  };

  // componentDidMount = () => {};

  // Main routing function
  render() {
    const { user, isSignedIn } = this.state;
    return (
      <Router>
        <div className="App" id="hero">
          <div id="hero-overlay">
            <Navigation isSignedIn={isSignedIn} logout={this.logout} />
            {/* <Particles className="particles" params={particlesOptions} /> */}
            <Switch>
              <Route
                exact
                path="/"
                render={props => (
                  <Counter
                    {...props}
                    login={this.login}
                    user={user}
                    isSignedIn={isSignedIn}
                    apiURL={apiURL}
                  />
                )}
              />
              <Route exact path="/about" render={props => <AboutPage />} />
              <Route exact path="/contact" render={props => <ContactPage />} />
              {/* <ProtectedRoute
                exact
                path="/dashboard/:id"
                component={Dashboard}
                user={user}
                isSignedIn={isSignedIn}
              /> */}
              <Route
                exact
                path="/login"
                render={props => {
                  window.location.href =
                    consoleURL + "auth/login-page?source=home";
                  // <Signin
                  //   {...props}
                  //   hostURL={hostURL}
                  //   isSignedIn={isSignedIn}
                  //   login={this.login}
                  // />
                }}
              />
              <Route
                exact
                path="/register"
                render={props => {
                  window.location.href =
                    consoleURL + "auth/register-page?source=home";
                  // <Register
                  //   {...props}
                  //   hostURL={hostURL}
                  //   isSignedIn={isSignedIn}
                  //   login={this.login}
                  // />
                }}
              />
              <Route
                exact
                path="/console"
                render={props => {
                  window.location.href = consoleURL + "admin";
                }}
              />
              <Route
                exact
                path="/logout"
                render={props => {
                  window.location.href = consoleURL + "admin/logout";
                }}
              />
              <Route path="*" component={() => "404 NOT FOUND"} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;

import React, { Component } from "react";
// import Particles from "react-particles-js";
import { auth } from "./components/firebase/firebase";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// import Foundation, { Button, Colors } from "react-foundation";

//Imported style files (Zurb Foundation framework)
import "./App.scss";

//Imported inidividual components
import Navigation from "./components/Navigation/Navigation";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
// import Logo from "./components/Logo/Logo";
import Rank from "./components/Rank/Rank";

//Imported containers
import { ProtectedRoute } from "./containers/ProtectedRoute";
import Counter from "./containers/Counter";
import Dashboard from "./containers/Dashboard";

// const hostURL = "https://cryptic-beyond-77196.herokuapp.com/"; //Heroku server
const hostURL = "https://affable-tangent-247104.appspot.com/"; //GCP server
// const apiURL = "http://localhost:5000/";
const apiURL = "https://python-dot-affable-tangent-247104.appspot.com/";

// const particlesOptions = {
// };

const initialState = {
  isAuth: false,
  isSignedIn: false,
  user: {
    id: 0,
    name: "",
    email: "",
    entries: 0,
    joined: ""
  }
};

// App container control user info
class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  login = (data, isAuth) => {
    localStorage.setItem("dataSaved", false);
    localStorage.setItem("saveTime", Date.now());
    this.setState({
      isAuth: isAuth,
      isSignedIn: true,
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    });
    // console.log(this.state);
  };

  logout = () => {
    auth.signOut();
    this.setState(initialState);
  };

  componentDidMount = () => {};

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
                    user={user}
                    isSignedIn={isSignedIn}
                    apiURL={apiURL}
                  />
                )}
              />
              <ProtectedRoute
                exact
                path="/home"
                component={Counter}
                user={user}
                isSignedIn={isSignedIn}
              />
              <ProtectedRoute
                exact
                path="/dashboard"
                component={Dashboard}
                user={user}
                isSignedIn={isSignedIn}
              />
              <Route
                path="/home/:id"
                render={props => (
                  <Rank {...props} name={user.name} entries={user.entries} />
                )}
              />
              <Route
                exact
                path="/signin"
                render={props => (
                  <Signin
                    {...props}
                    hostURL={hostURL}
                    isSignedIn={isSignedIn}
                    login={this.login}
                  />
                )}
              />
              <Route
                exact
                path="/register"
                render={props => (
                  <Register
                    {...props}
                    hostURL={hostURL}
                    isSignedIn={isSignedIn}
                    login={this.login}
                  />
                )}
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

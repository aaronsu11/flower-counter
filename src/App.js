import React, { Component } from "react";
import Particles from "react-particles-js";
import { auth } from "./components/firebase/firebase";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//Imported inidividual components
import Navigation from "./components/Navigation/Navigation";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
// import Logo from "./components/Logo/Logo";
import Rank from "./components/Rank/Rank";

//Imported containers
import { ProtectedRoute } from "./containers/ProtectedRoute";
import Home from "./containers/Home";

//Imported style files
import "./App.css";

const hostURL = "https://cryptic-beyond-77196.herokuapp.com/";

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
};

const initialState = {
  input: "",
  box: {},
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

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  login = (data, isAuth) => {
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
    this.setState(initialState);
    if (this.isAuth) {
      auth.signOut();
      this.setState({ isAuth: false });
    }
  };

  componentDidMount = () => {};

  // Main routing function
  render() {
    const { user, isSignedIn } = this.state;
    return (
      <Router>
        <div className="App">
          <Particles className="particles" params={particlesOptions} />
          <Navigation isSignedIn={isSignedIn} logout={this.logout} />
          <Switch>
            <Route
              exact
              path="/"
              render={props => (
                <Home {...props} user={user} isSignedIn={isSignedIn} />
              )}
            />
            <ProtectedRoute
              exact
              path="/home"
              component={Home}
              user={user}
              isSignedIn={isSignedIn}
            />
            <Route
              path="/home/:id"
              render={props => (
                <Rank
                  {...props}
                  name={this.state.user.name}
                  entries={this.state.user.entries}
                />
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
      </Router>
    );
  }
}

export default App;

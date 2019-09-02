import React, { Component } from "react";
import Particles from "react-particles-js";
// import Recaptcha from 'react-recaptcha';
import { auth } from "./components/firebase/firebase";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//Imported inidividual components
//import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from "./components/Navigation/Navigation";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import Logo from "./components/Logo/Logo";
//import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from "./components/Rank/Rank";
import DatasetProfile from "./components/DatasetProfile/DatasetProfile";

//Imported containers
import { ProtectedRoute } from "./containers/ProtectedRoute/ProtectedRoute";
import { Home } from "./containers/Home/Home";

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
  imageUrl: "",
  box: {},
  isAuth: false,
  isSignedIn: false,
  user: {
    id: "",
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
    console.log(this.state);
  };

  logout = () => {
    this.setState(initialState);
    if (this.isAuth) {
      auth.signOut();
      this.setState({ isAuth: false });
    }
  };

  // onInputChange = event => {
  //   this.setState({ input: event.target.value });
  // };

  onButtonSubmit = () => {
    // this.setState({imageUrl: this.state.input});
    //   fetch('http://localhost:3000/imageurl', {
    //     method: 'post',
    //     headers: {'Content-Type': 'application/json'},
    //     body: JSON.stringify({
    //       input: this.state.input
    //     })
    //   })
    //   .then(response => response.json())
    //   .then(response => {
    //     if (response) {
    //       fetch('http://localhost:3000/image', {
    //         method: 'put',
    //         headers: {'Content-Type': 'application/json'},
    //         body: JSON.stringify({
    //           id: this.state.user.id
    //         })
    //       })
    //         .then(response => response.json())
    //         .then(count => {
    //           this.setState(Object.assign(this.state.user, { entries: count}))
    //         })
    //         .catch(console.log)
    //     }
    //     this.displayFaceBox(this.calculateFaceLocation(response))
    //   })
    //   .catch(err => console.log(err));
  };

  componentDidMount = () => {};

  // Main render function
  render() {
    const { isSignedIn } = this.state;
    return (
      <Router>
        <div className="App">
          <Particles className="particles" params={particlesOptions} />
          <Navigation
            isSignedIn={isSignedIn}
            logout={this.logout}
            // onRouteChange={this.onRouteChange}
          />
          <Switch>
            <Route
              exact
              path="/"
              render={props => (
                <DatasetProfile
                  {...props}
                  // onRouteChange={this.onRouteChange}
                />
              )}
            />
            <ProtectedRoute
              exact
              path="/home"
              component={Home}
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
                  // onRouteChange={this.onRouteChange}
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
                  // onRouteChange={this.onRouteChange}
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

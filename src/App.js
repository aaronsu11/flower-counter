import React, { Component } from "react";
import Particles from "react-particles-js";
// import Recaptcha from 'react-recaptcha';
import { auth } from "./components/firebase/firebase";

//import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from "./components/Navigation/Navigation";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import Logo from "./components/Logo/Logo";
//import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from "./components/Rank/Rank";
import DatasetProfile from "./components/DatasetProfile/DatasetProfile";
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
  route: "casual",
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

  loadUser = data => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    });
  };

  calculateFaceLocation = data => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height
    };
  };

  displayFaceBox = box => {
    this.setState({ box: box });
  };

  onInputChange = event => {
    this.setState({ input: event.target.value });
  };

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

  onRouteChange = route => {
    switch (route) {
      case "casual":
        this.setState(initialState);
        auth.signOut();
        break;
      case "home":
        this.setState({ isSignedIn: true });
        break;
      default:
        this.setState(initialState);
        break;
    }
    this.setState({ route: route });
  };

  renderSelect = () => {
    //const { imageUrl, route, box } = this.state;
    const { route } = this.state;

    switch (route) {
      case "casual":
        return (
          <div>
            <Logo />
            <DatasetProfile onRouteChange={this.onRouteChange} />

            {/*
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
            */}
          </div>
        );

      case "home":
        return (
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />

            {/*
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />        
            */}
          </div>
        );

      case "signin":
        return (
          <div>
            <Signin
              hostURL={hostURL}
              loadUser={this.loadUser}
              onRouteChange={this.onRouteChange}
            />
          </div>
        );

      case "register":
        return (
          <div>
            <Register
              hostURL={hostURL}
              loadUser={this.loadUser}
              onRouteChange={this.onRouteChange}
            />
          </div>
        );

      default:
        return (
          <div>
            <p> No Match </p>
          </div>
        );
    }
  };

  componentDidMount = () => {
    console.log(this.state);
  };
  // Main render function
  render() {
    const { isSignedIn } = this.state;

    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {this.renderSelect()}
      </div>
    );
  }
}

export default App;

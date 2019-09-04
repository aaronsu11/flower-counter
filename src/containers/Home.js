import React, { Component } from "react";

// import Rank from "../components/Rank/Rank";
import DatasetProfile from "../components/DatasetProfile/DatasetProfile";
import ImageUpload from "../components/ImageUpload/ImageUpload";

// import { Link, Button, Colors } from "react-foundation";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSaved: false
    };
  }

  handleClick = e => {
    e.preventDefault();
    console.log("Clicked");
  };

  isSaved = saved => {
    this.setState({ dataSaved: saved });
  };

  renderLayout = () => {
    const { dataSaved } = this.state;
    const { user, isSignedin } = this.props;
    // console.log(dataSaved);
    if (isSignedin) {
      return (
        <div>
          {/* <Rank name={user.name} entries={user.entries} /> */}
          <DatasetProfile user={user} isSaved={this.isSaved} />
          {dataSaved === true ? <ImageUpload /> : <div></div>}
        </div>
      );
    } else {
      return (
        <div>
          <DatasetProfile user={user} isSaved={this.isSaved} />
          {/* {dataSaved === true ? <ImageUpload /> : <div></div>} */}
          <ImageUpload />
          {/* <div className="button-basics-example">
            <Link onClick={this.handleClick}>Learn More</Link>
            <Button color={Colors.SUCCESS}>Save</Button>
            <Button color={Colors.ALERT}>Delete</Button>
          </div> */}
        </div>
      );
    }
  };

  render() {
    return <div>{this.renderLayout()}</div>;
  }
}

export default Home;

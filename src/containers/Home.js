import React, { Component } from "react";

import Rank from "../components/Rank/Rank";
import DatasetProfile from "../components/DatasetProfile/DatasetProfile";
import ImageUpload from "../components/ImageUpload/ImageUpload";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSaved: false
    };
  }

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
          <Rank name={user.name} entries={user.entries} />
          <DatasetProfile user={user} isSaved={this.isSaved} />
          {dataSaved === true ? <ImageUpload /> : <div></div>}
        </div>
      );
    } else {
      return (
        <div>
          <DatasetProfile user={user} isSaved={this.isSaved} />
          {dataSaved === true ? <ImageUpload /> : <div></div>}
        </div>
      );
    }
  };

  render() {
    return <div>{this.renderLayout()}</div>;
  }
}

export default Home;

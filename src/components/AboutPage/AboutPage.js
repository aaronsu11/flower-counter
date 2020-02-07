import React, { Component } from "react";
import { Card, Elevation, Divider, H3, H5 } from "@blueprintjs/core";
// import { DateInput } from "@blueprintjs/datetime";
import "../DatasetProfile/DatasetProfile.scss";

class AboutPage extends Component {
  render() {
    return (
      <div className="padding-top-1">
        <div className="wrapper">
          <Card
            interactive={false}
            elevation={Elevation.THREE}
            className="card-wrapper"
          >
            <H5>Hi, </H5>
            <p>Thank you for using flower counter</p>
            <Divider />
            <form className="form-wrapper">
              {/* <p className="">
            Please create your dateset profile first
          </p> */}

              <H3 className="form-title">Flower Counter</H3>
              <p>
                Here is some information about the web app, algorithm and the
                team
              </p>
              <H3 className="form-title">What do we do</H3>
              <p>
                What do we do We aim to improve the update of technology in
                viticulture in a sustainable manner by developing new
                algorithms, tools, techniques and systems which will free up
                farmer time for doing what they love best - growing grapes and
                making good wine. We also aim to increase our understanding of
                the factors which govern yield, maturity and disease so that
                these challenges can be better tackled by the industry. The
                team’s aims are supported by Wine Australia through competitive
                grant funding and directed by a network of experienced mentors
                and collaborators across the Australian wine industry.
              </p>
              <div className="group-wrapper"></div>
              <div className="profile-button"></div>
            </form>
          </Card>
        </div>
      </div>
    );
  }
}

export default AboutPage;

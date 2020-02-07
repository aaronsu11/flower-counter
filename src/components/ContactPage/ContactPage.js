import React, { Component } from "react";
import { Card, Elevation, Divider, H3, H5 } from "@blueprintjs/core";
// import { DateInput } from "@blueprintjs/datetime";
import "../DatasetProfile/DatasetProfile.scss";

class ContactPage extends Component {
  render() {
    return (
      <div className="padding-top-1">
        <div className="wrapper">
          <Card
            interactive={false}
            elevation={Elevation.THREE}
            className="card-wrapper"
          >
            <form className="form-wrapper">
              <H3 className="form-title">Contact Us</H3>
              <Divider />
              <H5>Dr. Mark Whitty</H5>
              <br />
              <p>UNSW Mechanical and Manufacturing Engineering</p>
              <p>UNSW AUSTRALIA</p>
              <p>UNSW SYDNEY NSW 2052 AUSTRALIA</p>
              <p>T: +61 2 9385 4230</p>
              <p>E: m.whitty@unsw.edu.au</p>

              <div className="group-wrapper"></div>
              <div className="profile-button"></div>
            </form>
          </Card>
        </div>
      </div>
    );
  }
}

export default ContactPage;

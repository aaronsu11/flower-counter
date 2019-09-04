import React from "react";
import Tilt from "react-tilt";
import unsw_logo from "./unsw-logo.png";
import "./Logo.css";

const Logo = () => {
  return (
    <div className="ma4 mt0">
      <Tilt
        className="Tilt br2 shadow-2"
        options={{ max: 55 }}
        style={{ height: 100, width: 100 }}
      >
        <div className="Tilt-inner">
          <img style={{ paddingTop: "0px" }} alt="logo" src={unsw_logo} />
        </div>
      </Tilt>
    </div>
  );
};

export default Logo;

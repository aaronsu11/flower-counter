import React from "react";
import { NavLink } from "react-router-dom";

const Navigation = ({ isSignedIn, logout }) => {
  if (isSignedIn) {
    return (
      <nav style={{ display: "flex", justifyContent: "flex-end" }}>
        <NavLink to="/home">
          <p
            // onClick={() => onRouteChange("casual")}
            className="f4 link dim white underline pa3 pointer"
          >
            Home
          </p>
        </NavLink>
        <NavLink to="/">
          <p
            onClick={() => logout()}
            className="f4 link dim white underline pa3 pointer"
          >
            Sign Out
          </p>
        </NavLink>
      </nav>
    );
  } else {
    return (
      <nav style={{ display: "flex", justifyContent: "flex-end" }}>
        <NavLink to="/">
          <p
            // onClick={() => onRouteChange("casual")}
            className="f4 link dim white underline pa3 pointer"
          >
            Home
          </p>
        </NavLink>
        <NavLink to="/signin">
          <p
            // onClick={() => onRouteChange("signin")}
            className="f4 link dim white underline pa3 pointer"
          >
            Sign In
          </p>
        </NavLink>
        <NavLink to="/register">
          <p
            // onClick={() => onRouteChange("register")}
            className="f4 link dim white underline pa3 pointer"
          >
            Register
          </p>
        </NavLink>
      </nav>
    );
  }
};

export default Navigation;

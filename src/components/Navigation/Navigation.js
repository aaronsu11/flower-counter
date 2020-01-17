import React from "react";
import { NavLink } from "react-router-dom";

const Navigation = ({ isSignedIn, logout }) => {
  return (
    <nav>
      <nav className="top-bar topbar-responsive">
        <div className="top-bar-title">
          <ul className="menu simple vertical medium-horizontal">
            <span
              data-responsive-toggle="topbar-responsive"
              data-hide-for="medium"
            >
              <button className="menu-icon" type="button" data-toggle></button>
            </span>
            <NavLink className="topbar-responsive-logo margin-left-1" to="/">
              <strong>Flower Counter</strong>
            </NavLink>
            <li>
              <NavLink className="margin-left-1" to="/console">
                Console
              </NavLink>
            </li>
            <li>
              <NavLink to="/">About</NavLink>
            </li>
            <li>
              <NavLink to="/">Contact Us</NavLink>
            </li>
          </ul>
        </div>
        <div id="topbar-responsive" className="topbar-responsive-links">
          <div className="top-bar-right">
            {isSignedIn ? (
              <ul className="menu simple vertical medium-horizontal">
                <li>
                  <NavLink to="/console">
                    <button
                      type="button"
                      className="button hollow topbar-responsive-button"
                    >
                      Console
                    </button>
                  </NavLink>
                </li>
                <li>
                  <NavLink onClick={() => logout()} to="/logout">
                    Log out
                  </NavLink>
                </li>
              </ul>
            ) : (
              <ul className="menu simple vertical medium-horizontal">
                <li>
                  <NavLink to="/login">
                    <button
                      type="button"
                      className="button hollow topbar-responsive-button"
                    >
                      Log in
                    </button>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/register">Register</NavLink>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    </nav>
  );
};

export default Navigation;

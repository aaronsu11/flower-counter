import React from "react";
import { NavLink } from "react-router-dom";
import "./Navigation.css";

const Navigation = ({ isSignedIn, logout }) => {
  return (
    <nav>
      <div
        class="title-bar"
        data-responsive-toggle="realEstateMenu"
        data-hide-for="small"
      >
        <button class="menu-icon" type="button" data-toggle></button>
        <div class="title-bar-title">Menu</div>
      </div>

      <div class="top-bar" id="realEstateMenu">
        <div class="top-bar-left">
          <ul class="menu" data-responsive-menu="accordion">
            <li>
              <NavLink class="menu-text" to="/">
                <p>Flower Counter</p>
              </NavLink>
            </li>
            <li>
              <NavLink to="/">
                <p>Home</p>
              </NavLink>
            </li>
            <li>
              <NavLink to="/">
                <p>About</p>
              </NavLink>
            </li>
            <li>
              <NavLink to="/">
                <p>Contact Us</p>
              </NavLink>
            </li>
          </ul>
        </div>
        {isSignedIn ? (
          <div class="top-bar-right">
            <ul class="menu">
              <li>
                <NavLink to="/dashboard">
                  <p>Console</p>
                </NavLink>
              </li>
              <li>
                <NavLink to="/">
                  <p onClick={() => logout()}>Sign Out</p>
                </NavLink>
              </li>
            </ul>
          </div>
        ) : (
          <div class="top-bar-right">
            <ul class="menu">
              <li>
                <NavLink to="/signin">
                  <p>Sign In</p>
                </NavLink>
              </li>
              <li>
                <NavLink to="/register">
                  <p>Register</p>
                </NavLink>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

import React from "react";
import { Route, Redirect } from "react-router-dom";

export const ProtectedRoute = ({
  component: Component,
  isSignedIn,
  user,
  ...rest
}) => {
  // console.log("under PR");
  // console.log(rest);
  console.log(user);
  return (
    <Route
      {...rest}
      render={props => {
        // console.log("under R");
        // console.log(props);
        // console.log(rest);
        if (isSignedIn) {
          return <Component {...props} user={user} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/signin",
                state: {
                  from: props.location
                }
              }}
            />
          );
        }
      }}
    />
  );
};

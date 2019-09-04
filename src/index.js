import React from "react";
import ReactDOM from "react-dom";
// import "foundation-sites/dist/css/foundation.min.css";
import "./assets/css/foundation.min.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
// import "tachyons";

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();

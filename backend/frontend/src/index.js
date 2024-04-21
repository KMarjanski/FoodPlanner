import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import './css.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import StoreProvider from "./store/StoreProvider";

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

import React from "react";
import ReactDOM from "react-dom";

import reportWebVitals from "./reportWebVitals";
import App from "./App";
import "./i18n";
import {Spin} from "@pankod/refine-antd";

ReactDOM.render(
  <React.StrictMode>
    <React.Suspense fallback={
      () => <div style={{height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Spin size={"large"}/></div>
    }>
      <App />
    </React.Suspense>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

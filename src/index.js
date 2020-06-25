import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./index.sass";
import TabbedView from "./components/TabbedView";
import Configurator from "./components/Configurator";

const urlParams = new URLSearchParams(window.location.search);

const titles = urlParams.getAll("title");
const urls = urlParams.getAll("url");
const frameTitles = urlParams.getAll("frameTitle");
const ariaLabels = urlParams.getAll("ariaLabel");
const background = urlParams.get("background") || undefined;
const height = urlParams.get("height") || null;
const uuid = urlParams.get("uuid") || undefined;

const tabs = titles.map((title, i) => ({
  title,
  url: urls[i],
  frameTitle: frameTitles[i],
  ariaLabel: ariaLabels[i],
}));

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route path={`${process.env.PUBLIC_URL}/view`}>
          <TabbedView uuid={uuid} tabs={tabs} height={height} background={background} />
        </Route>
        <Route path={`${process.env.PUBLIC_URL}/new`}>
          <Configurator />
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

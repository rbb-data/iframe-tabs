import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";

import 'loading-attribute-polyfill/dist/loading-attribute-polyfill'

import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import "./index.sass";
import TabbedView from "./components/TabbedView";
import Configurator from "./components/Configurator";

// this is a little messy - since we use the hash router
// we cant parse query params like normal
// propably there is a better way to do this though
const queryStringFromHash = window.location.hash.split("?")[1];
const urlParams = new URLSearchParams(queryStringFromHash);

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
        <Route path={`/view`}>
          <TabbedView uuid={uuid} tabs={tabs} height={height} background={background} />
        </Route>
        <Route path={`/new`}>
          <Configurator />
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

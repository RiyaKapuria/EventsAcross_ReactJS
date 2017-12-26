import React, { Component } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { CreateEvent } from "./components/CreateEvent/CreateEvent";
import { EventList } from "./components/Event/EventList";
import { EventDetails } from "./components/Event/EventDetails";
import { Blog } from "./components/Blog";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { Archive } from "./components/Dashboard/Archive";
import { Home } from "./components/Home/Home";
import { RequireAuth } from "./Auth";

export class AppRoute extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path={"/"} component={Home} />
          <Route path={"/CreateEvent"} component={RequireAuth(CreateEvent)} />
          <Route path={"/EventList"} component={EventList} />
          <Route path={"/EventDetails"}  component={EventDetails} />
          <Route path={"/Blog"} component={Blog} />
          <Route path={"/Dashboard"} component={RequireAuth(Dashboard)} />
          <Route path={"/Archive"} component={RequireAuth(Archive)} />
        </div>
      </Router>
    );
  }
}

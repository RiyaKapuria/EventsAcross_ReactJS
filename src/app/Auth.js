import React, { Component } from "react";
import { render } from "react-dom";


const RequireAuth = (Component) => {
  return class App extends Component {
    componentWillMount() {
      let getToken = Cookies.get('myToken');
      if(!getToken) {
        this.props.history.replace({pathname: '/'});
      }
    }
    render() {
      return <Component {...this.props} />
    }
  }
}

export { RequireAuth }

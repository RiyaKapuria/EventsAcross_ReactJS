import React, {Component} from "react";

import Header from './Header';

export class Blog extends Component {
  render() {
    return (
      <div className="text-center container body_container">
        <Header />
        <h2 style={{color: "#d9093a"}}>No API For Blog</h2>
        <img width={500} height={300} alt="300x150" src="./assets/images/loading.gif" />
      </div>
    );
  }
}

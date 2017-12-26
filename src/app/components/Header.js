import React, { Component } from 'react';
import { render } from "react-dom";
import { Link } from "react-router-dom";

import SignUp from "./SignUp";
import SignIn from "./SignIn";

export default class Header extends Component {
  constructor (props) {
    super(props)
    this.state = {
      getToken: '',
      getUserName: '',
      initials: ''
    };
  }

  logout () {
    Cookies.remove('myToken');
    Cookies.remove('myName');
    window.location.replace('/');
  }

  //saving logedin details
  login () {
    let getToken = Cookies.get('myToken');
    this.setState({getToken:getToken});
    let getUserName = Cookies.get('myName');
    this.setState({getUserName: getUserName});

    //initials of user name
    let initials = getUserName.match(/\b\w/g) || [];
    initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
    this.setState({initials: initials});
  }

  componentDidMount () {
    if(Cookies.get('myName')) {
      this.login();
    }
  }


  render() {
    return (
      <div>
        <nav className="navbar navbar-inverse navbar-fixed-top">
           <div className="container">
             <div className="navbar-header">
               <Link to="/" className="navbar-brand" style={{color: "#16aac4"}}>
                <div>
                  <img src="./assets/images/favicon.png" />&nbsp;
                  <b>Events Across</b>
                </div>
              </Link>
             </div>
             <ul className="nav navbar-nav">
               <li><Link to="/EventList">
                 <span className="glyphicon glyphicon-list" style={{color: "#16aac4"}}></span>
                 &nbsp;Event List
               </Link></li>
               <li><Link to="/Blog">Blog</Link></li>
             </ul>
             <ul className="nav navbar-nav navbar-right">
              { this.state.getToken ?
               <li><a href=""><div id="profileThumbnail"><b>{this.state.initials}</b></div></a></li>
              : null}
               { this.state.getToken ?
                 <li><Link to="/Dashboard">
                  <span className="glyphicon glyphicon-dashboard" style={{color: "#16aac4"}}></span>
                  &nbsp;My Dashboard
                  </Link></li>
                : null}
                { this.state.getToken ?
                 <li>
                   <a data-toggle="tooltip" title="No API for Settings">
                     <span className="glyphicon glyphicon-wrench" style={{color: "#16aac4"}}></span>
                     &nbsp;Settings
                   </a>
                  </li>
                : null}
               <li>
                  <a href="" data-toggle="tooltip" title="No API for Noticiacton">
                    <span className="glyphicon glyphicon-bell" id="notification_bell"></span>
                  </a>
                </li>
                { !this.state.getToken ?
                  <ul className="nav navbar-nav navbar-right">
                    <li>
                      <a className="page-scroll" data-toggle="modal" href="#signup_popup">
                        <span className="glyphicon glyphicon-user" style={{color: "#d9093a"}}></span>
                        &nbsp;Sign Up
                      </a>
                    </li>
                    <li>
                      <a className="page-scroll" data-toggle="modal" href="#signin_popup">
                        <span className="glyphicon glyphicon-log-in" style={{color: "#16aac4"}}></span>
                        &nbsp;Sign In
                      </a>
                    </li>
                  </ul>
                  :
                 <li><Link to="#" onClick={this.logout.bind(this)}>
                  <span className="glyphicon glyphicon-log-out" style={{color: "#16aac4"}}></span>
                  &nbsp;Sign Out
                </Link></li>
              }
             </ul>
           </div>
         </nav>
         { !this.state.getToken ?
           <div>
             <SignUp />
             <SignIn />
           </div>
           :
           null
         }
      </div>
    );
  }
}

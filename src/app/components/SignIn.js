import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import AlertContainer from "react-alert";
import { GoogleLogin } from 'react-google-login';

import ApiCall from "../ApiCall";

export class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        username: '',
        password: ''
      },
      errors: {}
    }
    this.onSubmit = this.onSubmit.bind(this);
    this.fotgotPassword = this.fotgotPassword.bind(this);
  }

  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    //UserName
    if(!fields["username"]) {
      formIsValid = false;
      errors["username"] = "Username is required";
    }

   //Password
   if(!fields["password"]) {
      formIsValid = false;
      errors["password"] = "Password is required";
   }
   this.setState({errors: errors});
   return formIsValid;
 }

 //Google Login
 googleLogin(response) {
   console.log("Google response",response);
  //  var input = {
  //    "username": response.profileObj.email,
  //    "password": response.googleId
  //  };
  //  let url = "v1/users/signin";
  //  ApiCall.postApiCall(url, input)
  //  .then(function (response) {
  //     console.log(response);
  //     if(response.status == 200) {
  //       console.log("Login successful");
  //       let token = response.accessToken;
  //       let name = response.profileObj.name;
  //       Cookies.set('myToken', response.accessToken, { expires: 15 });
  //       Cookies.set('myName', response.profileObj.name, { expires: 15 });
  //       window.location.replace('/');
  //     }
  //     else if(response.status == 404) {
  //       self.showAlert();
  //     }
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   });
 }

 //LogIn API call
  onSubmit(e) {
    var self = this;
    e.preventDefault();
    if(this.handleValidation()) {
      var input = this.state.fields;
      let url = "v1/users/signin";
      ApiCall.postApiCall(url, input)
      .then(function (response) {
         console.log(response);
         if(response.status == 200) {
           console.log("Login successful");
           let token = response.token;
           let name = response.name;
           Cookies.set('myToken', token, { expires: 15 });
           Cookies.set('myName', name, { expires: 15 });
           window.location.replace('/');
         }
         else if(response.status == 404) {
           self.showAlert();
         }
       })
       .catch(function (error) {
         console.log(error);
       });
     }
  }

  //Flash message
  alertOptions = {
    offset: 14,
    position: 'top center',
    theme: 'light',
    time: 5000,
    transition: 'scale'
  }

  showAlert() {
    this.msg.show("Invalid user details. Please enter again", {
      time: 5000,
      type: 'error',
      icon: <img className="pull-right" src="./assets/images/error.gif" />
    })
  }

  //Fotgot Password
  fotgotPassword() {
    this.msg.show("Sorry, No API for Forgot Password", {
      time: 5000,
      type: 'error',
      icon: <img className="pull-right" src="./assets/images/forgot_password.png" />
    })
  }

  //Input change
  onChange(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({fields});
  }


  render() {
    const responseGoogle = (response) => {
      this.googleLogin(response);
    }
    return (
        <div
          id="signin_popup" className="modal fade form-popup"
          role="dialog" data-backdrop="static" data-keyboard="false">
          <div className="modal-dialog" style={{width:"40%", height:"60%"}}>
            <div className="modal-content">
              <div className="modal-header" style={{background: "#23231f"}}>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  style={{color: "#ffffff"}}>
                  &times;
                </button>
                <h3 className="text-center">
                  <b style={{color: "#16aac4"}}>
                    Welcome to Events Across
                  </b>
                </h3>
              </div>
              <br />
              <div className="modal-body" style={{paddingBottom: "0"}}>
                <form className="form-theme text-left">
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="form-group">
                        <input
                          value={this.state.fields["username"]}
                          onChange={this.onChange.bind(this, "username")}
                          className="form-control"
                          type="text"
                          placeholder="Email ID *"
                        />
                        <span style={{color: "red"}}>{this.state.errors["username"]}</span>
                      </div>
                    </div>
                    <div className="col-sm-12">
                      <div className="form-group">
                        <input
                          value={this.state.fields["password"]}
                          onChange={this.onChange.bind(this, "password")}
                          className="form-control"
                          type="password"
                          placeholder="Password *"
                        />
                        <span style={{color: "red"}}>{this.state.errors["password"]}</span>
                      </div>
                    </div>
                    <div className="col-sm-12 text-center">
                      <div>
                        <a onClick={this.fotgotPassword}>Forgot your password ?</a>
                      </div>
                      <div>
                        <p>New User ?&emsp;
                          <a className="page-scroll" data-toggle="modal" href="#signup_popup" data-dismiss="modal">
                            Register
                          </a>
                        </p>
                      </div>
                      <div>
                        <div className="well google-login">
                          <div className="inline-block">
                            <img src="./assets/images/google.jpg" />
                            <GoogleLogin
                              clientId="672653103376-2crhm536k8fmop55257dj18phljvi944.apps.googleusercontent.com"
                              buttonText="Continue with Google"
                              onSuccess={responseGoogle}
                              onFailure={responseGoogle}
                              className="google-btn"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-12 button-upspace">
                      <div className="row">
                        <div className="col-sm-6">
                          <button
                            type="submit"
                            className="btn btn-primary pull-right"
                            onClick={this.onSubmit}>
                            Sign In
                          </button>
                        </div>
                        <div className="col-sm-6">
                          <button
                            type="submit"
                            className="btn btn-danger"
                            data-dismiss="modal">
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
                <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
              </div>
            </div>
          </div>
        </div>
    );
  }
}

export default withRouter(SignIn);

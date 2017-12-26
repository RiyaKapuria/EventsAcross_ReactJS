import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import AlertContainer from "react-alert";

import ApiCall from "../ApiCall";

export class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
     fields: {
       name: '',
       email: '',
       password: '',
       password_confirmation: ''
     },
     errors: {}
    }
    this.onSubmit = this.onSubmit.bind(this);
  }

  handleValidation() {
    let self = this;
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    console.log(fields);
    //Name
    if(!fields["name"]) {
       formIsValid = false;
       errors["name"] = "Name is required";
    }

    if(typeof fields["name"] != "undefined") {
       if(!fields["name"].match(/^[a-zA-Z\s]+$/) ){
           formIsValid = false;
           errors["name"] = "Only letters";
       }
    }

    //Email
    if(!fields["email"]) {
     formIsValid = false;
     errors["email"] = "Email ID is required";
    }

    if(typeof fields["email"] != "undefined") {
      let lastAtPos = fields["email"].lastIndexOf('@');
      let lastDotPos = fields["email"].lastIndexOf('.');

      if (!fields["email"].match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        formIsValid = false;
        errors["email"] = "Email is not valid";
      }
   }

    //Password
    if(!fields["password"]) {
      formIsValid = false;
      errors["password"] = "Password is required";
    }

    if(typeof fields["password"] != "undefined") {
      if(!fields["password"].match(/[0-9a-zA-Z]{8,8}$/)){
        formIsValid = false;
        errors["password"] = "Minimum 8 Characters";
      }
    }

    //Confirm Password
    if(!fields["password_confirmation"]) {
      formIsValid = false;
      errors["password_confirmation"] = "Confirm Password is required";
    }

    if(typeof fields["password_confirmation"] != "undefined") {
      if(!fields["password_confirmation"].match(fields["password"])) {
        formIsValid = false;
        errors["password_confirmation"] = 'Passwords do not match.';
      }
    }

    //Registration Successful
    if(formIsValid) {
     let input = {
       "name" : this.state.fields["name"],
       "email" : this.state.fields["email"],
       "password" : this.state.fields["password"],
       "password_confirmation" : this.state.fields["password_confirmation"]
     }
     console.log(input);
     let url = "v1/users/signup";
     ApiCall.postApiCall(url, input)
     .then(function (response) {
       console.log(response);
       if(response.status == 200) {
         self.successAlert();
       }
       else if(response.status == 400) {
         self.errorAlert();
       }
     })
     .catch(function (error) {
      console.log(error);
     });
    }
    this.setState({errors: errors});
  }

  //Flash message
  alertOptions = {
    offset: 14,
    position: 'top center',
    theme: 'light',
    time: 5000,
    transition: 'scale'
  }

  successAlert() {
    this.msg.show("Registration Successful", {
      time: 5000,
      type: 'success',
      icon: <img className="pull-right" src="./assets/images/success.gif" />
    })
  }

  errorAlert() {
    this.msg.show("Email has already been taken", {
      time: 5000,
      type: 'error',
      icon: <img className="pull-right" src="./assets/images/error.gif" />
    })
  }

  //Submit Button
  onSubmit(e) {
    e.preventDefault();
    this.handleValidation();
  }

  //Input changes
  onChange(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({fields});
  }


  render() {
    return (
      <div>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
        <div
          id="signup_popup"
          className="modal fade form-popup"
          role="dialog"
          data-backdrop="static"
          data-keyboard="false">
          <div className="modal-dialog" style={{width:"40%"}}>
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
                    Signup to Events Across
                  </b>
                </h3>
              </div>
              <div className="modal-body" style={{paddingBottom: "0"}}>
                <p className="title text-center">
                  Already have an account?&emsp;
                  <a className="page-scroll" data-toggle="modal" href="#signin_popup" data-dismiss="modal">
                    Sign In
                  </a>
                </p>
                <form className="form-theme text-left">
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="form-group">
                        <input
                          value={this.state.fields["name"]}
                          onChange={this.onChange.bind(this, "name")}
                          className="form-control"
                          type="text"
                          placeholder="Name *"
                        />
                        <span style={{color: "red"}}>{this.state.errors["name"]}</span>
                      </div>
                    </div>
                    <div className="col-sm-12">
                      <div className="form-group">
                        <input
                          value={this.state.fields["email"]}
                          onChange={this.onChange.bind(this, "email")}
                          className="form-control"
                          type="text"
                          placeholder="Email Id *"
                        />
                        <span style={{color: "red"}}>{this.state.errors["email"]}</span>
                      </div>
                    </div>
                    <div className="col-sm-6">
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
                    <div className="col-sm-6">
                      <div className="form-group">
                        <input
                          value={this.state.fields["password_confirmation"]}
                          onChange={this.onChange.bind(this, "password_confirmation")}
                          className="form-control"
                          placeholder="Confirm Password *"
                          type="password"
                        />
                        <span style={{color: "red"}}>{this.state.errors["password_confirmation"]}</span>
                      </div>
                    </div>
                    <div className="col-sm-12 button-upspace">
                      <div className="row">
                        <div className="col-sm-6">
                          <button
                            type="submit"
                            className="btn btn-primary pull-right"
                            onClick={this.onSubmit}>
                            Sign Up
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
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(SignUp);

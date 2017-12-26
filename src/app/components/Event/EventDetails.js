import React, { Component } from "react";
import _ from "lodash";
import { Link } from "react-router-dom";
import AlertContainer from "react-alert";
import Affix from 'react-overlays/lib/Affix';

import BucketModal from "../BucketModal";
import Header from "../Header";
import ApiCall from "../../ApiCall";

export class EventDetails extends Component {
  constructor (props) {
    super(props)
    this.state = {
      getToken: '',
      events: [],
      comments: [],
      publicComments: [],
      privateComments: [],
      user: [],
      displayEvent: [],
      displayLoc: [],
      fields: {
        public_comment_post: '',
        private_comment_post: ''
      }
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  //Event Fetching from Dashboard
  dashboardEvent() {
    var compID = this.props.location.state.eventId;
    let getToken = Cookies.get('myToken');
    let self = this;
    let url = "v1/events?bucket_id=" + this.props.location.state.bucket_id.id + "&on_dashboard=true";
    ApiCall.getApiCall(url, getToken)
    .then(function (response) {
      let events = response.events;
      self.setState({events: events});
       console.log("Event Fetching from Dashboard",response);
       for(var i = 0; i < response.events_count; i++) {
         var obj = response.events[i].id;
         if(compID == obj) {
           let displayEvent = response.events[i];
           for(var j = 0; j < displayEvent.locations.length ; j++) {
             let displayLoc = displayEvent.locations;
             self.setState({displayLoc: displayLoc});
           }
          if(displayEvent.tag_list.length > 0) {
            self.setState({tagFlag : true});
          }
           self.setState({displayEvent: displayEvent});
           break;
         }
       }
       self.commentFetch();
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  //Event Fetching from EventList
  eventlistEvent() {
    var compID = this.props.location.state.eventId;
    var compSlug = this.props.location.state.eventSlug;
    let self = this;
    let url = "v1/events/" + this.props.location.state.eventSlug;
    ApiCall.getApiCall(url)
    .then(function (response) {
      let events = response.events;
      self.setState({events: events});
       console.log("Event Fetching from EventList",response);
       let displayEvent = response;
       for(var j = 0; j < displayEvent.locations.length ; j++) {
         let displayLoc = displayEvent.locations;
         self.setState({displayLoc: displayLoc});
       }
       self.setState({displayEvent: displayEvent});
       self.commentFetch();
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  //Private and Public Comments Fetching
  commentFetch() {
    var compID = this.props.location.state.eventId;
    let self = this;
    let getToken = Cookies.get('myToken');
    let url = "v1/comments/for-event/" + compID;
    ApiCall.getApiCall(url, getToken)
    .then(function (response) {
      let publicComments = [];
      {response.public_comments ? (publicComments = response.public_comments) : []}
      let privateComments = [];
      {response.private_comments ? (privateComments = response.private_comments) : []}
      self.setState({
        publicComments: publicComments,
        privateComments: privateComments
      });
      console.log("Public Comment Fetching",response);
      console.log("Private Comment Fetching",response);
     })
    .catch(function (error) {
      console.log(error);
    });
  }

  //Go to top
  goTop() {
    window.scrollTo(0, 225);
  }

  //On page load
  onloadPage() {
    let getToken = Cookies.get('myToken');
    this.setState({getToken:getToken});
    {this.props.location.state.bucket_id ? this.dashboardEvent() : this.eventlistEvent() }
  }

  //React LifeCycle
  componentDidMount() {
    this.onloadPage();
    window.scrollTo(0, 0);
  }

  //Type Comment
  onChange(my_comment, e){
    let fields = this.state.fields;
    fields[my_comment] = e.target.value;
    this.setState({fields});
  }

  //Comment button
  onSubmit(e){
    e.preventDefault();
    this.commentPost();
  }

  //Comment Post
  commentPost(){
    let self =this;
    let public_comment_post = self.state.comment_post;
    let private_comment_post = self.state.comment_post;
    let input = {};
    let getToken = Cookies.get('myToken');
    // var apiBaseUrl = "http://api.eventsacross-stage.railsfactory.com/api/";
    var compID = this.props.location.state.eventId;
    {self.state.fields["public_comment_post"] ?
      input = {
        "comment" : {
          "body" : self.state.fields["public_comment_post"],
          "is_public" : true,
          "event_id" : compID
        }
      } : {} }
    {self.state.fields["private_comment_post"] ?
      input = {
        "comment" : {
          "body" : self.state.fields["private_comment_post"],
          "is_public" : false,
          "event_id" : compID
        }
      } : {} }
    let url = "v1/comments/post-comment";
    ApiCall.postApiCall(url, input, getToken)
    .then(function (response) {
      if(response.comment.is_public == false){
        let priOldVal = self.state.privateComments;
        priOldVal.push(response.comment);
        self.setState({
          privateComments: priOldVal,
          fields:{
            public_comment_post: '',
            private_comment_post: ''
          }
        })
      }
      else if(response.comment.is_public == true) {
        let pubOldVal = self.state.publicComments;
        pubOldVal.push(response.comment);
        self.setState({
          publicComments: pubOldVal,
          fields:{
            public_comment_post: '',
            private_comment_post: ''
          }
        })
      }
      console.log("Comment Post",response.comment);

     })
    .catch(function (error) {
      console.log(error);
      self.showAlert();
    });
  }

  //Previous Page
  goBack() {
    window.history.back();
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
    this.msg.show("Sorry. Can't post comment for this event", {
      time: 5000,
      type: 'error',
      icon: <img className="pull-right" src="./assets/images/error.gif" />
    })
  }


  render() {
    var eventID = [];
    eventID.push(this.props.location.state.eventId);
    var nameInitial = '';
    return (
      <div>
        <Header />
        <div className="text-center jumbotron body_container">
          <h1 className="title">
            <span style={{color: "#16aac4"}}><b>Event </b></span>
            <span><b>Details</b></span>
          </h1>
        </div>
        <div className="container">
          <div className="row">
          <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
            <div className="col-sm-8">
              <button onClick={this.goBack} className="btn btn-default pull-left" type="button">
                <span className="glyphicon glyphicon-menu-left"></span>
                Back
              </button>
              { this.state.getToken ?
                <div>
                  <br/><br/>
                  <a className="page-scroll" data-toggle="modal" href="#bucket_popup">
                    <button
                      className="btn btn-warning pull-left"
                      type="button"
                      onClick={() => this.refs.child.bucketsAndEvents()}>
                      Add to Bucket
                    </button>
                  </a>
                </div>
              :
                null
              }
              <br /><br />
              { this.state.getToken ?
                <div>
                  { this.props.location.state.bucket_id ?
                    <div>
                      <h4 className="pull-left">
                        <Link to = "/" style={{color:"#16aac4"}}>Home</Link> >
                        <Link to ={{
                          pathname: "/Dashboard",
                          state: { default_bucket: this.props.location.state.bucket_id } }}
                          style={{color:"#16aac4"}} >  {this.props.location.state.bucket_id.name}
                        </Link> >
                        <strong> {this.state.displayEvent.name}</strong>
                      </h4>
                      <br />
                    </div>
                    :
                    <div>
                      <h4 className="pull-left">
                        <Link to = "/" style={{color:"#16aac4"}}>Home</Link>
                        <strong> > {this.state.displayEvent.name}</strong>
                      </h4>
                      <br />
                    </div>
                  }
                </div>
              :
              <h4 className="pull-left">
                <Link to = "/" style={{color:"#16aac4"}}>Home</Link>
                <strong> > {this.state.displayEvent.name}</strong>
              </h4>
              }
              <br /><hr />
              <div>
                <h2>{this.state.displayEvent.name}</h2>
                <h4>{this.state.displayEvent.description}</h4>
                <p>
                  <span className="glyphicon glyphicon-link"></span>&emsp;&emsp;&emsp;
                  <a href={this.state.displayEvent.url} target="_blank">{this.state.displayEvent.url}</a>
                </p>
                <p>
                  <span className="glyphicon glyphicon-user user-icon"></span>&emsp;&emsp;&emsp;
                  {this.state.displayEvent.is_public == true ? <span>Public</span> : <span>Private</span>}
                </p>
                {this.state.displayLoc ?
                  <div className="row">
                    <div className="col-sm-1" style={{padding: "8px"}}>
                      <span className="glyphicon glyphicon-map-marker"></span>
                    </div>
                    <div className="col-sm-11">
                      {this.state.displayLoc.map(function (displayLoc, i) {
                        return (
                          <p key={i}>({i+1}) {displayLoc.venue} {displayLoc.address_lane_1} {displayLoc.address_lane_2} {displayLoc.lane} {displayLoc.city} {displayLoc.state} {displayLoc.country} {displayLoc.pin}</p>
                        )
                      })}
                    </div>
                  </div>
                :
                  null
                }
                <div className="row">
                  <div className="col-sm-1" style={{padding: "12px"}}>
                    <span className="glyphicon glyphicon-time"></span>
                  </div>
                  <div className="col-sm-11" style={{top: "15px"}}>
                    From
                    &emsp;{this.state.displayEvent.start_at ? this.state.displayEvent.start_at.substring(0,16).replace("T"," ") : null}
                    &emsp;To
                    &emsp;{this.state.displayEvent.end_at ? this.state.displayEvent.end_at.substring(0,16).replace("T"," ") : null}
                  </div>
                </div>
                {this.state.displayEvent.tag_list ?
                  <div className="row">
                    <div className="col-sm-1" style={{padding: "12px"}}>
                      <span className="glyphicon glyphicon-tags"></span>
                    </div>
                    <div className="col-sm-11">
                      {this.state.displayEvent.tag_list.map (function (tag_list, i) {
                        return (
                          <p key={i}>({i+1}) {tag_list}</p>
                        )
                      })}
                    </div>
                  </div>
                :
                  null
                }
              </div>
              <br /><br />
              <ul className="nav nav-tabs">
                <li className="active">
                  <a href="#public_comment" onClick={this.getPublicComment} data-toggle="tab">
                    <b>Public Comments</b>
                  </a>
                </li>
                <li>
                  <a href="#private_comment" onClick={this.getPrivateComment} data-toggle="tab">
                    <b>Private Comments</b>
                  </a>
                </li>
              </ul>
              { this.state.getToken ?
                <div className="tab-content">
                  <div id="public_comment" className="tab-pane fade in active">
                    <br />
                    {this.state.publicComments.map(function (publicComment, i) {
                      return (
                        <div className="row" key={i}>
                          <div className="col-sm-2">
                            <div className="thumbnail" id="profileName">
                              <b>{(nameInitial = (publicComment.user.name).match(/\b\w/g) || []) && ((nameInitial.shift() || '') + (nameInitial.pop() || '')).toUpperCase()}</b>
                            </div>
                          </div>
                          <div className="col-sm-10">
                            <div className="panel panel-default">
                              <div className="panel-heading" className="alert alert-info panel-padding">
                                <strong>{publicComment.user.name}</strong>
                              </div>
                              <div className="panel-body">{publicComment.body}</div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    <form>
                     <div className="form-group">
                       <input
                        className="form-control"
                        rows="3"
                        value={this.state.fields["public_comment_post"]}
                        onChange={this.onChange.bind(this, "public_comment_post")}
                        placeholder="Type your Comment"
                        type="text" />
                     </div>
                    <button className="btn btn-success btn-lg pull-right" onClick={this.onSubmit}>Submit</button>
                   </form>
                  </div>
                  <div id="private_comment" className="tab-pane fade">
                    <br />
                    {this.state.privateComments.map(function (privateComment, i) {
                      return (
                        <div className="row" key={i}>
                          <div className="col-sm-2">
                            <div className="thumbnail"  id="profileName">
                              <b>{(nameInitial = (privateComment.user.name).match(/\b\w/g) || []) && ((nameInitial.shift() || '') + (nameInitial.pop() || '')).toUpperCase()}</b>
                            </div>
                          </div>
                          <div className="col-sm-10">
                            <div className="panel panel-default">
                              <div className="panel-heading"  className="alert alert-info panel-padding">
                                <strong>{privateComment.user.name}</strong>
                              </div>
                              <div className="panel-body">{privateComment.body}</div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    <form>
                     <div className="form-group">
                       <input
                        className="form-control"
                        rows="3"
                        value={this.state.fields["private_comment_post"]}
                        onChange={this.onChange.bind(this, "private_comment_post")}
                        placeholder="Type your Comment"
                        type="text" />
                     </div>
                    <button className="btn btn-success btn-lg pull-right" onClick={this.onSubmit}>Submit</button>
                   </form>
                  </div>
                </div>
              :
                <div className="tab-content">
                  <div id="public_comment" className="tab-pane fade in active">
                    <br />
                    {this.state.publicComments.map(function (publicComment, i) {
                      return (
                        <div className="row" key={i}>
                          <div className="col-sm-2">
                            <div className="thumbnail"  id="profileName">
                              <b>{(nameInitial = (publicComment.user.name).match(/\b\w/g) || []) && ((nameInitial.shift() || '') + (nameInitial.pop() || '')).toUpperCase()}</b>
                            </div>
                          </div>
                          <div className="col-sm-10">
                            <div className="panel panel-default">
                              <div className="panel-heading"  className="alert alert-info panel-padding">
                                <strong>{publicComment.user.name}</strong>
                              </div>
                              <div className="panel-body">{publicComment.body}</div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div id="private_comment" className="tab-pane fade text-center">
                    <br />
                    <h4> Not Available For Guest User </h4>
                    <img width={500} height={400} alt="300x150" src="./assets/images/page_loader.gif" />
                  </div>
                </div>
              }
            </div>

            <div className="col-sm-4">
              <h4 className="text-center" style={{color: "#d9093a"}}>Other Events</h4>
              <div className="well well-lg">
                <div className="panel panel-default">
                  <div className="panel-body">
                    <button className="btn btn-default pull-right" type="button">Joining ?</button>
                    <h5><b>Event Name</b></h5>
                    <div className="link-inline">
                      <ul className="list-inline">
                        <li className="text-left"><a><u>View more</u></a></li>
                        <li className="text-right"><a><u>View site</u></a></li>
                      </ul>
                    </div>
                    <p className="text-right">
                      <a href="#">
                        <img className="" src="./assets/images/glyphicons-309-share-alt.png"></img>
                      </a>
                    </p>
                    <span className="pull-left text-left">Place [Venue, City]</span>
                    <span className="pull-right text-right">Date [Start Date]</span>
                  </div>
                </div>
                <div className="panel panel-default">
                  <div className="panel-body">
                    <button className="btn btn-default pull-right" type="button">Joining ?</button>
                    <h5><b>Event Name</b></h5>
                    <div className="link-inline">
                      <ul className="list-inline">
                        <li className="text-left"><a><u>View more</u></a></li>
                        <li className="text-right"><a><u>View site</u></a></li>
                      </ul>
                    </div>
                    <p className="text-right">
                      <a href="#">
                        <img className="" src="./assets/images/glyphicons-309-share-alt.png"></img>
                      </a>
                    </p>
                    <span className="pull-left text-left">Place [Venue, City]</span>
                    <span className="pull-right text-right">Date [Start Date]</span>
                  </div>
                </div>
                <div className="panel panel-default">
                  <div className="panel-body">
                    <button className="btn btn-default pull-right" type="button">Joining ?</button>
                    <h5><b>Event Name</b></h5>
                    <div className="link-inline">
                      <ul className="list-inline">
                        <li className="text-left"><a><u>View more</u></a></li>
                        <li className="text-right"><a><u>View site</u></a></li>
                      </ul>
                    </div>
                    <p className="text-right">
                      <a href="#">
                        <img className="" src="./assets/images/glyphicons-309-share-alt.png"></img>
                      </a>
                    </p>
                    <span className="pull-left text-left">Place [Venue, City]</span>
                    <span className="pull-right text-right">Date [Start Date]</span>
                  </div>
                </div>
              </div>
              <div>
                <Affix
                  offsetTop={850}
                  viewportOffsetTop={null}
                  topClassName={"hide-rocket"}
                  container={this}>
                    <img className="rocket" src="./assets/images/rocket.gif" onClick={this.goTop} />
                </Affix>
              </div>
            </div>
          </div>
        </div>
        { this.state.getToken ?
          <BucketModal id={eventID} ref="child" />
        :
          null
        }
      </div>
    );
  }
}

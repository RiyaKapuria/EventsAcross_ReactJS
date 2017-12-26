import React, {Component} from "react";
import { Link } from "react-router-dom";
import AlertContainer from "react-alert";
import Affix from 'react-overlays/lib/Affix';

import Header from "../Header";
import ApiCall from "../../ApiCall";

export class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buckets: [],
      recent_bucket: {},
      events: [],
      selected_bucket: {},
      filter_result: [],
      getFilter: false,
      fields: {
        bucket_name: '',
        email: ''
      },
      count: 1
    }
    this.clearFilter = this.clearFilter.bind(this);
    this.clearText = this.clearText.bind(this);
    this.onCreateBucket = this.onCreateBucket.bind(this);
    this.addInvitees = this.addInvitees.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.loadLess = this.loadLess.bind(this);
  }

  //Initial Page Load
  onPageLoad(){
    let getFilter = false;
    this.setState({getFilter: getFilter});
    let self = this;
    let getToken = Cookies.get('myToken');

    //Bucket Fetching
    let url = "v1/buckets";
    ApiCall.getApiCall(url, getToken)
    .then(function (response) {
      let recent_bucket = response.recent_bucket;
      self.setState({recent_bucket: recent_bucket});
      let buckets = response.buckets;
      buckets.reverse();
      self.setState({buckets: buckets});
      console.log("Your buckets", response);
      { !self.props.location.state ? self.recentBucket(recent_bucket.id,1)
        : self.selectedBucket(self.props.location.state.default_bucket.id) }
     })
    .catch(function (error) {
      console.log(error);
    });
  }

  //Load More Events
  loadMore () {
    this.setState({count: this.state.count+1}, () => {
      this.recentBucket(this.state.recent_bucket.id, this.state.count);
      this.setState({count: 1});
    });
    window.scrollTo(0, 0);
  }

  loadLess () {
    this.setState({count: this.state.count-1}, () => {
      this.recentBucket(this.state.recent_bucket.id, this.state.count);
      this.setState({count: 1});
    });
    window.scrollTo(0, 0);
  }

  //Recent Bucket Event List from API
  recentBucket(recent_bucket_id, page_no){
    console.log("Page No",page_no);
    let getFilter = false;
    this.setState({getFilter: getFilter});
    let self = this;
    let page = '';
    {page_no ? page = page_no : page = 1}
    var apiBaseUrl = "http://api.eventsacross-stage.railsfactory.com/api/";
    let getToken = Cookies.get('myToken');
    let url = "v1/events?bucket_id=" + recent_bucket_id + "&on_dashboard=true&per_page=10&page=" + page;
    ApiCall.getApiCall(url, getToken)
    .then(function (response) {
      let events = response.events;
      self.setState({events: events});
      console.log("EventListDashboard",response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  //Event Filter by Time
  eventFilter(value) {
    let getFilter = true;
    this.setState({getFilter: getFilter});
    let self = this;
    var apiBaseUrl = "http://api.eventsacross-stage.railsfactory.com/api/";
    let bkt_id = '' ;
    { !this.state.selected_bucket.id ?
      (bkt_id = this.state.recent_bucket.id)
    :
      (bkt_id = this.state.selected_bucket.id)
    }
    let url = "/v1/buckets/filtering?bucket_id=" + bkt_id + "&filter_by=" + value + "&page=1&per_page=50";
    let getToken = Cookies.get('myToken');
    ApiCall.getApiCall(url, getToken)
    .then(function (response) {
      let filter_result = response.data;
      self.setState({filter_result: filter_result});
      console.log("Filtered Event",filter_result);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  //Clear Filter & Text
  clearFilter() {
    {!this.state.selected_bucket.id ? (this.onPageLoad()) : (this.selectedBucket())}
  }

  clearText(e){
    e.preventDefault();
    this.setState({
      fields: {
        bucket_name: ''
      }
    });
  }

  //Bucket Filter
  selectedBucket(value){
    let self = this;
    let getFilter = false;
    this.setState({getFilter: getFilter});
    let url = "v1/buckets/buckets-and-events";
    let getToken = Cookies.get('myToken');
    ApiCall.getApiCall(url, getToken)
    .then(function (response) {
      for(var i = 0; i < response.length; i++) {
        if(value == response[i].bucket.id) {
          self.setState({selected_bucket: response[i].bucket});
          let events = response[i].events;
          self.setState({events: events});
          console.log("Bucket Filtered Event List", events);
        }
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  //Input value Fetching
  onChange(field, e){
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({fields});
  }

  //Create new Bucket
  onCreateBucket(e){
    e.preventDefault();
    let self = this;
    let getToken = Cookies.get('myToken');
    let url = "v1/buckets/create-bucket";
    let input = {
      "name" :  this.state.fields["bucket_name"]
    }
    ApiCall.postApiCall(url, input, getToken)
    .then(function (response) {
        self.setState({
           buckets: self.state.buckets.concat(response.bucket)
         });
         self.setState({
           fields: {
             bucket_name: ''
           }
         });
     })
    .catch(function (error) {
      console.log(error);
    });
  }

  //Add Invitees
  addInvitees(e) {
    e.preventDefault();
    let self = this;
    let getToken = Cookies.get('myToken');
    let invitees_bucket_id = '';
    { !this.state.selected_bucket.id ?
      (invitees_bucket_id = this.state.recent_bucket.id)
    :
      (invitees_bucket_id = this.state.selected_bucket.id)
    }
    let url = "v1/invitations/send-invite";
    let input = {
      "invitation":{
        "invited_bucket_id" : invitees_bucket_id,
        "user_email" : this.state.fields["email"],
        "invitation_status" : 2
      }
    }
    ApiCall.postApiCall(url, input, getToken)
    .then(function (response) {
      console.log(response.status);
      if(response.status == 201) {
        self.showAlert();
      }
     })
    .catch(function (error) {
      console.log(error);
    });
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
    this.msg.show("You have successfully invited to bucket", {
      time: 5000,
      type: 'success',
      icon: <img className="pull-right" src="./assets/images/success.gif" />
    })
  }

  //LifeCycle
  componentDidMount() {
    this.onPageLoad();
  }


  render() {
    let self = this;
    return (
      <div className="container" style={{padding: "80px 0"}}>
        <Header />
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
        <div className="row">
          <div className="col-sm-5">
            <div>
              <h4 className="bucket-holder"><b>Bucket :</b>&nbsp;
                { !this.state.selected_bucket.id ?
                  <span><b>{this.state.recent_bucket.name}</b></span>
                :
                  <span><b>{this.state.selected_bucket.name}</b></span>
                }
              </h4>
            </div>
            <button
              className="btn btn-primary dropdown-toggle dash-btn-width"
              type="button" data-toggle="dropdown">
                <b>Choose Your Buckets</b>&nbsp;
                <span className="caret"></span>
            </button>
            <ul className="dropdown-menu theme-dropdown">
              <li>
                <input
                  type="text"
                  className="form-control"
                  value={this.state.fields["bucket_name"]}
                  onChange={this.onChange.bind(this, "bucket_name")}
                  placeholder="Create new bucket"/>
                <div className="dd-action">
                  <span className="glyphicon glyphicon-ok" onClick={this.onCreateBucket}></span>
                  <span className="glyphicon glyphicon-remove" onClick={this.clearText}></span>
                </div>
              </li>
              {this.state.buckets.map(function (bucket, i) {
                return (
                <li key={i}>
                  <a href="#"
                    onClick={self.selectedBucket.bind(self, bucket.id)}
                    value={bucket.id} >
                    {bucket.name}
                  </a>
                </li>
                )
              })}
            </ul>
          </div>
          <div className="col-sm-5"><b>
            <ul className="pagination">
              <li><a href="#" onClick={this.eventFilter.bind(this, "today")}>Today</a></li>
              <li><a href="#" onClick={this.eventFilter.bind(this, "this_week")}>Week</a></li>
              <li><a href="#" onClick={this.eventFilter.bind(this, "this_month")}>Month</a></li>
              <li><a href="#" onClick={this.eventFilter.bind(this, "this_year")}>Year</a></li>
            </ul>
          </b></div>
          <div className="col-sm-2">
            <Link to ={{
              pathname: "/CreateEvent",
              state: { bucket_id: !this.state.selected_bucket.id ? this.state.recent_bucket : this.state.selected_bucket } }} >
              <button type="button" className="btn btn-danger dash-btn-width"><b>Create Your Own Event</b></button>
            </Link>
            <br /><br />
            <div>
              <button
                className="btn btn-success active dropdown-toggle dash-btn-width"
                type="button"
                data-toggle="dropdown">
                <b>Invite To Selected Bucket</b>&nbsp;
                <span className="caret"></span>
              </button>
              <ul className="dropdown-menu theme-dropdown" style={{width: "240px"}}>
                <li>
                  <input
                    className="form-control"
                    placeholder="Enter Invitees Email"
                    type="text"
                    value={this.state.fields["email"]}
                    onChange={this.onChange.bind(this, "email")} />
                  <div className="dd-action">
                    <span className="glyphicon glyphicon-ok" onClick={this.addInvitees}></span>
                    <span className="glyphicon glyphicon-remove"></span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-2">
            <Link to="/Archive">
              <button type="button" className="btn btn-warning" id="archive_button">
                <span className="glyphicon glyphicon-chevron-left pull-left"></span>
                &nbsp;&nbsp;Bucket Archives
              </button>
            </Link>
          </div>
          <div className="col-sm-8 text-center">
            {(this.state.getFilter==false) ?
              <div>
                {(this.state.events.length>0) ?
                  <div>
                    <div className="row" className="text-left">
                      {this.state.events.map(function (event, i) {
                        return (
                          <div className="col-sm-6" key={i}>
                            <div className="panel panel-default event-holder">
                              <div className="panel-body">
                               <button className="btn btn-default pull-right" type="button">Joining ?</button>
                               <h4><b>{event.name.length > 25 ? event.name.substring(0,20).concat(" ...") : event.name}</b></h4>
                               <div className="link-inline">
                                 <ul className="list-inline">
                                   <li className="text-left">
                                     <Link to ={{
                                       pathname: "/EventDetails",
                                       state: { bucket_id: !self.state.selected_bucket.id ? self.state.recent_bucket : self.state.selected_bucket,
                                                eventId: event.id
                                              }
                                      }} >
                                       <u>View more</u>
                                     </Link>
                                   </li>
                                   <li className="text-right">
                                    <a href={event.url} target="_blank"><u>View site</u></a>
                                  </li>
                                 </ul>
                               </div>
                               <div className="row">
                                 <div className="col-sm-1">
                                   <span className="glyphicon glyphicon-calendar"></span>
                                 </div>
                                 <div className="col-sm-10">
                                   From {event.start_at.substring(0,16).replace("T"," ")}
                                   <br />To {event.end_at.substring(0,16).replace("T"," ")}
                                 </div>
                               </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="col-sm-12">
                      { !self.state.selected_bucket.id ?
                        <div className="text-center">
                          <span className="glyphicon glyphicon-step-backward" onClick={this.loadLess}></span>
                          <span className="glyphicon glyphicon-step-forward" onClick={this.loadMore}></span>
                        </div>
                      :
                        null
                      }
                      <br /><br /><br />
                    </div>
                  </div>
                  :
                  <p>Sorry. No Matches Fot This Filter.</p>
                }
              </div>
              :
              <div>
                <div className="row">
                  <button
                    className="btn btn-sm active pull-right"
                     onClick={this.clearFilter}>
                    Clear Filter <span className="glyphicon glyphicon-remove"></span>
                  </button>
                  <br /><br />
                </div>
                {(this.state.filter_result.length>0) ?
                  <div>
                    <div className="row" className="text-left">
                      {this.state.filter_result.map(function (event, i) {
                        return (
                          <div className="col-sm-6" key={i}>
                            <div className="panel panel-default event-holder">
                              <div className="panel-body">
                               <button className="btn btn-default pull-right" type="button">Joining ?</button>
                               <h4><b>{event.name.length > 25 ? event.name.substring(0,20).concat(" ...") : event.name}</b></h4>
                               <div className="link-inline">
                                 <ul className="list-inline">
                                   <li className="text-left">
                                    <Link to= {{ pathname: '/EventDetails', state: {eventId: event.id} }} ><u>View more</u></Link>
                                   </li>
                                   <li className="text-right">
                                    <a href={event.url} target="_blank"><u>View site</u></a>
                                   </li>
                                 </ul>
                               </div>
                               <div className="row">
                                 <div className="col-sm-1">
                                   <span className="glyphicon glyphicon-calendar"></span>
                                 </div>
                                 <div className="col-sm-10">
                                   From {event.start_at ? event.start_at.substring(0,16).replace("T"," ") : null}
                                   <br />To {event.end_at ? event.end_at.substring(0,16).replace("T"," ") : null}
                                 </div>
                               </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="col-sm-12">
                      <br /><br /><br />
                    </div>
                  </div>
                  :
                  <p>Sorry. No Matches Fot This Filter.</p>
                }
              </div>
            }
          </div>
          <div className="col-sm-2">
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
    );
  }
}

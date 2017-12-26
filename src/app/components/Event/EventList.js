import React, {Component} from "react";
import _ from "lodash";
import { Link } from "react-router-dom";
import Affix from 'react-overlays/lib/Affix';
import AutoAffix from 'react-overlays/lib/AutoAffix';

import BucketModal from "../BucketModal";
import Header from "../Header";
import ApiCall from "../../ApiCall";

export class EventList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      getToken: '',
      search_event: '',
      events: [],
      cityArray: [],
      search_result: '',
      selected_events: [],
      count: 1
    };
    this.handleGoClick = this.handleGoClick.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.loadLess = this.loadLess.bind(this);
  }

  //Search event
  handleSearch(e) {
    this.setState({ search_event: e.target.value })
  }

  handleGoClick(e) {
    let self = this;
    e.preventDefault();
    let url = "v1/events/search-events?search_text=" + self.state.search_event;
    ApiCall.getApiCall(url)
    .then(function (response) {
      console.log("Searching for",response);
      let search_result = response.events[0];
      self.setState({search_result: search_result});
      console.log("Event Search",search_result);
     })
    .catch(function (error) {
      console.log(error);
    });
  }

  //Go to top
  goTop() {
    window.scrollTo(0, 0);
  }

  //Load More Events
  loadMore() {
    this.setState({count: this.state.count+1}, () => {
      this.onloadPage(this.state.count);
    });
    window.scrollTo(0, 262);
  }

  loadLess() {
    this.setState({count: this.state.count-1}, () => {
      this.onloadPage(this.state.count);
    });
    window.scrollTo(0, 262);
  }

  //Event Details from API
  onloadPage(page_no) {
    console.log("Page No",page_no);
    let self = this;
    let page = '';
    {page_no ? page = page_no : page = 1}
    let url = "v1/events/?on_dashboard=false&per_page=10&page=" + page;
    ApiCall.getApiCall(url)
    .then(function (response) {
      let events = response.events;
      self.setState({events: events});
       console.log("EventListUser",response);
     })
    .catch(function (error) {
      console.log(error);
    });
  }

  //Getting Unique Combo values
  comboClick() {
    var input = this.state.search_event;
    let self = this;
    let location = [];
    let cityArray = [];
     let url = "v1/events/?on_dashboard=false" + input;
     ApiCall.getApiCall(url)
     .then(function (response) {
       let events = response.events;
       for(var i = 0; i < response.events_count; i++) {
         var obj = response.events[i];
         {obj.locations[0] ? location.push(obj.locations[0].city) : null};
       }
       let cityUnique = _.uniq(location, 'city');
       for(var j = 0; j< cityUnique.length; j++){
        cityArray.push(cityUnique[j]);
       }
       self.setState({cityArray: cityArray});

      })
     .catch(function (error) {
       console.log(error);
     });
   }

  //Creating the list of event ids
  onCheckUncheck(field, e){
    let self = this;
    let list_value = parseInt(e.target.value);
    self.checkedList(list_value);
  }

  checkedList(value) {
    let self = this;
    var i = -1;
    i = self.state.selected_events.indexOf(value);
    if(i != -1) {
     self.state.selected_events.splice(i,1);
     if(self.state.selected_events.length == 0) {
       document.getElementById('popup_link').href = "#";
       document.getElementById("popup_button").disabled = true;
     }

    }
    else {
     self.setState({
       selected_events: self.state.selected_events.concat(value)
     }, () => {
       console.log("list concat event",self.state.selected_events)
     });
     document.getElementById('popup_link').href = "#bucket_popup";
     document.getElementById("popup_button").disabled = false;
    }
  }

  //Clear Event Checkbox
  clearEventList() {
    $(".event-checkbox").attr("checked", false);
    this.state.selected_events = [];
    console.log("list concat event",this.state.selected_events);
    document.getElementById('popup_link').href = "#";
    document.getElementById("popup_button").disabled = true;
  }

  //LifeCycle
  componentDidMount() {
    let getToken = Cookies.get('myToken');
    this.setState({getToken:getToken});
    this.onloadPage();
  }

  render() {
    let self = this;
    var eventIDs = [];
    eventIDs = self.state.selected_events;
    return (
      <div>
      <Header />
        <div className="text-center jumbotron body_container">
          <h1 className="title">
            <span><b>All </b></span>
            <span style={{color: "#16aac4"}}><b>Events</b></span>
          </h1>
          <form className="navbar-form" role="search">
            <div className="input-group add-on">
              <input
                className="form-control"
                type='text'
                size='45'
                placeholder='Type to search an Event'
                onChange={this.handleSearch.bind(this)}
                value={this.state.search_event} />
              <div className="input-group-btn">
                <button
                  className="btn btn-default"
                  type='submit'
                  onClick={this.handleGoClick}>
                  <i className="glyphicon glyphicon-search"></i>
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-sm-2">
              <div className="dropdown text-center">
                <button
                  className="alert alert-info dropdown-toggle filter-dropdown"
                  type="button"
                  data-toggle="dropdown">
                  Date&emsp;
                  <span className="caret"></span>
                </button>
                <ul className="dropdown-menu">
                  <li><input type="text" placeholder="From Date" /></li>
                  <li><input type="text" placeholder="To Date" /></li>
                </ul>
              </div>
              <div className="dropdown text-center">
                <button
                  className="alert alert-info dropdown-toggle filter-dropdown"
                  type="button"
                  data-toggle="dropdown"
                  onClick={this.comboClick.bind(this)}>
                    Place&emsp;
                    <span className="caret"></span>
                </button>
                <ul className="dropdown-menu">
                  {this.state.cityArray.map(function(city, index){
                    return <li className="text-center" key={ index }>
                              <input
                                type="checkbox" /> {city}
                           </li>;
                  })}
                </ul>
              </div>
              <div style={{padding: "10px"}} className="btn btn-info pull-right">
                <b>Submit</b>
              </div>
            </div>
            <div className="col-sm-6">
              {!this.state.search_result ?
                <div>
                  {this.state.events.map(function (event, i) {
                    return (
                      <div key={i}>
                        <div className="row">
                          { self.state.getToken ?
                            <div className="col-sm-1">
                              <input
                                className="checkbox-inline event-checkbox"
                                type="checkbox"
                                value={event.id}
                                onChange={self.onCheckUncheck.bind(self, "status_changed")} />
                            </div>
                          :
                            null
                          }
                          <div className="col-sm-11">
                            <Link to={{
                              pathname: '/EventDetails',
                              state: {eventId: event.id, eventSlug: event.slug}
                            }}
                            className="link-underline">
                              <div className="panel panel-default">
                                <div className="panel-heading">
                                  <div className="row">
                                    <div className="col-sm-10">
                                      <h4 style={{color: "#d9093a"}}><b>{event.name}</b></h4>
                                    </div>
                                    <div className="col-sm-2">
                                      <img className="pull-right share" src="./assets/images/glyphicons-309-share-alt.png" />
                                    </div>
                                  </div>
                                </div>
                                <div className="panel-body">
                                  <p className="hidden">{event.id}</p>
                                  <h4>{event.description}</h4>
                                  { event.locations.length > 0 ?
                                    <div className="row">
                                      <div className="col-sm-1">
                                        <span className="glyphicon glyphicon-map-marker"></span>
                                      </div>
                                      <div className="col-sm-11">
                                        {event.locations.map(function (locations, j) {
                                          return (
                                            <p key={j}>({j+1}) {locations.venue} {locations.city} {locations.country}</p>
                                          )
                                        })}
                                      </div>
                                    </div>
                                  :
                                    null
                                  }
                                 <div className="row">
                                   <div className="col-sm-1">
                                     <span className="glyphicon glyphicon-calendar" style={{padding: "5px"}}></span>
                                   </div>
                                   <div className="col-sm-11" style={{paddingTop: "7px", paddingLeft: "17px"}}>
                                     From
                                     &emsp;{event.start_at.substring(0,16).replace("T"," ")}
                                     &emsp;To
                                     &emsp;{event.end_at.substring(0,16).replace("T"," ")}
                                   </div>
                                 </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                    )
                  })}
                  <div className="text-center">
                    <span className="glyphicon glyphicon-step-backward" onClick={this.loadLess}></span>
                    <span className="glyphicon glyphicon-step-forward" onClick={this.loadMore}></span>
                  </div>
                  <br /><br /><br />
                </div>
                :
                <div className="row">
                  { self.state.getToken ?
                    <div className="col-sm-1">
                      <input className="checkbox-inline" type="checkbox" value="" />
                    </div>
                  :
                    null
                  }
                  <div className="col-sm-11">
                    <Link to= {{
                      pathname: '/EventDetails',
                      state: {eventId: this.state.search_result.id, eventSlug: this.state.search_result.slug} }}
                      className="link-underline" >
                      <div className="panel panel-default">
                        <div className="panel-heading">
                          <div className="row">
                            <div className="col-sm-10">
                              <h4 style={{color: "#d9093a"}}><b>{this.state.search_result.name}</b></h4>
                            </div>
                            <div className="col-sm-2">
                              <img className="pull-right share" src="./assets/images/glyphicons-309-share-alt.png" />
                            </div>
                          </div>
                        </div>
                        <div className="panel-body">
                        <p className="hidden">{this.state.search_result.id}</p>
                        <h4>{this.state.search_result.description}</h4>
                        {this.state.search_result.locations.length > 0 ?
                          <div className="row">
                            <div className="col-sm-1">
                              <span className="glyphicon glyphicon-map-marker"></span>
                            </div>
                            <div className="col-sm-11">
                              {this.state.search_result.locations.map(function (locations, j) {
                                return (
                                  <p key={j}>({j+1}) {locations.venue} {locations.city} {locations.country}</p>
                                )
                              })}
                            </div>
                          </div>
                        :
                          null
                        }
                        <div className="row">
                          <div className="col-sm-1">
                            <span className="glyphicon glyphicon-calendar" style={{padding: "5px"}}></span>
                          </div>
                          <div className="col-sm-11" style={{paddingTop: "7px", paddingLeft: "17px"}}>
                            From
                            &emsp;{this.state.search_result.start_at.substring(0,16).replace("T"," ")}
                            &emsp;To
                            &emsp;{this.state.search_result.end_at.substring(0,16).replace("T"," ")}
                          </div>
                        </div>
                      </div>
                    </div>
                    </Link>
                  </div>
                </div>
              }
            </div>
            { this.state.getToken ?
              <div className="col-sm-2">
                <div>
                  { (this.state.selected_events.length != 0) ?
                    <AutoAffix viewportOffsetTop={75} container={this}>
                      <a data-toggle="modal" href="#bucket_popup" id="popup_link">
                        <button
                          type="button"
                          id="popup_button"
                          className="btn btn-warning"
                          onClick={this.refs.child.bucketsAndEvents()} >
                            Add to Bucket
                        </button>
                      </a>
                    </AutoAffix>
                    :
                    <AutoAffix viewportOffsetTop={75} container={this}>
                      <a data-toggle="modal" href="#"  id="popup_link">
                        <button
                          type="button"
                          id="popup_button"
                          className="btn btn-warning disabled" >
                            Add to Bucket
                        </button>
                      </a>
                    </AutoAffix>
                  }
                </div>
                <div className="col-sm-2" >
                  <Affix
                    offsetTop={500}
                    viewportOffsetTop={null}
                    topClassName={"hide-rocket"}
                    container={this}>
                      <img className="rocket" src="./assets/images/rocket.gif" onClick={this.goTop} />
                  </Affix>
                </div>
              </div>
            :
              <div className="col-sm-4">
                <div>
                  <h4 className="text-center" style={{color: "#d9093a"}}><b>Other Events</b></h4>
                  <div className="well well-lg">
                    <div className="panel panel-default">
                      <div className="panel-body">
                       <button className="btn btn-default pull-right" type="button">Joining ?</button>
                       <h5><b>Event Name</b></h5>
                       <div className="link-inline">
                         <ul className="list-inline">
                           <li className="text-left"><a href="#"><u>View more</u></a></li>
                           <li className="text-right"><a href="#"><u>View site</u></a></li>
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
                           <li className="text-left"><a href="#"><u>View more</u></a></li>
                           <li className="text-right"><a href="#"><u>View site</u></a></li>
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
                </div>
                <Affix
                  offsetTop={500}
                  viewportOffsetTop={null}
                  topClassName={"hide-rocket"}
                  container={this}>
                    <img className="rocket" src="./assets/images/rocket.gif" onClick={this.goTop} />
                </Affix>
              </div>
            }
          </div>
        </div>
        { this.state.getToken ?
          <BucketModal id={eventIDs} ref="child" parentMethod={this.clearEventList.bind(this)} />
        :
          null
        }
      </div>
    );
  }
}

import React, {Component} from "react";
import SearchBox from "react-google-maps/lib/components/places/SearchBox";
import { Radio } from "react-bootstrap";
import moment from "moment";

import Tags from "./Tags";
import MapWithAMarker from "./Map";
import { PreviewModal } from "./PreviewModal";
import EventDatePicker from "./EventDatePicker";
import Header from "../Header";
import ApiCall from "../../ApiCall";


export class CreateEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: [],
      tag_final: '',
      fields: {},
      errors: {},
      event_multiple_location: [],
      counter: 0,
      event_type: 'true',
      pass_addr: '',
      startDate: '',
      endDate: '',
      dispStartDate: '',
      dispEndDate: '',
      event_loc_store: []
    }
    this.createEvent = this.createEvent.bind(this);
    this.cancelEvent = this.cancelEvent.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.multipleRemove = this.multipleRemove.bind(this);
    this.handleTag = this.handleTag.bind(this);
    this.getDate = this.getDate.bind(this);
  }

  //Create Form
  createEvent(e) {
    e.preventDefault();
    this.handleValidation();
  }

  //Validation Checking
  handleValidation() {
    let self = this;
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    //Event Name
    if(!fields["event_name"]) {
       formIsValid = false;
       errors["event_name"] = "Event Name is required";
    }

    //Event Description
    if(!fields["event_description"]) {
       formIsValid = false;
       errors["event_description"] = "Event Description is required";
    }

    //Event Start Date
    if(this.state.startDate == '') {
       formIsValid = false;
       errors["event_startdate"] = "Start Date is required";
    }

    //Event End Date
    if(this.state.endDate == '') {
       formIsValid = false;
       errors["event_enddate"] = "End Date is required";
    }

    //Event location
    if(this.state.event_multiple_location.length == 0) {
       formIsValid = false;
       errors["event_multiple_location"] = "Event Location is required";
    }

   //Create Event Successful
   if(formIsValid) {
     let getToken = Cookies.get('myToken');
     let input = {
       "bucket_id": this.props.location.state.bucket_id.id,
       "name": this.state.fields["event_name"],
       "description": this.state.fields["event_description"],
       "start_at": this.state.startDate,
       "end_at": this.state.endDate,
       "locations": this.state.event_loc_store,
       "is_public": this.state.event_type,
       "url": this.state.fields["event_url"],
       "tags": this.state.tag_final
     }
     console.log(input);
    let url = "v1/buckets/create-event";
    ApiCall.postApiCall(url, input, getToken)
    .then(function (response) {
      console.log("Created Event",response);
      if(response.status == 200){
        window.history.back();
      }
    })
    .catch(function (error) {
      console.log(error);
    });
   }
   this.setState({errors: errors});
  }

  //Cancel Form
  cancelEvent() {
    this.setState({
      fields: {},
      event_multiple_location: '',
      startDate: '',
      endDate: '',
      event_type: 'true',
      tag_final: ''
    });
    this.refs.date_child.setState({
      startDate: null,
      endDate: null
    });
    this.refs.tags_child.setState({
      tags: [],
      i: 0
    });
  }

  //Remove Map Location
  onRemove() {
    this.setState({
      fields: {
        event_venue: '' ,
        event_addrlane1: '' ,
        event_addrlane2: '',
        event_lane: '',
        event_city: '',
        event_state: '',
        event_country: '',
        event_pin: ''
      }
    });
  }

  multipleRemove() {
    this.setState({
      event_multiple_location: []
    });
  }

  //Input values
  onChange(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({fields});
  }

  radioChange(e) {
    this.setState({
      event_type: e.target.value,
      counter: 0
    })
  }

  //Pass multuple location
  passMultiLoc() {
    let temp1, temp2 = '';
    let i;
    temp1 = this.state.event_multiple_location[0];
    for( i = 1; i < this.state.event_multiple_location.length; i++) {
      temp2 = this.state.event_multiple_location[i]
      temp1 = temp1.concat("\n",temp2);
      console.log("pass_addr", temp1);
    }
    console.log("final", temp1);
    this.setState({pass_addr: temp1});
  }

  //Google Place Fetch
  getLocation(locationValue) {
    { locationValue[0] ?
      this.autoFillSuburb(locationValue[0], this.state.counter)
    :
      this.manualFillSuburb()
    }
    (this.state.counter) += 1;
  }

  //Auto multuple location store
  autoFillSuburb(place, c) {
    if(c >0 && c%2 != 0) {
      let data = {
        venue: "",
        address_lane_1: "",
        address_lane_2: "",
        lane: "",
        city: "",
        state: "",
        country: "",
        pin: ""
      };
     for( var i = 0; i < place.address_components.length; i++ ){
       for( var j = 0; j < place.address_components[i].types.length; j++ ){
         switch (place.address_components[i].types[j]) {
         case "street_number":
           data.lane = place.address_components[i].long_name;
           break;
         case "route":
           if(!data.lane){
             data.lane = place.address_components[i].long_name
           }else {
             data.lane = data.lane.concat(", ",place.address_components[i].long_name);
           }
           break;
         case "sublocality_level_3":
           data.address_lane_1 = place.address_components[i].long_name;
           break;
         case "sublocality_level_2":
           if(!data.address_lane_1){
             data.address_lane_1 = place.address_components[i].long_name
           }else {
             data.address_lane_1 = data.address_lane_1.concat(", ",place.address_components[i].long_name);
           }
           break;
         case "sublocality_level_1":
           data.address_lane_2 = place.address_components[i].long_name;
           break;
         case "administrative_area_level_2":
           data.city = place.address_components[i].long_name;
           break;
         case "administrative_area_level_1":
           data.state = place.address_components[i].long_name;
           break;
         case "country":
           data.country = place.address_components[i].long_name;
           break;
         case "postal_code":
           data.pin = place.address_components[i].long_name;
           break;
         }
       }
     }
     this.state.event_loc_store.push(data);

     this.setState({location: place});
     let temp = this.state.location.formatted_address;
     this.setState({event_multiple_location: this.state.event_multiple_location.concat(temp)});
    }
  }

  //Manual multuple location store
  manualFillSuburb() {
    let data = {
      venue: "",
      address_lane_1: "",
      address_lane_2: "",
      lane: "",
      city: "",
      state: "",
      country: "",
      pin: ""
    };
    data.venue = this.state.fields["event_venue"];
    data.lane = this.state.fields["event_lane"];
    data.address_lane_1 = this.state.fields["event_addrlane1"];
    data.address_lane_2 = this.state.fields["event_addrlane2"];
    data.city = this.state.fields["event_city"];
    data.state = this.state.fields["event_state"];
    data.country = this.state.fields["event_country"];
    data.pin = this.state.fields["event_pin"];

    this.state.event_loc_store.push(data);
    let temp = ((((((data.venue.concat(', ', data.lane)).concat(', ', data.address_lane_1)).concat(', ', data.address_lane_2)).concat(', ', data.city)).concat(', ', data.state)).concat(', ', data.country)).concat(', ', data.pin)
    this.setState({event_multiple_location: this.state.event_multiple_location.concat(temp)});
    this.onRemove();
  }

  //Tag Handle
  handleTag(tagValue) {
   let temp = '';
   for( var i = 0; i < tagValue.length; i++ ) {
     console.log(tagValue[i].text);
     temp = tagValue[i].text;
     this.setState({tag_final: this.state.tag_final.concat(temp,',')});
   }
  }

  //Get Date with format
  getDate(dateValue) {
    let dispStartDate = moment(dateValue.startDate).format('YYYY-MM-DD HH:mm');
    let dispEndDate = moment(dateValue.endDate).format('YYYY-MM-DD HH:mm');
    let startDate = moment(dateValue.startDate).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    let endDate = moment(dateValue.endDate).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    if(startDate != "Invalid date") {
      this.setState({
        startDate: startDate,
        dispStartDate: dispStartDate
      })
    }
    if(endDate != "Invalid date") {
      this.setState({
        endDate: endDate,
        dispEndDate: dispEndDate
      })
    }
  }

  //React LifeCycle
  componentDidMount() {
    window.scrollTo(0, 0);
  }


  render() {
    return (
      <div>
        <Header />
        <div className="text-center jumbotron body_container">
          <h1 className="title" style={{color: "#16aac4"}}><b>Start a new Event</b></h1>
          <h2>We will help you find the right people to make it happen</h2>
        </div>
        <div className="container">
          <h4 className="alert alert-info pull-left">
            Selected Bucket : <strong>{this.props.location.state.bucket_id.name}</strong>
          </h4>
          <br /><br /><br /><br />
          <ul className="no-bullet">
            <li>
              <h3 style={{color: "#d9093a"}}>Basic Information</h3>
              <input
                value={this.state.fields["event_name"] || ''}
                onChange={this.onChange.bind(this, "event_name")}
                className="form-control"
                type="text"
                placeholder="Type the event title here"
              />
              <span style={{color: "red"}}>{this.state.errors["event_name"]}</span>
              <br />
              <textarea
                value={this.state.fields["event_description"] || ''}
                onChange={this.onChange.bind(this, "event_description")}
                className="form-control"
                type="text"
                rows="5"
                placeholder="Enter event description here"
                style={{resize:"none"}}>
              </textarea>
              <span style={{color: "red"}}>{this.state.errors["event_description"]}</span>
              <br />
              <input
                value={this.state.fields["event_url"] || ''}
                onChange={this.onChange.bind(this, "event_url")}
                className="form-control"
                type="text"
                placeholder="Type the event website here"
              />
              <hr />
            </li>
            <li>
              <h3 style={{color: "#d9093a"}}>Venue and Date</h3>
              <div className="row">
                <div className="col-sm-6">
                <div>
                  <div>
                    <MapWithAMarker onLoad={this.getLocation} onChange={this.getLocation} />
                  </div>
                  <br />
                  <p>
                    Unable to locate? &nbsp;
                    <button
                      className="btn btn-default inline"
                      data-toggle="collapse"
                      data-target="#address_panel">
                        Enter an Address
                      </button>
                  </p>
                  <div id="address_panel" className="collapse">
                    <p>
                      <input
                        type="text"
                        placeholder="Venue"
                        value={this.state.fields["event_venue"] || ''}
                        onChange={this.onChange.bind(this, "event_venue")}
                        className="form-control" />
                    </p>
                    <p>
                      <input
                        type="text"
                        placeholder="Address Lane 1"
                        value={this.state.fields["event_addrlane1"] || ''}
                        onChange={this.onChange.bind(this, "event_addrlane1")}
                        className="form-control" />
                    </p>
                    <p>
                      <input
                        type="text"
                        placeholder="Address Lane 2"
                        value={this.state.fields["event_addrlane2"] || ''}
                        onChange={this.onChange.bind(this, "event_addrlane2")}
                        className="form-control" />
                    </p>
                    <p>
                      <input
                        type="text"
                        placeholder="Lane"
                        value={this.state.fields["event_lane"] || ''}
                        onChange={this.onChange.bind(this, "event_lane")}
                        className="form-control" />
                    </p>
                    <p>
                      <input
                        type="text"
                        placeholder="City"
                        value={this.state.fields["event_city"] || ''}
                        onChange={this.onChange.bind(this, "event_city")}
                        className="form-control" />
                    </p>
                    <p>
                      <input
                        type="text"
                        placeholder="State"
                        value={this.state.fields["event_state"] || ''}
                        onChange={this.onChange.bind(this, "event_state")}
                        className="form-control" />
                    </p>
                    <p>
                      <input
                        type="text"
                        placeholder="Country"
                        value={this.state.fields["event_country"] || ''}
                        onChange={this.onChange.bind(this, "event_country")}
                        className="form-control" />
                    </p>
                    <p>
                      <input
                        type="text"
                        placeholder="Pin"
                        value={this.state.fields["event_pin"] || ''}
                        onChange={this.onChange.bind(this, "event_pin")}
                        className="form-control" />
                    </p>
                    <br />
                    {(this.state.fields["event_venue"] && this.state.fields["event_addrlane1"] &&
                      this.state.fields["event_addrlane2"] && this.state.fields["event_lane"] &&
                      this.state.fields["event_city"] && this.state.fields["event_country"] &&
                      this.state.fields["event_state"] && this.state.fields["event_pin"] ) ?
                    <div className="text-center">
                      <button
                        className="btn btn-primary btn-sm btn-add-panel"
                        onClick={this.getLocation}>
                          <b>Save</b>
                      </button>
                      <button
                        className="btn btn-basic btn-sm btn-add-panel"
                        onClick={this.onRemove}>
                          <b>Reset the Address</b>
                      </button>
                    </div>
                    : null
                  }
                  </div>
                </div>
                </div>
                <div className="col-sm-6">
                  <div className="row">
                    <div className="col-sm-5">
                      <div>
                        <EventDatePicker onChange={this.getDate}  ref="date_child" />
                      </div>
                    </div>
                    <div className="col-sm-7">
                      <span style={{color: "red"}}>{this.state.errors["event_startdate"]}</span>
                      <br /><br /><br />
                      <span style={{color: "red"}}>{this.state.errors["event_enddate"]}</span>
                    </div>
                  </div>
                  <br /><br /><br /><hr />
                  <h4 style={{color: "#d9093a"}}>All Selected Addresses</h4>
                  {this.state.event_multiple_location.length > 0 ?
                    <div className="well">
                      <div>
                        <button
                          className="btn btn-primary btn-sm pull-right"
                          onClick={this.multipleRemove}>
                          Clear All
                        </button>
                        <br /><br />
                      </div>
                      <input className="well" type = "hidden" readOnly
                        value={this.state.event_multiple_location}
                        onChange={this.onChange.bind(this, "event_multiple_location")} />
                      {this.state.event_multiple_location.length > 1 ?
                        <ul className="list-group">
                          {this.state.event_multiple_location.map(function(event_multiple_location, index){
                            return (
                              <li className="list-group-item" key={ index }>
                                <div className="row">
                                  <div className="col-sm-1">
                                    <span className="badge pull-left">{index+1}</span>
                                  </div>
                                  <div className="col-sm-11">
                                    {event_multiple_location}
                                  </div>
                                </div>
                              </li>
                            )
                          })}
                        </ul>
                        :
                        <ul  className="list-group">
                          <li className="list-group-item">
                            <div className="row">
                              <div className="col-sm-1">
                                <span className="badge pull-left">1</span>
                              </div>
                              <div className="col-sm-11">
                                {this.state.event_multiple_location}
                              </div>
                            </div>
                          </li>
                        </ul>
                      }
                    </div>
                    :
                    <div className="well" style={{color: "gray"}}>
                      Please select some venue for your event.
                    </div>
                   }
                   <span style={{color: "red"}}>{this.state.errors["event_multiple_location"]}</span>
                </div>
              </div>
              <hr />
            </li>
            <li>
              <h3 style={{color: "#d9093a"}}>Other Details</h3>
              <div className="radio">
                <Radio
                  name="radioGroup"
                  value="true"
                  checked={this.state.event_type === "true"}
                  onChange={this.radioChange.bind(this)}>
                  Public (This event can be seen by all)
                </Radio>
              </div>
              <div className="radio">
                <Radio
                  name="radioGroup"
                  value="false"
                  checked={this.state.event_type === "false"}
                  onChange={this.radioChange.bind(this)}>
                  Private (This event can be seen only by this bucket invitees)
                </Radio>
              </div>
              <br />
              <p><b>Tags</b></p>
              <div
                value={this.state.fields["event_tag"] || ''}
                onChange={this.onChange.bind(this, "event_tag")} >
                <Tags onLoad={this.handleTag} ref="tags_child" />
              </div>
              <br /><br />
              <div className="space-btn">
                <button type="submit" className="btn btn-lg btn-success active" onClick={this.createEvent}>
                  <b>Create</b>
                </button>
                <a className="page-scroll" data-toggle="modal" href="#preview_popup" style={{padding: "0"}}>
                  <button type="button" className="btn btn-lg btn-warning" onClick={this.passMultiLoc.bind(this)}>
                    <b>Preview</b>
                  </button>
                </a>
                <button type="button" className="btn btn-lg btn-danger" onClick={this.cancelEvent}>
                  <b>Cancel</b>
                </button>
                <br/><br/><br />
              </div>
            </li>
          </ul>
          <br/><br/><br/><br/><br/><br/><br/><br/>
        </div>
        <PreviewModal
          eventBucket={this.props.location.state.bucket_id.name}
          eventName={this.state.fields["event_name"]}
          eventDescription={this.state.fields["event_description"]}
          eventURL={this.state.fields["event_url"]}
          eventStartDate={this.state.dispStartDate}
          eventEndDate={this.state.dispEndDate}
          eventMultipleLocation={this.state.pass_addr}
          eventVenue={this.state.fields["event_venue"]}
          eventAddrLane1={this.state.fields["event_addrlane1"]}
          eventAddrLane2={this.state.fields["event_addrlane2"]}
          eventLane={this.state.fields["event_lane"]}
          eventCity={this.state.fields["event_city"]}
          eventState={this.state.fields["event_state"]}
          eventCountry={this.state.fields["event_country"]}
          eventPin={this.state.fields["event_pin"]}
          eventType={this.state.event_type}
          eventTag={this.state.tag_final}
        />
      </div>
    );
  }
}

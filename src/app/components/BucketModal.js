import React, { Component } from "react";
import AlertContainer from 'react-alert';

import ApiCall from "../ApiCall";

export default class BucketModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        bucket_name: ''
      },
      list: [],
      buckets: [],
      buckets_and_events_response: [],
      existing_buckets: []
    }
    this.onCreateBucket = this.onCreateBucket.bind(this);
    this.onAdd = this.onAdd.bind(this);
  }

  //Bucket Fetching
  bucketList() {
    let self = this;
    let getToken = Cookies.get('myToken');
    let url = "v1/buckets";
    ApiCall.getApiCall(url, getToken)
    .then(function (response) {
      console.log("Bucket Fetching:", response);
      let buckets = response.buckets;
      buckets.reverse();
      self.setState({buckets: buckets});
     })
    .catch(function (error) {
      console.log(error);
    });
  }

  //Fetching buckets and events
  bucketsAndEvents() {
    let self = this;
    let getToken = Cookies.get('myToken');
    let url = "v1/buckets/buckets-and-events";
    ApiCall.getApiCall(url, getToken)
    .then(function (response) {
      console.log("Bucket and Events Fetching:", response);
      let buckets_and_events = response;
      self.setState({buckets_and_events_response: buckets_and_events})
      console.log("buckets-and-events:", buckets_and_events[71].bucket.id);
      self.checkExistingBuckets();
     })
    .catch(function (error) {
      console.log(error);
    });
  }

  checkExistingBuckets() {
    let bucket_list = this.state.buckets_and_events_response;
    for(var i = 0; i < bucket_list.length; i++) {
      let count = 0;
      let event_list = this.state.buckets_and_events_response[i].events;
      for(var j = 0; j < event_list.length; j++) {
        for (var k = 0; k < this.props.id.length; k++) {
          if(this.props.id[k] == event_list[j].id) {
            count += 1;
          }
        }
      }
      if(count == this.props.id.length && count != 0) {
        this.setState({
          existing_buckets: this.state.existing_buckets.concat(bucket_list[i].bucket.id)
        })
      }
    }
    console.log("Existing Buckets", this.state.existing_buckets);
  }

  //Create new Bucket
  onCreateBucket(e) {
    e.preventDefault();
    this.onAddBucket();
  }

  onAddBucket() {
    let self = this;
    let getToken = Cookies.get('myToken');
    let input = {
      "name" :  this.state.fields["bucket_name"]
    }
    let url = "v1/buckets/create-bucket";
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

  //Input value Fetching
  onChange(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({fields});
  }

  //Creating the list of bucket ids
  onCheckUncheck(field, e) {
    let self = this;
    let list_value = parseInt(e.target.value);
    self.checkedList(list_value);
  }

  checkedList(value) {
    let self = this;
    var i = -1;
    i = self.state.list.indexOf(value);
    if(i != -1) {
      self.state.list.splice(i,1);
    }
    else {
      self.setState({
        list: self.state.list.concat(value)
      }, () => {
        console.log("list concat bucket",self.state.list)
      });
    }
  }

  //Getting eventId
  handleClick(e, bucket)  {
    console.log("bucket", bucket);
  }

  //Add button funtionality
  onAdd() {
    let self = this;
    let bucket_array = self.state.list;
    let event_array = self.props.id;
    let bucket_array_element;
    let event_array_element;
    let getToken = Cookies.get('myToken');
    if(bucket_array.length == 0) {
      self.bucketAlert();
    }
    for(var i = 0; i<bucket_array.length; i++){
      bucket_array_element = bucket_array[i];
      for(var j = 0; j<event_array.length; j++){
        event_array_element = event_array[j];
        let input ={
          "buckets_and_events" : {
            "buckets" : bucket_array_element,
            "events" : event_array_element
          }
        }
        let url = "v1/buckets/add-events";
        ApiCall.postApiCall(url, input, getToken)
        .then(function (response) {
          if(response.status == 200){
            console.log("Event added to bucket: ",response);
          }
         })
        .catch(function (error) {
          console.log(error);
        });
      }
    }
    this.clearBucketList();
    if(this.props.parentMethod != undefined) {
      this.props.parentMethod();
    }
  }

  clearBucketList() {
    $(".bucket-checkbox").attr("checked", false);
    this.state.list = [];
    this.state.existing_buckets = [];
  }

  //Flash message Design
  alertOptions = {
    offset: 14,
    position: 'top center',
    theme: 'light',
    time: 5000,
    transition: 'scale'
  }

  //Add button Flash message
  bucketAlert() {
    this.msg.show("No bucket(s) selected", {
      time: 5000,
      type: 'error',
      icon: <img className="pull-right" src="./assets/images/error.gif" />
    })
  }

  // On Page Load
  componentDidMount() {
    this.bucketList();
  }

  render() {
    let self =this;
    return (
      <div>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
        <div
          id="bucket_popup"
          className="modal fade form-popup"
          role="dialog"
          data-backdrop="static"
          data-keyboard="false">
          <div className="modal-dialog" style={{width:"350px"}}>
            <div className="modal-content">
              <div className="modal-header" style={{background: "#23231f"}}>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  onClick={this.clearBucketList.bind(this)}
                   style={{color: "#ffffff"}}>
                  &times;
                </button>
                <h3 className="modal-title" style={{color: "#16aac4"}}><b>Choose a Bucket</b></h3>
              </div>
              <div className="modal-body">
                <ul id="bucket-list">
                  { this.state.buckets.map(function (bucket, i) {
                    if(self.state.existing_buckets.indexOf(bucket.id) == -1){
                      return (
                        <li key={i}>
                          <input
                            className="bucket-checkbox"
                            type="checkbox"
                            value={bucket.id}
                            refs="status_changed"
                            onChange={self.onCheckUncheck.bind(self, "status_changed")} />
                          <label>{bucket.name}</label>
                        </li>
                      )
                    }
                    else {
                      return (
                        <li key={i}>
                          <span className="glyphicon glyphicon-ok" value={bucket.id}></span>
                          <label>{bucket.name}</label>
                        </li>
                      )
                    }
                  })}
                </ul>
                <div className="alert alert-info">
                  <input
                    className="form-control"
                    rows="3"
                    value={this.state.fields["bucket_name"]}
                    onChange={this.onChange.bind(this, "bucket_name")}
                    refs="bucket_name"
                    placeholder="Create Your New Bucket"
                    type="text"
                  />
                  <br />
                  <button
                    type="button"
                    className="btn btn-info"
                    onClick={this.onCreateBucket}>
                    <b>Create a Bucket</b>
                  </button>
                </div>
              </div>
              <div className="modal-footer" style={{background: "#23231f"}}>
                <div className="text-center">
                  <button
                    type="button"
                    className="btn btn-success"
                    data-dismiss="modal"
                    onClick={this.onAdd}>
                    <b>ADD</b>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

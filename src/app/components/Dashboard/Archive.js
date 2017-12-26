import React, {Component} from "react";
import { Link } from "react-router-dom";

import Header from "../Header";
import ApiCall from "../../ApiCall";

export class Archive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buckets: []
    }
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
      console.log("Buckets",buckets);
      self.setState({buckets: buckets});
     })
    .catch(function (error) {
      console.log(error);
    });
  }

  // On Page Load
  componentDidMount() {
    this.bucketList();
  }


  render() {
    return (
      <div className="container" style={{padding: "80px 50px 50px 80px"}}>
        <Header />
        <div className="row">
          <div className="col-sm-2">
            <Link to="/Dashboard">
              <button className="btn btn-default pull-left" type="button">
                <span className="glyphicon glyphicon-menu-left"></span>
                Back
              </button>
            </Link>
            <br /><br />
            <div>
              <button
                className="btn btn-primary dropdown-toggle"
                type="button" data-toggle="dropdown">
                  Your Buckets <span className="caret"></span>
              </button>
              <ul className="dropdown-menu theme-dropdown">
                <li><input type="text" placeholder="Enter bucket name"/>
                  <div className="dd-action">
                    <span className="glyphicon glyphicon-ok"></span>
                    <span className="glyphicon glyphicon-remove"></span>
                  </div>
                </li>
                {this.state.buckets.map(function (bucket, i) {
                  return (
                  <li key={i}>
                    <a href="#" value={bucket.name}>{bucket.name}</a>
                  </li>
                  )
                })}
              </ul>
            </div>
          </div>
          <div className="col-sm-10">
            <h3 className="text-center">Archived Events of Chennai Bucket (demo)</h3>
            <div className="text-center">
              <ul className="pagination">
                <li><a href="#">Newest</a></li>
                <li><a href="#">Oldest</a></li>
              </ul>
            </div>
            <div className="row">
              <div className="col-sm-6">
                <div className="panel panel-default">
                  <div className="panel-body">
                   <button className="btn btn-default pull-right" type="button" disabled>Archived</button>
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
              <div className="col-sm-6">
                <div className="panel panel-default">
                  <div className="panel-body">
                   <button className="btn btn-default pull-right" type="button" disabled>Archived</button>
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
              <div className="col-sm-6">
                <div className="panel panel-default">
                  <div className="panel-body">
                   <button className="btn btn-default pull-right" type="button" disabled>Archived</button>
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
              <div className="col-sm-6">
                <div className="panel panel-default">
                  <div className="panel-body">
                   <button className="btn btn-default pull-right" type="button" disabled>Archived</button>
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
              <div className="col-sm-6">
                <div className="panel panel-default">
                  <div className="panel-body">
                   <button className="btn btn-default pull-right" type="button" disabled>Archived</button>
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
              <div className="col-sm-6">
                <div className="panel panel-default">
                  <div className="panel-body">
                   <button className="btn btn-default pull-right" type="button" disabled>Archived</button>
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
              <div className="col-sm-6">
                <div className="panel panel-default">
                  <div className="panel-body">
                   <button className="btn btn-default pull-right" type="button" disabled>Archived</button>
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
              <div className="col-sm-6">
                <div className="panel panel-default">
                  <div className="panel-body">
                   <button className="btn btn-default pull-right" type="button" disabled>Archived</button>
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
          </div>
        </div>
      </div>
    );
  }
}

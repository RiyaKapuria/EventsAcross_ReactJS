import React, { Component } from 'react';
import { render } from "react-dom";

export default class HomeFooter extends Component {
  render() {
    return (
      <div>
        <div id="footer">
          <div className="row">
            <div className="col-sm-5">
            <h3 className="footertext"><b>About Developers</b></h3>
            <hr /><br />
            </div>
            <div className="col-sm-7">
            <h3 className="footertext"><b>About Company</b></h3>
            <hr /><br />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-2">
              <center>
                <div className="fill">
                  <img src="./assets/images/riya.jpg" className="img-circle crop" alt="R K" />
                </div>
                <h4 className="footertext"><b>Riya Kapuria</b></h4>
                <p className="footertext">
                  <span className="glyphicon glyphicon-envelope"></span>
                  &nbsp;riya@railsfactory.org
                </p>
                <p className="footertext">
                  <span className="glyphicon glyphicon-phone-alt"></span>
                  &nbsp;+91-8610624912
                </p>
                <p className="footertext">
                  <a href="https://www.linkedin.com/in/riya-kapuria-99b6b4106/" target="_blank">
                    <img src="./assets/images/social/linkedin_24x24.png"></img>
                  </a>
                  &nbsp;
                  <a href="https://www.facebook.com/kapuria.riya" target="_blank">
                    <img src="./assets/images/social/facebook_24x24.png" />
                  </a>
                  &nbsp;
                  <a href="https://www.instagram.com/kapuria_riya/" target="_blank">
                    <img src="./assets/images/social/instagram_24x24.png" />
                  </a>
                </p>
              </center>
            </div>
            <div className="col-sm-3">
              <center>
                <div className="fill">
                  <img src="./assets/images/sharanya.png" className="img-circle crop" alt="S S" />
                </div>
                <h4 className="footertext"><b>Sharanya Sarkar</b></h4>
                <p className="footertext">
                  <span className="glyphicon glyphicon-envelope"></span> sharanya@railsfactory.org
                </p>
                <p className="footertext">
                  <span className="glyphicon glyphicon-phone-alt"></span> +91-8100167994
                </p>
                <p className="footertext">
                  <a href="https://www.linkedin.com/in/sharanya-sarkar-4b0988b8/" target="_blank">
                    <img src="./assets/images/social/linkedin_24x24.png" />
                  </a>
                  &nbsp;
                  <a href="https://www.facebook.com/sharanya.sarkar.2311" target="_blank">
                    <img src="./assets/images/social/facebook_24x24.png" />
                  </a>
                  &nbsp;
                  <a href="https://www.instagram.com/sharanya_sarkar/" target="_blank">
                    <img src="./assets/images/social/instagram_24x24.png" />
                  </a>
                </p>
              </center>
            </div>
            <div className="col-sm-7 text-center">
              <h4 className="footertext">We started off as a small team in 2006 to build amazing products
              and solutions for companies that need them. Over time, we have built over 500 applications,
              some of which even got featured on Techcrunch.</h4>
              <br />
              <img src="./assets/images/railsfactory.png" alt="RailsFactory" />
              <br /><br />
              <p className="footertext">
                <a href="https://www.linkedin.com/company/396409" title="LinkedIn" target="_blank">
                  <img src="./assets/images/social/linkedin_32x32.png" alt="linkedin"></img>
                </a>
                &emsp;
                <a href="https://www.facebook.com/RailsFactory/" title="Facebook" target="_blank">
                  <img src="./assets/images/social/facebook_32x32.png" alt="facebook" />
                </a>
                &emsp;
                <a href="https://twitter.com/railsfactory" title="Twitter" target="_blank">
                  <img src="./assets/images/social/instagram_32x32.png" alt="twitter" />
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="row" style={{background: "#262525",margin: "0", padding:"0"}}>
          <br />
          <p className="footertext" style={{paddingLeft:"30px"}}>
            <span className="glyphicon glyphicon-copyright-mark">
            </span> 2017-2018 Events Across React JS All Rights Reserved
          </p>
        </div>
      </div>
    );
  }
};

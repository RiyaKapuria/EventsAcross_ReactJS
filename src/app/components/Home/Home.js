import React, { Component } from 'react';
import axios from 'axios';

import Header from '../Header';
import CarouselComp from './CarouselComp';
import HomeFooter from '../HomeFooter';

export class Home extends Component {
  render () {
    return (
      <div>
        <Header />
        <div>
          <p className="home-text">
            <span style={{color: "#16aac4", fontSize: "90px"}}>Events Across</span><br />
            <span style={{color: "#d9093a", fontSize: "70px"}}>&emsp;&emsp;&emsp;&emsp;Changing Lives !!</span>
          </p>
          <img className="home-image" alt="Home Background" src="./assets/images/homeEvent.jpg" />
        </div>
        <div className="container">
          <CarouselComp />
          <div className="row">
            <p className="text-center" style={{fontSize:"50px", fontWeight: "600"}}>What you can do ?</p>
            <div className="col-sm-4">
              <div className="text-center home-holder-danger">
                <h2><b>Trending Events</b></h2><br />
                <h4>Getting together with real people in real life makes powerful things happen.
                 Side hustles become careers, ideas become movements, and chance encounters become lifelong connections.
                 Meetup brings people together to create thriving communities.</h4><br /><br />
                 <img alt="Home Background" src="./assets/images/trendingEvents.png" />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="text-center home-holder-warning">
               <h2><b>Build your career</b></h2><br />
               <h4>Find a Meetup. Discover local Meetups for all the things you love..</h4>
               <h4>Create a Meetup. Create your own Meetup, and draw from a community of millions.</h4><br /><br />
               <img alt="Home Background" src="./assets/images/buildCareer.png" /><br /><br />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="text-center home-holder-info">
                <h2><b>Get creative</b></h2><br />
                <h4>Record a podcast, jam out, write a screenplay, discuss art, design a mural,
                or create something else entirely.Take a class, expand your network, learn a language,
                test a prototype, or pitch to investors</h4>
                <img alt="Home Background" src="./assets/images/getCreative.png" />
              </div>
            </div>
          </div>
        </div>
        <br /><br /><br /><br />
        <HomeFooter />
      </div>
    );
  }
}

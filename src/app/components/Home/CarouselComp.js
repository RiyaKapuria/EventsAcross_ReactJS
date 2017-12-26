import React, { Component } from 'react';
import { Carousel } from 'react-bootstrap';

export default class CarouselComp extends Component {
    render() {
      return (
        <div className="container carsouselStyle text-center">
          <Carousel>
            <Carousel.Item>
              <div>
                <img width={750} height={350} alt="300x150" src="./assets/images/event1.jpg" className="imgStyle"/>
              </div>
             <Carousel.Caption>
               <h3>Event 1</h3>
               <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
             </Carousel.Caption>
           </Carousel.Item>
           <Carousel.Item>
            <div>
              <img width={750} height={350} alt="300x150" src="./assets/images/image2.jpg" className="imgStyle"/>
            </div>
             <Carousel.Caption>
               <h3>Event 2</h3>
               <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
             </Carousel.Caption>
           </Carousel.Item>
           <Carousel.Item>
            <div>
              <img width={750} height={350} alt="300x150" src="./assets/images/image3.jpg" className="imgStyle"/>
            </div>
             <Carousel.Caption>
               <h3>Event 3</h3>
               <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
             </Carousel.Caption>
           </Carousel.Item>
           <Carousel.Item>
            <div>
              <img width={750} height={350} alt="300x150" src="./assets/images/image1.jpg" className="imgStyle"/>
            </div>
             <Carousel.Caption>
               <h3>Event 4</h3>
               <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
             </Carousel.Caption>
           </Carousel.Item>
           <Carousel.Item>
            <div>
              <img width={750} height={350} alt="300x150" src="./assets/images/image4.jpeg" className="imgStyle"/>
            </div>
             <Carousel.Caption>
               <h3>Event 5</h3>
               <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
             </Carousel.Caption>
           </Carousel.Item>
         </Carousel>
       </div>
     );
   }
};

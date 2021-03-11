import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import gsap from 'gsap';
import view1 from "../../assets/images/resort/view1.jpg";
import view2 from "../../assets/images/resort/view2.jpg";
import view3 from "../../assets/images/resort/view3.jpg";
import view4 from "../../assets/images/resort/view4.jpg";
import view5 from "../../assets/images/resort/view5.jpg";

const imageArray = [view1, view2, view3, view4, view5];

function Features() {
    const [front, setFront ] = useState(0);
    const [back, setBack ] = useState(0);

    const imageHandler = (value) => {
      setTimeout(() => {
        setFront(value);
      }, 300);
      setBack(front);
    }

  
    useEffect(() => {
      const tl = gsap.timeline();
      tl.from(".image .image-2", 0.8, {   
        x: "-100%",
        ease: "expo.inOut",
      });

    }, [front]);

  return (
    <>
      <div className="image">
        <img className="image-1" src={imageArray[back]} alt="" />
        <img className="image-2" src={imageArray[front]} alt="" />
      </div>
      <div className="content">
        <p className="content-desc">We provide you these</p>
        <h2>FEATURES</h2>
        <div className="feature-list">
          <div className="feature"><p onClick={() => imageHandler(0)}>Restaurant and Juice Bar</p></div>
          <div className="feature"><p onClick={() => imageHandler(1)}>Fitness center</p></div>
          <div className="feature"><p onClick={() => imageHandler(2)}>Swimming Pool</p></div>
          <div className="feature"><p onClick={() => imageHandler(3)}>Garden & Walk way</p></div>
          <div className="feature"><p onClick={() => imageHandler(4)}>Play Ground</p></div>
        </div>
        <Link to="/">View More</Link>
      </div>
    </>
  );
}

export default Features;

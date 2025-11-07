import React from "react";
import "./CSS/WeddingBanner.css";

const WeddingBanner = () => {
  return (
    <div className="banner-section">
      {/* Left Banner */}
      <div
        className="banner-box"
        style={{
          backgroundImage:
            "url('https://manyavar.scene7.com/is/image/manyavar/Feature%20Banner%20video%20call_D_31-07-2025-11-55?wid=650&hei=500')", // replace with your left image
        }}
      >
        {/* <div className="banner-content">
          <h2>Your personal stylist at your service!</h2>
          <p>Consult our expert stylist to curate a look for your D day</p>
          <button className="banner-button">BOOK A VIDEO CALL</button>
        </div> */}
      </div>

      {/* Right Banner */}
      <div
        className="banner-box"
        style={{
          backgroundImage:
            "url('https://manyavar.scene7.com/is/image/manyavar/Feature%20Banner%20wedding%20closet_D_31-07-2025-11-55?wid=650&hei=500')", // replace with your right image
        }}
      >
        {/* <div className="banner-content">
          <h2>Your Dream Wedding Wardrobe, Just a Click Away</h2>
          <p>Design Your Wedding Wardrobe with Manyavar. It's FREE!</p>
          <button className="banner-button">CURATE YOUR LOOK</button>
        </div> */}
      </div>
    </div>
  );
};

export default WeddingBanner;

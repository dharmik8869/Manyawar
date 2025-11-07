import React from "react";
import "./CSS/SpotlightSection.css";

const SpotlightSection = () => {
  return (
    <div className="spotlight-container">
      {/* Decorative icon + heading */}
      <div className="spotlight-title">
        {/* <img
          src="https://cdn-icons-png.flaticon.com/512/10396/10396729.png" // 🔁 replace with your orange design icon
          alt="Decorative Icon"
          className="spotlight-icon"
        /> */}
        <h2>IN THE SPOTLIGHT</h2>
        {/* <img
          src="https://manyavar.scene7.com/is/image/manyavar/Spotlight%20banner_D_1_31-07-2025-11-55?wid=1290&hei=400"
          alt="Decorative Icon"
          className="spotlight-icon"
        /> */}
      </div>

      {/* Banner Image */}
      <img
        src="https://manyavar.scene7.com/is/image/manyavar/Spotlight%20banner_D_1_31-07-2025-11-55?wid=1290&hei=400" // 🔁 Replace with your banner image
        alt="Spotlight Banner"
        className="spotlight-banner"
      />
    </div>
  );
};

export default SpotlightSection;

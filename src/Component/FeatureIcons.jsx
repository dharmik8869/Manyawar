import React from "react";
import "./CSS/FeatureIcons.css";

const features = [
  {
    img: "https://www.manyavar.com/on/demandware.static/Sites-manyavar-int-Site/-/default/dw57044e22/images/footer-made-in-india-icon.svg", // 🦁 Made in India icon
    title: "MADE IN INDIA",
  },
  {
    img: "https://www.manyavar.com/on/demandware.static/Sites-manyavar-int-Site/-/default/dw8ff9206a/images/footer-quality-icon.svg", // 🏅 Assured Quality icon
    title: "ASSURED QUALITY",
  },
  {
    img: "https://www.manyavar.com/on/demandware.static/Sites-manyavar-int-Site/-/default/dwafef8386/images/footer-secure-payment-icon.svg", // 💳 Secure Payments icon
    title: "SECURE PAYMENTS",
  },
  {
    img: "https://www.manyavar.com/on/demandware.static/Sites-manyavar-int-Site/-/default/dwafef8386/images/footer-secure-payment-icon.svg", // ✊ Empowering Weavers icon
    title: "EMPOWERING WEAVERS",
  },
];

const FeatureIcons = () => {
  return (
    <div className="feature-section">
      {features.map((item, index) => (
        <div className="feature-box" key={index}>
          <img src={item.img} alt={item.title} className="feature-icon" />
          <p>{item.title}</p>
        </div>
      ))}
    </div>
  );
};

export default FeatureIcons;

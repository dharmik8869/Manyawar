import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "./CSS/HeroSection.css";

const slides = [
  {
    id: 1,
    img: "https://manyavar.scene7.com/is/image/manyavar/HP_Hero_Banner_D_NEW_06-05-2025-10-24?$WT_HP%2FMLP%2FWLP_Hero_D$",
  },
  {
    id: 2,
    img: "https://manyavar.scene7.com/is/image/manyavar/HP_Hero_Banner_D_06-05-2025-09-46?$WT_HP%2FMLP%2FWLP_Hero_D$",
  },
  {
    id: 3,
    img: "https://manyavar.scene7.com/is/image/manyavar/HP_Mohey_Hero_Banner_D_New_25-09-2025-05-29?$WT_HP%2FMLP%2FWLP_Hero_D$",
  },
  {
    id: 4,
    img: "https://manyavar.scene7.com/is/image/manyavar/HP_banner_D_25-09-2025-06-49?$WT_HP%2FMLP%2FWLP_Hero_D$",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const goToSlide = (index) => setCurrent(index);

  return (
    <div className="hero-slider">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`slide ${index === current ? "active" : ""}`}
          style={{ backgroundImage: `url(${slide.img})` }}
        ></div>
      ))}

      {/* Navigation Arrows */}
      <button className="arrow left" onClick={prevSlide}>
        <FaArrowLeft />
      </button>
      <button className="arrow right" onClick={nextSlide}>
        <FaArrowRight />
      </button>

      {/* Dots Navigation */}
      <div className="dots">
        {slides.map((_, i) => (
          <span
            key={i}
            className={i === current ? "active" : ""}
            onClick={() => goToSlide(i)}
          ></span>
        ))}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import "./CSS/WeddingEdit.css";

const WeddingEdit = () => {
  const items = [
    {
      title: "Achkan Sherwani",
      img: "https://manyavar.scene7.com/is/image/manyavar/HP_WeddingEdit_AchkanSherwani_D_21-11-2023-04-41?$WT_HP_Vibe%2FTrending_D$",
    },
    {
      title: "Bridal Lehenga",
      img: "https://manyavar.scene7.com/is/image/manyavar/HP_WeddingEdit_BridalLehenga_D_21-11-2023-04-43?$WT_HP_Vibe%2FTrending_D$",
    },
    {
      title: "Layered Indo",
      img: "https://manyavar.scene7.com/is/image/manyavar/HP_WeddingEdit_LayeredIndowestern_D_21-11-2023-04-48?$WT_HP_Vibe%2FTrending_D$",
    },
  ];

  const [index, setIndex] = useState(0);

  const prevSlide = () => setIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  const nextSlide = () => setIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));

  return (
    <section className="wedding-edit">
      <h1 className="title">THE WEDDING EDIT</h1>

      <div className="slider-container">
        <button className="arrow left" onClick={prevSlide}>
          &#8592;
        </button>

        <div className="slider">
          {items.map((item, i) => (
            <div
              key={i}
              className={`slide ${i === index ? "active" : ""}`}
            >
              <img src={item.img} alt={item.title} />
              <h2>{item.title}</h2>
            </div>
          ))}
        </div>

        <button className="arrow right" onClick={nextSlide}>
          &#8594;
        </button>
      </div>
    </section>
  );
};

export default WeddingEdit;

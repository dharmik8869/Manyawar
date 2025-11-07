import React from "react";
import { Link } from "react-router-dom";
import "./CSS/VibeSection.css";

const vibeData = [
  {
    id: 1,
    img: "https://manyavar.scene7.com/is/image/manyavar/HP_Manyavar_Whats_your_vibe_IndoWestern_D_02-05-2025-11-33?$WT_HP_Vibe%2FTrending_D$",
    title: "Men's Collection",
    link: "/products?category=men"
  },
  {
    id: 2,
    img: "https://manyavar.scene7.com/is/image/manyavar/HP_Manyavar_Whats_your_vibe_KurtaSet_D_02-05-2025-11-34?$WT_HP_Vibe%2FTrending_D$",
    title: "Festive Wear",
    link: "/products?category=men"
  },
  {
    id: 3,
    img: "https://manyavar.scene7.com/is/image/manyavar/HP_Mohey_Whats_your_vibe_D_02-05-2025-11-34?$WT_HP_Vibe%2FTrending_D$",
    title: "Women's Collection",
    link: "/products?category=women"
  }
];

export default function VibeSection() {
  return (
    <section className="vibe-section">
      <div className="vibe-header">
        <div className="vibe-icon">🪔</div>
        <h2>WHAT'S YOUR VIBE?</h2>
      </div>

      <div className="vibe-grid">
        {vibeData.map((item) => (
          <Link to={item.link} key={item.id} className="vibe-card">
            <img src={item.img} alt={item.title} />
            <div className="vibe-overlay">
              <span>{item.title}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

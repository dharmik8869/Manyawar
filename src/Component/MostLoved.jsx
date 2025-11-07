import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../Context/ToastContext";
import "./CSS/MostLoved.css";

export default function MostLoved() {
  const navigate = useNavigate();
  const toast = useToast();
  const [category, setCategory] = useState("Men");

  const products = {
    Men: [
      {
        id: 1,
        name: "Ivory White Bel Buti Printed Jacket",
        price: 115,
        gst: 12,
        img: "https://manyavar.scene7.com/is/image/manyavar/8905100862140.4921_29-03-2023-21-44:283x395?&dpr=on,2",
      },
      {
        id: 2,
        name: "Teal Green Harlequin Patterned Angrakha Style Sequined Indo Western Jacket",
        price: 245,
        gst: 12,
        img: "https://manyavar.scene7.com/is/image/manyavar/8905100774795.11046_26-04-2023-21-42:283x395?&dpr=on,2",
      },
      {
        id: 3,
        name: "Buttercream Ogee Patterned Achkan Style Sherwani",
        price: 265,
        gst: 12,
        img: "https://manyavar.scene7.com/is/image/manyavar/8905100688917.32173_16-02-2023-01-05-1:283x395?&dpr=on,2",
      },
      {
        id: 4,
        name: "Ultramarine Blue Multi Patterned Kurta Set",
        price: 75,
        gst: 12,
        img: "https://manyavar.scene7.com/is/image/manyavar/8905100688917.32173_16-02-2023-01-05-1:283x395?&dpr=on,2",
      },
    ],
    Women: [
      {
        id: 1,
        name: "Red Bridal Lehenga Set",
        price: 425,
        gst: 12,
        img: "https://manyavar.scene7.com/is/image/manyavar/UL5187VD-422-WINE4_12-06-2025-11-00:283x395?&dpr=on,2",
      },
      {
        id: 2,
        name: "Pastel Pink Embroidered Saree",
        price: 185,
        gst: 12,
        img: "https://manyavar.scene7.com/is/image/manyavar/9000004374.21286_12-05-2023-01-25:650x900?&dpr=on,2",
      },
      {
        id: 3,
        name: "Royal Blue Anarkali Suit",
        price: 215,
        gst: 12,
        img: "https://images.weserv.nl/?url=ambraee.com/cdn/shop/files/JBL08978.jpg?v=1736766563&width=1080",
      },
      {
        id: 4,
        name: "Red Bridal Lehenga Set",
        price: 425,
        gst: 12,
        img: "https://manyavar.scene7.com/is/image/manyavar/UL5187VD-422-WINE4_12-06-2025-11-00:283x395?&dpr=on,2",
      },
    ],
    Kids: [
      {
        id: 1,
        name: "Yellow Kurta Set for Boys",
        price: 65,
        gst: 5,
        img: "https://manyavar-clone-cdn.vercel.app/kids1.jpg",
      },
      {
        id: 2,
        name: "Blue Printed Jacket Set for Boys",
        price: 85,
        gst: 5,
        img: "https://manyavar-clone-cdn.vercel.app/kids2.jpg",
      },
    ],
  };

  return (
    <section className="most-loved">
      <h2>Most Loved</h2>
      <div className="category-tabs">
        {["Men", "Women", "Kids"].map((cat) => (
          <button
            key={cat}
            className={category === cat ? "active" : ""}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="product-carousel">
        {products[category].map((item) => (
          <div key={item.id} className="product-card" onClick={() => navigate(`/products?category=${category.toLowerCase()}`)}>
            <img src={item.img} alt={item.name} />
            <p className="product-name">{item.name}</p>
            <p className="product-price">${item.price} <span style={{fontSize: '0.75em', color: '#888'}}>+ {item.gst}% GST</span></p>
            <span className="wishlist" onClick={(e) => {e.stopPropagation(); toast.success('Added to your wishlist', 'Wishlist Updated!')}}>♡</span>
          </div>
        ))}
      </div>

      <div className="nav-btns">
        <button className="nav-btn left">←</button>
        <button className="nav-btn right">→</button>
      </div>
    </section>
  );
}

import React from "react";
import "./CSS/Footer.css";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaPinterestP,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-logo">
          <img
            src="https://www.manyavar.com/on/demandware.static/-/Library-Sites-ManyavarSharedLibrary/default/dw387c7af1/images/Manvayar-Crest-Mohey_Horizontal_3D_logo_Desktop.png"
            alt="Manyavar Mohey Logo"
          />
        </div>

        <div className="newsletter">
          <h3>Subscribe to our Newsletter</h3>
          <div className="newsletter-box">
            <input type="email" placeholder="Email Address" />
            <button>&#8594;</button>
          </div>
        </div>
      </div>

      <hr />

      <div className="footer-content">
        <div className="footer-column">
          <h4>CATEGORIES</h4>
          <ul>
            <li>Kurta Pajama</li>
            <li>Kurta Jacket Sets</li>
            <li>Only Kurtas</li>
            <li>Nehru Jackets</li>
            <li>Indo Western</li>
            <li>Sherwani</li>
            <li>Lehenga</li>
            <li>Saree</li>
            <li>Kidswear</li>
            <li>Accessories</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>SUPPORT</h4>
          <ul>
            <li>Track Order</li>
            <li>Contact Us</li>
            <li>My Account</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>QUICK LINKS</h4>
          <ul>
            <li>About Us</li>
            <li>Brand Story</li>
            <li>Careers</li>
            <li>Book a Video Call</li>
            <li>Store Locator</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>OUR POLICIES</h4>
          <ul>
            <li>FAQs</li>
            <li>Shipping Details</li>
            <li>Return, Exchange and Refund Policy</li>
            <li>Terms of Use</li>
            <li>Privacy Policy</li>
            <li>Cookie Policy</li>
          </ul>
        </div>

        <div className="footer-column contact">
          <h4>CONTACT</h4>
          <p>
            <a href="mailto:care@vedantfashions.com">
              care@vedantfashions.com
            </a>
          </p>
          <p>Call us at: 1800-120-000-500 (India)</p>
          <p>+91 9674373838 (International)</p>
          <p>10 am - 7 pm, Monday - Saturday</p>

          <h4 className="social-title">KEEP IN TOUCH</h4>
          <div className="social-icons">
            <FaFacebookF />
            <FaTwitter />
            <FaInstagram />
            <FaLinkedinIn />
            <FaYoutube />
            <FaPinterestP />
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Vedant Fashions Ltd. All rights reserved.</p>
        <p>100% Secure Payments</p>
      </div>
    </footer>
  );
};

export default Footer;

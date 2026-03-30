import styles from "./Navbar.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const IconPin = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

export default function Navbar() {

  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navInner}`}>

        {/* Brand */}
        <div
          className={styles.brand}
          onClick={() => navigate("/")}
        >
          <div className={styles.logoMark}>
            <IconPin />
          </div>

          <span className={styles.brandName}>
            Ryde
          </span>
        </div>

        {/* Desktop Links */}
        <div className={`${styles.navLinks} ${menuOpen ? styles.showMenu : ""}`}>
          <a href="#">Home</a>
          <a href="#">Features</a>
          <a href="#">How it works</a>
          <a href="#">Contact</a>

          <div className={styles.mobileActions}>
            <button
  onClick={() => {
    setMenuOpen(false);
    navigate("/auth");
  }}
>
  Login
</button>
            <button onClick={() => navigate("/auth")}>Sign Up</button>
          </div>
        </div>

        {/* Desktop Buttons */}
        <div className={styles.navActions}>
          <button
            className={styles.login}
            onClick={() => navigate("/auth")}
          >
            Login
          </button>

          <button
            className={styles.signup}
            onClick={() => navigate("/auth")}
          >
            Sign Up
          </button>
        </div>

        {/* Hamburger */}
        <div
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

      </div>
    </nav>
  );
}
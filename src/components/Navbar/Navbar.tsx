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

  const goAuth = () => {
    setMenuOpen(false);
    navigate("/auth");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navInner}>
        <div className={styles.brand} onClick={() => navigate("/")}>
          <div className={styles.logoMark}>
            <IconPin />
          </div>
          <span className={styles.brandName}>Ryde</span>
        </div>

        <div className={`${styles.navLinks} ${menuOpen ? styles.showMenu : ""}`}>
          <a href="#top" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#cta" onClick={() => setMenuOpen(false)}>Get started</a>

          <div className={styles.mobileActions}>
            <button type="button" className={styles.login} onClick={goAuth}>
              Login
            </button>
            <button type="button" className={styles.signup} onClick={goAuth}>
              Sign Up
            </button>
          </div>
        </div>

        <div className={styles.navActions}>
          <button type="button" className={styles.login} onClick={goAuth}>
            Login
          </button>
          <button type="button" className={styles.signup} onClick={goAuth}>
            Sign Up
          </button>
        </div>

        <button
          type="button"
          className={styles.hamburger}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}

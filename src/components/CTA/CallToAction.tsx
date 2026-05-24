import { useNavigate } from "react-router-dom";
import styles from "./CallToAction.module.css";

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section id="cta" className={styles.cta}>
      <div className={styles.inner}>
        <h2>Ready to start your ride?</h2>
        <p>Create an account and book your first trip in minutes.</p>
        <button type="button" onClick={() => navigate("/auth?tab=signup")}>
          Get Started
        </button>
      </div>
    </section>
  );
}

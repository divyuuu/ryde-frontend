import { useNavigate } from "react-router-dom";
import styles from "./Hero.module.css";

const STATS = [
  { value: "2.4M", label: "Active riders" },
  { value: "98%", label: "On-time rate" },
  { value: "4.9★", label: "Avg. rating" },
];

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className={styles.hero}>
      <div className={styles.split}>
        <div className={styles.leftPanel}>
          <div className={styles.panelGlow} aria-hidden="true" />

          <p className={styles.eyebrow}>City rides, simplified</p>

          <h1 className={styles.title}>
            Move smarter with <em>Ryde</em>
          </h1>

          <p className={styles.subtitle}>
            Book rides instantly, share trips, and travel across the city with
            premium, reliable service.
          </p>

          <div className={styles.heroButtons}>
            <button
              type="button"
              className={styles.primary}
              onClick={() => navigate("/auth")}
            >
              Book a Ride
            </button>
            <button
              type="button"
              className={styles.secondary}
              onClick={() => navigate("/auth")}
            >
              Become a Driver
            </button>
          </div>

          <div className={styles.stats}>
            {STATS.map((s) => (
              <div className={styles.stat} key={s.label}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.heroCard}>
            <h3 className={styles.cardTitle}>Book your ride</h3>
            <p className={styles.cardHint}>
              Sign in to match with nearby drivers in seconds.
            </p>

            <label className={styles.fieldLabel}>Pickup</label>
            <input placeholder="Pickup location" readOnly />

            <label className={styles.fieldLabel}>Drop-off</label>
            <input placeholder="Drop location" readOnly />

            <button
              type="button"
              className={styles.rideBtn}
              onClick={() => navigate("/auth")}
            >
              Find Ride
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

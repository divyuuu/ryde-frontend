import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.heroInner}`}>

        <div className={styles.heroText}>

          <h1>
            Move smarter with <span>Ryde</span>
          </h1>

          <p>
            Book rides instantly, share trips, and travel across the city
            with premium and reliable rides.
          </p>

          <div className={styles.heroButtons}>
            <button className={styles.primary}>
              Book a Ride
            </button>

            <button className={styles.secondary}>
              Become a Driver
            </button>
          </div>

        </div>

        <div className={styles.heroCard}>

          <h3>Book your ride</h3>

          <input placeholder="Pickup location" />
          <input placeholder="Drop location" />

          <button className={styles.rideBtn}>
            Find Ride
          </button>

        </div>

      </div>
    </section>
  );
}
import styles from "./Features.module.css";

const features = [
  {
    title: "Fast Pickup",
    desc: "Drivers arrive within minutes across the city.",
  },
  {
    title: "Premium Cars",
    desc: "Choose from a range of comfortable, well-maintained vehicles.",
  },
  {
    title: "Ride Sharing",
    desc: "Share rides with others and save on every trip.",
  },
];

export default function Features() {
  return (
    <section id="features" className={styles.features}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Why choose Ryde</h2>

        <div className={styles.featureGrid}>
          {features.map((f) => (
            <div className={styles.featureCard} key={f.title}>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

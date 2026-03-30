import styles from "./Features.module.css";

const features = [
  {
    title: "Fast Pickup",
    desc: "Drivers arrive within minutes across the city."
  },
  {
    title: "Premimum Cars",
    desc: "Choose your next dream car."
  },
  {
    title: "Ride Sharing",
    desc: "Share rides with others and save money."
  }
];

export default function Features() {
  return (
    <section className={styles.features} >
      <div className={styles.container} >

        <h2>Why choose Ryde</h2>

        <div className={styles.featureGrid}>

          {features.map((f, i) => (
            <div className={styles.featureCard} key={i}>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
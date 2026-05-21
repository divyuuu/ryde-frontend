import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import Features from "../../components/Features/Features";
import CTA from "../../components/CTA/CallToAction";
import Footer from "../../components/Footer/Footer";
import styles from "./LandingPage.module.css";

export default function Landing() {
  return (
    <div id="top" className={styles.page}>
      <div className={styles.mapGrid} aria-hidden="true" />

      <div className={styles.content}>
        <Navbar />
        <Hero />
        <Features />
        <CTA />
        <Footer />
      </div>
    </div>
  );
}

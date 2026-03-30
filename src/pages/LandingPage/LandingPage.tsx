import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import Features from "../../components/Features/Features";
import CTA from "../../components/CTA/CallToAction";
import Footer from "../../components/Footer/Footer";
import styles from "./LandingPage.module.css";

export default function Landing() {
  return (
    <div className={styles.page}>

      <div className={styles.mapGrid}></div>

      {/* Content */}
      <Navbar />
      <Hero />
      <Features />
      <CTA />
      <Footer />

    </div>
  );
}
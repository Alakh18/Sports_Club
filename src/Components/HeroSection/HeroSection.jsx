import { scrollToId } from "../../utils/ui";
import "./HeroSection.css";

function HeroSection() {
  return (
    <section id="hero" className="hero bright-hero">
      <div className="hero__content">
        <h1 className="hero__title">Unleash the Athlete In You</h1>
        <p className="hero__subtitle">
          Join the legacy of champions in Cricket, Football, Volleyball, and
          more!
        </p>
        <button className="cta" onClick={() => scrollToId("sports")}>
          Explore Sports
        </button>
      </div>
    </section>
  );
}

export default HeroSection;

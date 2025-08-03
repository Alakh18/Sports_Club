import { scrollToId } from "../../utils/ui";
import "./HeroSection.css";

function HeroSection() {
  return (
    <section id="hero" className="hero bright-hero">
      <div className="hero__content">
        <img
          src="/images/heroimage.jpeg"
          alt="Hero"
          className="hero__image"
        />
        
        
      </div>
    </section>
  );
}

export default HeroSection;
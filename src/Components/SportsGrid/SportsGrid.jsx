import { useEffect, useRef } from "react";
import "./SportsGrid.css";

const sports = [
  {
    name: "Cricket",
    icon: "🏏",
    description: "Smash boundaries and lead the team to victory.",
  },
  {
    name: "Football",
    icon: "⚽",
    description: "Show off your skills on the field and score goals.",
  },
  {
    name: "Volleyball",
    icon: "🏐",
    description: "Spike it high and play with teamwork.",
  },
  {
    name: "Basketball",
    icon: "🏀",
    description: "Dribble, dunk, and dominate the court.",
  },
  {
    name: "Chess",
    icon: "♟️",
    description: "Think ahead and win with strategy.",
  },
  {
    name: "Badminton",
    icon: "🏸",
    description: "Fast-paced rallies and powerful smashes.",
  },
  
];

function SportsGrid() {
  const videoRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target.querySelector("video");
          if (video) {
            video.playbackRate = 1.5;
            if (entry.isIntersecting) {
              video.play().catch(() => {});
            } else {
              video.pause();
            }
          }
        });
      },
      { threshold: 0.4 }
    );

    videoRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="sports" className="sports-grid">
      <h2 className="section-heading">Explore Our Sports</h2>
      <div className="sports-grid__container">
        {sports.map((sport, index) => {
          const videoPath = `/videos/${sport.name.toLowerCase()}.mp4`;

          return (
            <div
              className="sport-card"
              key={sport.name}
              ref={(el) => (videoRefs.current[index] = el)}
            >
              <video
                className="sport-video"
                muted
                loop
                playsInline
                preload="auto"
              >
                <source src={videoPath} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              <div className="sport-content">
                <div className="sport-icon" aria-label={sport.name}>
                  {sport.icon}
                </div>
                <h3 className="sport-title">{sport.name}</h3>
                <p className="sport-description">{sport.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default SportsGrid;

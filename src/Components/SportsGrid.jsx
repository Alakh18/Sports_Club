import React from 'react';

const sports = [
  { name: 'Cricket', icon: '🏏', description: 'Smash boundaries and lead the team to victory.' },
  { name: 'Football', icon: '⚽', description: 'Show off your skills on the field and score goals.' },
  { name: 'Volleyball', icon: '🏐', description: 'Spike it high and play with teamwork.' },
  { name: 'Basketball', icon: '🏀', description: 'Dribble, dunk, and dominate the court.' },
  { name: 'Chess', icon: '♟️', description: 'Think ahead and win with strategy.' },
  { name: 'Badminton', icon: '🏸', description: 'Fast-paced rallies and powerful smashes.' },
  { name: 'Tennis', icon: '🎾', description: 'Ace your serve and play singles or doubles.' },
];

function SportsGrid() {
  return (
    <section className="sports-grid">
      <h2 className="section-heading">Explore Our Sports</h2>
      <div className="sports-grid__container">
        {sports.map((sport) => (
          <div className="sport-card" key={sport.name}>
            <div className="sport-card__icon">{sport.icon}</div>
            <h3 className="sport-card__title">{sport.name}</h3>
            <p className="sport-card__description">{sport.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SportsGrid;

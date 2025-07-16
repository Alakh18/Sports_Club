import React from 'react';
import './index.css';
import Header from './Components/Header.jsx';
import HeroSection from './Components/HeroSection.jsx';
import SportsGrid from './Components/SportsGrid.jsx';
// import AboutSection from './components/AboutSection';
// import EventsSection from './components/EventsSection';
// import JoinUsSection from './components/JoinUsSection';
// import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <HeroSection />
      <SportsGrid />
      {/*<AboutSection />
      <EventsSection />
      <JoinUsSection />
      <Footer /> */}
    </div>
  );
}

export default App;

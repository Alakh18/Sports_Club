import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { enableSmoothNavLinks } from "./utils/ui";

import Header from "./Components/Header/Header.jsx";
import HeroSection from "./Components/HeroSection/HeroSection.jsx";
import SportsGrid from "./Components/SportsGrid/SportsGrid.jsx";
import Profile from "./Components/Profile/Profile.jsx";
import PrivateRoute from "./Components/PrivateRoute.jsx";

import FAQ from "./Components/FAQ/FAQ.jsx";
import Footer from "./Components/Footer/Footer.jsx";

function App() {
  useEffect(() => {
    enableSmoothNavLinks();
  }, []);

  const Home = () => (
    <>
      <HeroSection />
      <SportsGrid />
      {/* Add other sections like AboutSection, Events, Footer here */}
    </>
  );

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="/faq" element={<FAQ />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;

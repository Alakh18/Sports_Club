import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { enableSmoothNavLinks } from "./utils/ui";

import Header from "./Components/Header.jsx";
import HeroSection from "./Components/HeroSection.jsx";
import SportsGrid from "./Components/SportsGrid.jsx";
import Profile from "./Components/Profile.jsx";
import PrivateRoute from "./Components/PrivateRoute.jsx";

function App() {
  useEffect(() => {
    enableSmoothNavLinks();
  }, []);

  const Home = () => (
    <>
      <Header />
      <HeroSection />
      <SportsGrid />
      {/* Add other sections like AboutSection, Events, Footer here */}
    </>
  );

  return (
    <div className="App">
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
      </Routes>
    </div>
  );
}

export default App;

import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { enableSmoothNavLinks } from "./utils/ui";

import Header from "./Components/Header/Header.jsx";
import About from "./Components/About/About.jsx";
import HeroSection from "./Components/HeroSection/HeroSection.jsx";
import SportsGrid from "./Components/SportsGrid/SportsGrid.jsx";
import Profile from "./Components/Profile/Profile.jsx";
import ScrollToTop from "./Components/ScrollToTop.jsx";
import PrivateRoute from "./Components/PrivateRoute.jsx";
import FAQ from "./Components/FAQ/FAQ.jsx";
import Sports from "./Components/Sports/Sports.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import Calendar from "./Components/Calender/Calender.jsx";
import Admin from "./Components/Admin/Admin.jsx";

function App() {
  useEffect(() => {
    fetch("https://sports-club.onrender.com/api/sports")
      .then((res) => res.json())
      .then((data) => console.log(data.message));
  }, []);
  useEffect(() => {
    enableSmoothNavLinks();
  }, []);

  const Home = () => (
    <>
      <HeroSection />
      <SportsGrid />
    </>
  );

  return (
    <div className="App">
      <Header />
      <ScrollToTop />
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
        <Route path="/about" element={<About />} />
        <Route path="/calender" element={<Calendar />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/sports/:sportName" element={<Sports />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;

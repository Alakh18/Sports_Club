import { useParams } from "react-router-dom";
import { useState } from "react";
import "./Sports.css";

const sections = ["Events", "Gallery", "Registration", "Eligibility"];

export default function Sports() {
  const { sportName } = useParams();
  const [activeSection, setActiveSection] = useState("Events");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="sport-detail-wrapper">
      <div className={`sidebar-container ${!sidebarOpen ? "collapsed" : ""}`}>
        {/* Sidebar */}
        <aside className="sport-sidebar">
          <h2 className="sport-sidebar-title">{sportName?.toUpperCase()}</h2>
          <ul className="sport-section-tabs">
            {sections.map((sec) => (
              <li
                key={sec}
                className={activeSection === sec ? "active" : ""}
                onClick={() => setActiveSection(sec)}
              >
                {sec}
              </li>
            ))}
          </ul>
        </aside>

        {/* Toggle Button (OUTSIDE the sidebar) */}
        <button
          className="sidebar-toggle-btn"
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          {sidebarOpen ? "←" : "→"}
        </button>
      </div>

      {/* Main Content */}
      <main className="sport-section-content">
        <h3>{activeSection}</h3>
        <p>
          This is the {activeSection.toLowerCase()} section of {sportName}.
        </p>
      </main>
    </div>
  );
}

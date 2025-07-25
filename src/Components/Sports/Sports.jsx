import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Sports.css";

const sections = ["Events", "Gallery", "Registration", "Eligibility"];

export default function Sports() {
  const { sportName } = useParams();
  const [activeSection, setActiveSection] = useState("Events");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [sportId, setSportId] = useState(null);
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/sports")
      .then((res) => res.json())
      .then((data) => {
        const matchedSport = data.find(
          (sport) => sport.name.toLowerCase() === sportName.toLowerCase()
        );
        if (matchedSport) {
          setSportId(matchedSport._id);

          fetch(`http://localhost:5000/api/sports/${matchedSport._id}/events`)
            .then((res) => res.json())
            .then((eventData) => setEvents(eventData));

          fetch(`http://localhost:5000/api/sports/${matchedSport._id}/gallery`)
            .then((res) => res.json())
            .then((galleryData) => setGallery(galleryData));
        }
      })
      .catch((err) => console.error("Error fetching sports:", err));
  }, [sportName]);

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

        {/* Toggle Button */}
        <button
          className="sidebar-toggle-btn"
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          {sidebarOpen ? "←" : "→"}
        </button>
      </div>

      {/* Main Content */}
      <main className="sport-section-content">
        {activeSection === "Events" && (
          <div>
            <h3>Events</h3>
            {events.length === 0 ? (
              <p>No events found.</p>
            ) : (
              <ul>
                {events.map((event) => (
                  <li key={event._id}>
                    <strong>{event.name}</strong> — {event.date}, {event.time}
                    <br />
                    📍 {event.location} <br />
                    🎯 {event.eligibility}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeSection === "Gallery" && (
          <div>
            <h3>Gallery</h3>
            {gallery.length === 0 ? (
              <p>No images yet.</p>
            ) : (
              <div className="gallery-grid">
                {gallery.map((img) => (
                  <div key={img._id} className="gallery-item">
                    <img src={img.image} alt={img.caption} />
                    <p>{img.caption}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === "Registration" && (
          <div>
            <h3>Register for an Event</h3>
            {events.length === 0 ? (
              <p>No events available for registration.</p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!selectedEventId) {
                    alert("Please select an event to register.");
                    return;
                  }
                  // You can call your POST registration API here
                  alert(`You registered for event ID: ${selectedEventId}`);
                }}
              >
                <div className="event-registration-list">
                  {events.map((event) => (
                    <label key={event._id} className="event-radio-option">
                      <input
                        type="radio"
                        name="event"
                        value={event._id}
                        onChange={() => setSelectedEventId(event._id)}
                      />
                      <strong>{event.name}</strong> — {event.date} at{" "}
                      {event.time}
                    </label>
                  ))}
                </div>
                <button type="submit" className="register-btn">
                  Register
                </button>
              </form>
            )}
          </div>
        )}

        {activeSection === "Eligibility" && (
          <div>
            <h3>Eligibility</h3>
            {events.length > 0 ? (
              <ul>
                {events.map((event) => (
                  <li key={event._id}>
                    {event.name}: {event.eligibility}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No eligibility info available.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
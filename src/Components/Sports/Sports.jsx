import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Sports.css";

const sections = ["Events", "Gallery", "Registration", "Eligibility"];

export default function Sports() {
  const { sportName } = useParams();
  const [activeSection, setActiveSection] = useState("Events");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/sports")
      .then((res) => res.json())
      .then((data) => {
        const matchedSport = data.find(
          (sport) => sport.name.toLowerCase() === sportName.toLowerCase()
        );
        if (matchedSport && matchedSport._id) {
          fetch(`http://localhost:5000/api/sports/${matchedSport._id}/gallery`)
            .then((res) => res.json())
            .then((galleryData) => setGallery(galleryData))
            .catch((err) => console.error("Gallery fetch failed:", err));

          fetch(`http://localhost:5000/api/sports/${matchedSport._id}/events`)
            .then((res) => res.json())
            .then((eventData) => setEvents(eventData))
            .catch((err) => console.error("Events fetch failed:", err));
        }
      })
      .catch((err) => console.error("Error fetching sports:", err));
  }, [sportName]);

  const handleImageClick = (img) => {
    setSelectedImage(img);
    setShowImageModal(true);
  };

  const handleRegisterClick = (eventId) => {
    if (!isLoggedIn) {
      alert("Please login to register.");
    } else {
      alert(`Registered for event: ${eventId}`);
    }
  };

  return (
    <div className="sport-detail-wrapper">
      <div className={`sidebar-container ${!sidebarOpen ? "collapsed" : ""}`}>
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

        <button
          className="sidebar-toggle-btn"
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          {sidebarOpen ? "←" : "→"}
        </button>
      </div>

      <main className="sport-section-content">
        {activeSection === "Events" && (
          <div>
            <h3>Events</h3>
            {events.length === 0 ? (
              <p>No events available.</p>
            ) : (
              <div className="events-list">
                {events.map((event) => (
                  <div
                    key={event._id}
                    className="events-card"
                    onClick={() =>
                      setExpandedEvent(
                        expandedEvent === event._id ? null : event._id
                      )
                    }
                  >
                    <h4>{event.eventName}</h4>
                    {expandedEvent === event._id && (
                      <div className="events-details">
                        <p>Date: {event.date}</p>
                        <p>Time: {event.time}</p>
                        <p>Location: {event.location}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === "Gallery" && (
          <div>
            <h3>Gallery</h3>
            {gallery.length === 0 ? (
              <p>No images yet.</p>
            ) : (
              <div className="gallery-list">
                {gallery.map((img) => (
                  <div
                    key={img._id}
                    className="gallery-card"
                    onClick={() => handleImageClick(img)}
                  >
                    <img src={img.image} alt="gallery" />
                    <div className="gallery-description">{img.description}</div>
                  </div>
                ))}
              </div>
            )}

            {showImageModal && selectedImage && (
              <div className="image-modal" onClick={() => setShowImageModal(false)}>
                <img src={selectedImage.image} alt="modal" />
              </div>
            )}
          </div>
        )}

        {activeSection === "Registration" && (
          <div>
            <h3>Register</h3>
            {events.length === 0 ? (
              <p>No events available for registration.</p>
            ) : (
              <div className="registration-list">
                {events.map((event) => (
                  <div
                    key={event._id}
                    className="registration-card"
                    onClick={() =>
                      isLoggedIn ? handleRegisterClick(event._id) : alert("Please login to register.")
                    }
                  >
                    {event.eventName}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === "Eligibility" && (
          <div>
            <h3>Eligibility</h3>
            {events.length === 0 ? (
              <p>No eligibility data available.</p>
            ) : (
              <div className="eligibility-list">
                {events.map((event) => (
                  <div key={event._id} className="eligibility-card">
                    <h4>{event.eventName}</h4>
                    <p>{event.eligibility}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

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
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [registeredEventName, setRegisteredEventName] = useState("");

  const isLoggedIn = !!localStorage.getItem("authToken");

  useEffect(() => {
    fetch("https://sports-club.onrender.com/api/sports")
      .then((res) => res.json())
      .then((data) => {
        const matchedSport = data.find(
          (sport) => sport.name.toLowerCase() === sportName.toLowerCase()
        );
        if (matchedSport) {
          setEvents(
            Array.isArray(matchedSport.events) ? matchedSport.events : []
          );
          setGallery(
            Array.isArray(matchedSport.gallery) ? matchedSport.gallery : []
          );
        }
      })
      .catch((err) => console.error("Error fetching sports:", err));
  }, [sportName]);

  const handleImageClick = (img) => {
    setSelectedImage(img);
    setShowImageModal(true);
  };

  const handleRegisterClick = (event) => {
    if (!isLoggedIn) {
      alert("Please login to register.");
    } else {
      // --- This is the updated part ---
      setRegisteredEventName(event.eventName);
      setShowSuccessPopup(true);

      // Hide the popup after 3 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);

      // You can still perform your registration logic here, e.g., an API call
    }
  };

  function formatTime(time24) {
    if (!time24) return "";
    const [hourStr, minute] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const suffix = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // Convert to 12-hour format
    return `${hour}:${minute} ${suffix}`;
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();

    // Get suffix (st, nd, rd, th)
    const getSuffix = (d) => {
      if (d > 3 && d < 21) return "th";
      switch (d % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    const suffix = getSuffix(day);
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    return `${day}${suffix} ${month} ${year}`;
  }

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
                        <p>Date: {formatDate(event.date)}</p>
                        <p>Time: {formatTime(event.time)}</p>
                        <p>Location: {event.location}</p>
                        <p>Description: {event.description}</p>
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
              <div
                className="image-modal"
                onClick={() => setShowImageModal(false)}
              >
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
                      isLoggedIn
                        ? handleRegisterClick(event)
                        : alert("Please login to register.")
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

        {showSuccessPopup && (
          <div className="success-popup">
            <p>
              ✅ Successfully registered for:{" "}
              <strong>{registeredEventName}</strong>
            </p>
            <button onClick={() => setShowSuccessPopup(false)}>&times;</button>
          </div>
        )}

      </main>
    </div>
  );
}

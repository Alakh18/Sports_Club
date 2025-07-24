import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CalendarEventList({ selectedDate, refreshFlag, triggerRefresh }) {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    axios.get("/api/users/me", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setUser(res.data));
  }, []);

  useEffect(() => {
    axios.get("/api/events")
      .then((res) => {
        const dateStr = selectedDate.toISOString().split("T")[0];
        const filtered = res.data.filter(ev => ev.date.startsWith(dateStr));
        setEvents(filtered);
      });
  }, [selectedDate, refreshFlag]);

  const toggleTrack = async (id) => {
    try {
      await axios.post(`/api/events/${id}/toggle-track`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      triggerRefresh();
    } catch (err) {
      alert("Error tracking event.");
    }
  };

  return (
    <div className="event-list-container">
  <h2 className="event-title">
    🗓️ Events on {selectedDate.toDateString()}
  </h2>

  {events.length === 0 && <p>No events today.</p>}

  <ul className="event-list">
    {events.map((event) => (
      <li key={event._id} className="event-card">
        <span>{event.title}</span>
        <button
          onClick={() => toggleTrack(event._id)}
          className="track-btn"
        >
          {user?.trackedEvents?.includes(event._id) ? "Untrack" : "Track"}
        </button>
      </li>
    ))}
  </ul>
</div>
  );
}

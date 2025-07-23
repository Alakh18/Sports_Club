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
    <div>
      <h2 className="text-xl font-semibold mb-4">Events on {selectedDate.toDateString()}</h2>
      {events.length === 0 && <p>No events today.</p>}
      <ul className="space-y-4">
        {events.map((event) => (
          <li key={event._id} className="bg-white p-4 shadow rounded flex justify-between items-center">
            <span>{event.title}</span>
            <button
              onClick={() => toggleTrack(event._id)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            >
              {user?.trackedEvents?.includes(event._id) ? "Untrack" : "Track"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
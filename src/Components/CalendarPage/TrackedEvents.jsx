import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TrackedEvents({ triggerRefresh }) {
  const [tracked, setTracked] = useState([]);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    axios.get("/api/events/tracked/me", {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      setTracked(res.data);
    });
  }, [triggerRefresh]);

  return (
  <div className="tracked-container">
  <h2 className="tracked-title">📌 Tracked Events</h2>

  {tracked.length === 0 ? (
    <p>No tracked events.</p>
  ) : (
    <ul className="tracked-list">
      {tracked.map((event) => (
        <li key={event._id} className="tracked-card">
          {new Date(event.date).toDateString()} - <b>{event.title}</b>
        </li>
      ))}
    </ul>
  )}
</div>
);
}

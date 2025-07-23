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
    <div className="w-64 bg-white shadow-lg p-4 border-l">
      <h2 className="text-xl font-bold mb-4">📌 Tracked Events</h2>
      {tracked.length === 0 ? (
        <p className="text-gray-500">No tracked events.</p>
      ) : (
        <ul className="space-y-3">
          {tracked.map((event) => (
            <li key={event._id} className="bg-gray-100 p-2 rounded text-sm">
              {new Date(event.date).toDateString()} - <b>{event.title}</b>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
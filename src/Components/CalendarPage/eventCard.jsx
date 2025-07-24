// src/components/EventCard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function EventCard({ event, triggerRefresh, onToggleTrackedStatus }) {
  const [isCurrentlyTracked, setIsCurrentlyTracked] = useState(event.isUserTracked || false);

  useEffect(() => {
    setIsCurrentlyTracked(event.isUserTracked || false);
  }, [event.isUserTracked]);

  const handleToggleTrack = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("Please log in to track events.");
      return;
    }

    try {
      if (isCurrentlyTracked) {
        await axios.post(`/api/users/untrack-event/${event._id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsCurrentlyTracked(false);
      } else {
        await axios.post(`/api/users/track-event/${event._id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsCurrentlyTracked(true);
      }

      if (onToggleTrackedStatus) {
        onToggleTrackedStatus(event._id, !isCurrentlyTracked);
      }

      if (triggerRefresh) {
        triggerRefresh();
      }

    } catch (error) {
      console.error("Error toggling track status:", error.response ? error.response.data : error.message);
      alert("Failed to update tracking status. Please try again.");
    }
  };

  return (
    <li className="event-card">
      <div className="event-details">
        <h3>{event.title}</h3>
        <p>Date: {new Date(event.date).toLocaleDateString()}</p>
        {event.time && <p>Time: {event.time}</p>}
        {event.location && <p>Location: {event.location}</p>}
        {event.description && <p>{event.description}</p>}
      </div>

      <button
        className="track-btn"
        onClick={handleToggleTrack}
      >
        {isCurrentlyTracked ? "Untrack" : "Track"}
      </button>
    </li>
  );
}
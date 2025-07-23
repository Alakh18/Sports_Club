import React, { useEffect, useState } from "react";
import EventFormModal from "./EventFormModal";
import axios from "axios";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';

export default function CalendarSidebar({ selectedDate, setSelectedDate, triggerRefresh }) {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    axios
      .get("/api/users/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setUser(res.data))
      .catch((err) => setUser(null));
  }, []);

  const isAdmin = user?.role === "admin";

  const today = new Date();
  const formattedDate = selectedDate.toDateString();

  return (
    <div className="calendar-sidebar-container">
  <div className="calendar-box">
    <Calendar
      value={selectedDate}
      onChange={(date) => setSelectedDate(date)}
      className="custom-calendar"
      tileClassName={({ date }) => {
        const today = new Date();
        if (
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        ) {
          return "highlight-today";
        }
      }}
    />
  </div>

  <div className="selected-date-box">
    <div className="selected-label">Selected Date:</div>
    <div className="selected-date">{selectedDate.toDateString()}</div>

    {isAdmin && (
      <button className="add-event-btn" onClick={() => setShowModal(true)}>
        ➕ Add Event
      </button>
    )}

    {showModal && (
      <EventFormModal
        selectedDate={selectedDate}
        onClose={() => setShowModal(false)}
        triggerRefresh={triggerRefresh}
      />
    )}
  </div>
</div>
  );
}

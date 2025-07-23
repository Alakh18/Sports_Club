import React, { useEffect, useState } from "react";
import EventFormModal from "./EventFormModal";
import axios from "axios";

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

  const isAdmin = user?.isAdmin;

  const today = new Date();
  const formattedDate = selectedDate.toDateString();

  return (
    <div className="w-64 bg-white shadow-lg p-4 border-r">
      <h2 className="text-xl font-bold mb-4">📅 Calendar</h2>
      <p className="text-gray-600 mb-2">Selected Date:</p>
      <div className="text-lg font-medium mb-6">{formattedDate}</div>
      {isAdmin && (
        <>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            ➕ Add Event
          </button>
          {showModal && (
            <EventFormModal
              selectedDate={selectedDate}
              onClose={() => setShowModal(false)}
              triggerRefresh={triggerRefresh}
            />
          )}
        </>
      )}
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> ffc694b7300a5c87301e29dd888276e5929acb1b

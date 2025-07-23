import React, { useState } from "react";
import axios from "axios";

export default function EventFormModal({ selectedDate, onClose, triggerRefresh }) {
  const [title, setTitle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    try {
      await axios.post("/api/events", {
        title,
        date: selectedDate.toISOString(),
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      triggerRefresh();
      onClose();
    } catch (err) {
      alert("Failed to create event");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Create Event</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            required
            placeholder="Event Title"
            className="w-full border p-2 mb-4 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
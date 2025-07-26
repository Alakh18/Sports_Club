import React, { useState,useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaBars } from "react-icons/fa";
import "./Admin.css";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("manage");
  const [collapsed, setCollapsed] = useState(false);
  
  const [requests, setRequests] = useState([]);
  const [selectedSport, setSelectedSport] = useState(null);

const [eventName, setEventName] = useState("");
const [eventDate, setEventDate] = useState(new Date());
const [eventTime, setEventTime] = useState("");
const [eventLocation, setEventLocation] = useState("");
const [eligibility, setEligibility] = useState("");
const [description, setDescription] = useState("");

  // Admin.jsx - inside handleSaveEvent
const handleSaveEvent = async () => {
  if (
    !selectedSport ||
    !eventName ||
    !eventDate ||
    !eventTime ||
    !eventLocation ||
    !eligibility ||
    !description
  ) {
    alert("Please fill all fields");
    return;
  }

  try {
    const formattedDate = new Date(eventDate).toISOString();

    const eventPayload = { // Explicitly define the payload object
      name: eventName,
      date: formattedDate,
      time: eventTime,
      location: eventLocation,
      eligibility: eligibility, // Ensure correct variable names
      description: description, // Ensure correct variable names
    };

    console.log("Frontend sending payload:", eventPayload); // <-- KEEP THIS LINE

    const res = await fetch(`http://localhost:5000/api/sports/${selectedSport}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Make sure this matches exactly what your backend expects.
        // If your `authenticate` middleware in `index.js` looks for 'Authorization: Bearer', use that.
        // Your index.js `allowedHeaders` includes "authToken", so `authtoken` here is okay,
        // but it's crucial if this route is protected.
        authtoken: localStorage.getItem("authToken"),
      },
      body: JSON.stringify(eventPayload),
    });

    if (!res.ok) {
        const errorData = await res.json(); // Crucial to read error response
        throw new Error(errorData.error || "Failed to save event");
    }

    const responseData = await res.json(); // Read the successful response
    console.log("Backend response for event add:", responseData);

    alert("Event added successfully!");

    // Reset form fields
    setSelectedSport("");
    setEventName("");
    setEventDate(new Date());
    setEventTime("");
    setEventLocation("");
    setEligibility("");
    setDescription("");
  } catch (err) {
    console.error("Error saving event:", err);
    alert(`Something went wrong! Error: ${err.message}`); // Show specific error
  }
};
const [sports, setSports] = useState([]);

useEffect(() => {
  const fetchSports = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/sports");
      const data = await res.json();
      setSports(data);
    } catch (err) {
      console.error("Failed to fetch sports", err);
    }
  };

  fetchSports();
}, []);


  useEffect(() => {
  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/requests", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch requests");

      const data = await res.json();
      const pendingRequests = data.filter((request) => request.status === "pending");
      setRequests(pendingRequests);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    }
  };

  fetchRequests();
}, []);




const handleApprove = async (id) => {
  try {
    await fetch(`http://localhost:5000/api/admin/requests/approve/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    setRequests((prev) => prev.filter((r) => r._id !== id));
    alert("Approved!");
  } catch (err) {
    console.error("Approval failed:", err);
  }
};

const handleDecline = async (id) => {
  try {
    await fetch(`http://localhost:5000/api/admin/requests/reject/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    setRequests((prev) => prev.filter((r) => r._id !== id));
    alert("Declined.");
  } catch (err) {
    console.error("Rejection failed:", err);
  }
};

  const handleSportChange = (e) => {
    setSelectedSport(e.target.value);
  };

  const formatDate = (date) =>
    date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="admin-wrapper">
      <div className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <h2>{!collapsed && "Admin Panel"}</h2>
          <button
            className="collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            <FaBars />
          </button>
        </div>
        <ul className="admin-tabs">
          <li
            className={activeTab === "manage" ? "active" : ""}
            onClick={() => setActiveTab("manage")}
          >
            <span className="icon">📋</span>
            {!collapsed && <span className="label">Manage Events</span>}
          </li>
          <li
            className={activeTab === "add" ? "active" : ""}
            onClick={() => setActiveTab("add")}
          >
            <span className="icon">➕</span>
            {!collapsed && <span className="label">Add Events</span>}
          </li>
          <li
            className={activeTab === "requests" ? "active" : ""}
            onClick={() => setActiveTab("requests")}
          >
            <span className="icon">🛂</span>
            {!collapsed && <span className="label">Approve Requests</span>}
          </li>
        </ul>
      </div>

      <div className="admin-content">
        {activeTab === "manage" && (
          <div>
            <h3>Manage Events</h3>
            <div className="admin-box">
              <label>Select Sport</label>
              <select
  className="styled-select"
  value={selectedSport ||""}
  onChange={handleSportChange}
>
  <option value="">-- Select Sport --</option>
  {sports.map((sport) => (
    <option key={sport._id} value={sport._id}>
      {sport.name}
    </option>
  ))}
</select>

              {selectedSport && (
                <div style={{ marginTop: "20px" }}>
                  <strong>Events for {selectedSport}:</strong>
                  <ul style={{ marginTop: "10px" }}>
                    <li>
                      Match 1 – 25 July 2025
                      <button
                        className="admin-btn"
                        style={{ marginLeft: "10px" }}
                      >
                        Edit
                      </button>
                      <button
                        className="admin-btn"
                        style={{
                          backgroundColor: "#f5b3b3",
                          marginLeft: "8px",
                        }}
                      >
                        Delete
                      </button>
                    </li>
                    {/* Add more mock events or load dynamically */}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "add" && (
  <div>
    <h3>Add New Event</h3>
    <div className="admin-box">
      <label>Sport</label>
      <select
  className="styled-select"
  value={selectedSport || ""}
  onChange={handleSportChange}
>
  <option value="">-- Select Sport --</option>
  {sports.map((sport) => (
    <option key={sport._id} value={sport._id}>
      {sport.name}
    </option>
  ))}
</select>

      <label>Event Name</label>
      <input
        type="text"
        placeholder="Enter event name"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
      />

      <label>Event Date</label>
      <div className="calendar-container">
        <Calendar
          onChange={setEventDate}
          value={eventDate}
          className="custom-calendar"
        />
      </div>
      <p style={{ marginTop: "8px", color: "#3b3200" }}>
        Selected Date: <strong>{formatDate(eventDate)}</strong>
      </p>

      <label>Time</label>
      <input
        type="time"
        value={eventTime}
        onChange={(e) => setEventTime(e.target.value)}
      />

      <label>Location</label>
      <input
        type="text"
        placeholder="Enter location"
        value={eventLocation}
        onChange={(e) => setEventLocation(e.target.value)}
      />

      <label>Eligibility</label>
      <textarea
        placeholder="Enter eligibility criteria"
        value={eligibility}
        onChange={(e) => setEligibility(e.target.value)}
      />

      <label>Description</label>
      <textarea
        placeholder="Enter event description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button className="admin-btn" onClick={handleSaveEvent}>
        Save Event
      </button>
    </div>
  </div>
)}

        {activeTab === "requests" && (
  <div className="admin-requests">
    <h2>Admin Requests</h2>
    {requests.length === 0 ? (
      <p>No pending requests</p>
    ) : (
      requests.map((req) => (
        <div key={req._id} className="request-item">
          <p><strong>User:</strong> {req.user?.admission} ({req.user?.email})</p>

          <p><strong>Reason:</strong> {req.reason}</p>
          <div className="button-group">
            <button className="approve" onClick={() => handleApprove(req._id)}>
              Approve
            </button>
            <button className="decline" onClick={() => handleDecline(req._id)}>
              Decline
            </button>
          </div>
        </div>
      ))
    )}
  </div>
)}
</div>
    </div>
  );
};

export default Admin;

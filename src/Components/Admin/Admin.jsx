import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaBars } from "react-icons/fa";
import "./Admin.css";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("manage");
  const [collapsed, setCollapsed] = useState(false);
  const [selectedSport, setSelectedSport] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [requests, setRequests] = useState([
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
  ]);

  const handleApprove = (id) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    alert("Approved!");
  };

  const handleDecline = (id) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    alert("Declined.");
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
                value={selectedSport}
                onChange={handleSportChange}
              >
                <option value="">-- Select Sport --</option>
                <option value="football">Football</option>
                <option value="cricket">Cricket</option>
                <option value="basketball">Basketball</option>
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
                value={selectedSport}
                onChange={handleSportChange}
              >
                <option value="">-- Select Sport --</option>
                <option value="football">Football</option>
                <option value="cricket">Cricket</option>
                <option value="basketball">Basketball</option>
              </select>

              <label>Event Name</label>
              <input type="text" placeholder="Enter event name" />

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
              <input type="time" />

              <label>Location</label>
              <input type="text" placeholder="Enter location" />

              <label>Eligibility</label>
              <textarea placeholder="Enter eligibility criteria" />

              <label>Description</label>
              <textarea placeholder="Enter event description" />

              <button className="admin-btn">Save Event</button>
            </div>
          </div>
        )}

        {activeTab === "requests" && (
          <div>
            <h3>Approve Admin Requests</h3>
            <div className="admin-box">
              {requests.length === 0 ? (
                <p>No pending requests</p>
              ) : (
                requests.map((req) => (
                  <div key={req.id} className="request-item">
                    <span>
                      {req.name} ({req.email})
                    </span>
                    <div>
                      <button
                        className="approve"
                        onClick={() => handleApprove(req.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="decline"
                        onClick={() => handleDecline(req.id)}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

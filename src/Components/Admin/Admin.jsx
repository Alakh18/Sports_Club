import React, { useState, useEffect } from "react";
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
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);

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

      const eventPayload = {
        // Explicitly define the payload object
        eventName: eventName,
        date: formattedDate,
        time: eventTime,
        location: eventLocation,
        eligibility: eligibility, // Ensure correct variable names
        description: description, // Ensure correct variable names
      };

      console.log("Frontend sending payload:", eventPayload); // <-- KEEP THIS LINE

      const res = await fetch(
        `https://sports-club.onrender.com/api/sports/${selectedSport}/events`,
        {
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
        }
      );

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
        const res = await fetch("https://sports-club.onrender.com/api/sports");
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
        const res = await fetch("https://sports-club.onrender.com/api/admin/requests", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch requests");

        const data = await res.json();
        const pendingRequests = data.filter(
          (request) => request.status === "pending"
        );
        setRequests(pendingRequests);
      } catch (err) {
        console.error("Failed to fetch requests:", err);
      }
    };

    fetchRequests();
  }, []);

  const selectedSportName =
    sports.find((s) => s._id === selectedSport)?.name || "";

  const handleApprove = async (id) => {
    try {
      await fetch(`https://sports-club.onrender.com/api/admin/requests/approve/${id}`, {
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
      await fetch(`https://sports-club.onrender.com/api/admin/requests/reject/${id}`, {
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

  const handleSportChange = async (e) => {
    const sportId = e.target.value;
    setSelectedSport(sportId);
    setEditingEvent(null); // reset editing mode

    if (!sportId) {
      setEvents([]);
      return;
    }

    try {
      const res = await fetch(
        `https://sports-club.onrender.com/api/sports/${sportId}/events`
      );
      const data = await res.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error("Failed to fetch events", err);
    }
  };

  //delete events
  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch(
        `https://sports-club.onrender.com/api/sports/${selectedSport}/events/${eventId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authtoken: localStorage.getItem("authToken"),
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete event");
      setEvents((prev) => prev.filter((e) => e._id !== eventId));
      alert("Event deleted successfully!");
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete event");
    }
  };

  const startEdit = (event) => {
    setEditingEvent({ ...event }); // make a copy so we can edit fields
  };

  const cancelEdit = () => {
    setEditingEvent(null);
  };

  const handleSaveEdit = async () => {
    try {
      const res = await fetch(
        `https://sports-club.onrender.com/api/sports/${selectedSport}/events/${editingEvent._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authtoken: localStorage.getItem("authToken"),
          },
          body: JSON.stringify(editingEvent),
        }
      );

      if (!res.ok) throw new Error("Failed to update event");

      const updatedSport = await res.json();
      setEvents(updatedSport.events);
      setEditingEvent(null);
      alert("Event updated successfully!");
    } catch (err) {
      console.error("Error updating event:", err);
      alert("Failed to update event");
    }
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

              {selectedSport && (
                <div style={{ marginTop: "20px" }}>
                  <strong>Events for {selectedSportName}:</strong>
                  <ul style={{ marginTop: "10px" }}>
                    {events.map((ev) => (
                      <li key={ev._id}>
                        {editingEvent && editingEvent._id === ev._id ? (
                          <>
                            Event Name:
                            <input
                              type="text"
                              value={editingEvent.eventName}
                              onChange={(e) =>
                                setEditingEvent({
                                  ...editingEvent,
                                  eventName: e.target.value,
                                })
                              }
                            />
                            Date:
                            <input
                              type="date"
                              value={editingEvent.date?.split("T")[0] || ""}
                              onChange={(e) =>
                                setEditingEvent({
                                  ...editingEvent,
                                  date: e.target.value,
                                })
                              }
                            />
                            Time:
                            <input
                              type="time"
                              value={editingEvent.time || ""}
                              onChange={(e) =>
                                setEditingEvent({
                                  ...editingEvent,
                                  time: e.target.value,
                                })
                              }
                            />
                            Location:
                            <input
                              type="text"
                              placeholder="Location"
                              value={editingEvent.location || ""}
                              onChange={(e) =>
                                setEditingEvent({
                                  ...editingEvent,
                                  location: e.target.value,
                                })
                              }
                            />
                            Eligibility:
                            <textarea
                              placeholder="Eligibility"
                              value={editingEvent.eligibility || ""}
                              onChange={(e) =>
                                setEditingEvent({
                                  ...editingEvent,
                                  eligibility: e.target.value,
                                })
                              }
                            />
                            Description:
                            <textarea
                              placeholder="Description"
                              value={editingEvent.description || ""}
                              onChange={(e) =>
                                setEditingEvent({
                                  ...editingEvent,
                                  description: e.target.value,
                                })
                              }
                            />
                            <button
                              className="admin-btn"
                              onClick={handleSaveEdit}
                            >
                              Save
                            </button>
                            <button
                              className="admin-btn"
                              style={{
                                backgroundColor: "#ccc",
                                marginLeft: "8px",
                              }}
                              onClick={cancelEdit}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <strong>{ev.eventName}</strong> –{" "}
                            {formatDate(new Date(ev.date))}
                            <button
                              className="admin-btn"
                              style={{ marginLeft: "10px" }}
                              onClick={() => startEdit(ev)}
                            >
                              Edit
                            </button>
                            <button
                              className="admin-btn"
                              style={{
                                backgroundColor: "#f5b3b3",
                                marginLeft: "8px",
                              }}
                              onClick={() => handleDeleteEvent(ev._id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </li>
                    ))}
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
                  <p>
                    <strong>User:</strong> {req.user?.admission} (
                    {req.user?.email})
                  </p>

                  <p>
                    <strong>Reason:</strong> {req.reason}
                  </p>
                  <div className="button-group">
                    <button
                      className="approve"
                      onClick={() => handleApprove(req._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="decline"
                      onClick={() => handleDecline(req._id)}
                    >
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

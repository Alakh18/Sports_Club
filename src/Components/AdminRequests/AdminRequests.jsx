import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./AdminRequests.css";

const AdminRequests = () => {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  const fetchUserAndRequests = useCallback(async () => {
    setLoading(true);
    setUnauthorized(false);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setUnauthorized(true);
        setUser(null);
        setRequests([]);
        return;
      }

      const userRes = await axios.get("http://localhost:5000/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = userRes.data;
      setUser(userData);

      if (userData.role !== "admin") {
        setUnauthorized(true);
        setRequests([]);
        return;
      }

      const requestsRes = await axios.get("http://localhost:5000/api/admin/requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRequests(requestsRes.data);
    } catch (err) {
      console.error("Error fetching user or requests:", err);
      setUnauthorized(true);
      localStorage.removeItem("authToken");
      localStorage.removeItem("loggedInUser");
      setUser(null);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserAndRequests();
  }, [fetchUserAndRequests]);

  const handleAction = async (id, action) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No authentication token found. Cannot perform action.");
        setUnauthorized(true);
        return;
      }

      let response;
      if (action === "accept") {
        response = await axios.put(
          `http://localhost:5000/api/admin/requests/approve/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else if (action === "reject") {
        response = await axios.delete(
          `http://localhost:5000/api/admin/requests/reject/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        console.warn("Unknown action:", action);
        return;
      }

      console.log(`Action '${action}' successful:`, response.data.message);
      await fetchUserAndRequests();
    } catch (error) {
      console.error(`Error during ${action} action:`, error.response?.data?.error || error.message || error);
      alert(`Failed to ${action} request: ` + (error.response?.data?.error || "Server error. Check console."));
      await fetchUserAndRequests();
    }
  };

  if (loading) {
    return (
      <div className="centered-container">
        <div className="loading-box">Loading Admin Requests...</div>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="centered-container">
        <div className="unauthorized-box">
          ❌ Unauthorized Access. Please ensure you are logged in as an Admin.
        </div>
      </div>
    );
  }

  return (
    <div className="admin-requests-wrapper">
      <h1 className="admin-requests-title">📝 Admin Requests</h1>

      {requests.length === 0 ? (
        <div className="empty-state-box">
          <h2>🎉 All Clear!</h2>
          <p>No pending admin requests at this time. You're all caught up!</p>
        </div>
      ) : (
        <div className="requests-grid">
          {requests.map((req) => (
            <div className="request-card" key={req._id}>
              <div className="request-header">
                <p>
                  Admission: <span>{req.user?.admission || "N/A"}</span>
                </p>
                <p>
                  Email: <span>{req.user?.email || "N/A"}</span>
                </p>
              </div>

              <div className="request-reason">
                <p>Reason for Admin Access:</p>
                <blockquote>"{req.reason}"</blockquote>
              </div>

              <div className="action-buttons">
                <button
                  className="accept-btn"
                  onClick={() => handleAction(req._id, "accept")}
                >
                  ✅ Accept
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleAction(req._id, "reject")}
                >
                  ❌ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminRequests;

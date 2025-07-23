import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const AdminRequests = () => {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  // This function fetches the user and pending requests from the backend.
  const fetchUserAndRequests = useCallback(async () => {
    setLoading(true); // Always show loading when fetching data begins
    setUnauthorized(false); // Reset unauthorized status for a new fetch attempt

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        // If no token, user is not authenticated, mark as unauthorized
        setUnauthorized(true);
        setUser(null);
        setRequests([]); // Clear any old requests
        return; // Exit early
      }

      // 1. Fetch current user details to check their role
      // Backend route: GET /api/users/me
      const userRes = await axios.get("http://localhost:5000/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = userRes.data; // Backend /api/users/me returns the user object directly
      setUser(userData);

      // Check if the fetched user has 'admin' role
      if (userData.role !== "admin") {
        // If user is not an admin, mark as unauthorized
        setUnauthorized(true);
        setRequests([]); // Clear requests as unauthorized users shouldn't see them
        return; // Exit early
      }

      // 2. If user is an admin, fetch ONLY PENDING admin requests from the backend.
      // The backend route '/api/admin/requests' is configured to only return 'pending' requests.
      const requestsRes = await axios.get("http://localhost:5000/api/admin/requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRequests(requestsRes.data); // Update state with the fetched (pending) requests.
                                     // This will be an empty array if no pending requests exist.

    } catch (err) {
      console.error("Error fetching user or requests:", err);
      // On any error (e.g., token invalid, network issue), assume unauthorized or data failure
      setUnauthorized(true);
      // Clear potentially stale/invalid authentication data
      localStorage.removeItem("authToken");
      localStorage.removeItem("loggedInUser");
      setUser(null); // Clear user state
      setRequests([]); // Clear requests state
    } finally {
      setLoading(false); // Always set loading to false once the fetch attempt is complete
    }
  }, []); // Empty dependency array as this function uses stable setters and localStorage

  // useEffect to trigger the initial fetch when the component mounts
  useEffect(() => {
    fetchUserAndRequests();
  }, [fetchUserAndRequests]); // Dependency on fetchUserAndRequests (wrapped in useCallback)

  // Handle Accept or Reject Request actions
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
        // Backend route: PUT /api/admin/requests/approve/:id
        response = await axios.put(
          `http://localhost:5000/api/admin/requests/approve/${id}`,
          {}, // Empty body, as backend doesn't expect data here
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else if (action === "reject") {
        // Backend route: DELETE /api/admin/requests/reject/:id
        response = await axios.delete(
          `http://localhost:5000/api/admin/requests/reject/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        console.warn("Unknown action:", action);
        return;
      }

      console.log(`Action '${action}' successful:`, response.data.message);

      // After a successful action (accept/reject), re-fetch the *current* list
      // of pending requests from the backend. This ensures the UI is always
      // in sync with the actual state of pending requests in the database.
      await fetchUserAndRequests(); // This will update 'requests' to an empty array if no more are pending.

    } catch (error) {
      console.error(
        `Error during ${action} action:`,
        error.response?.data?.error || error.message || error
      );
      // Show an alert to the user if the action failed
      alert(`Failed to ${action} request: ` + (error.response?.data?.error || "Server error. Check console."));
      // Optional: Re-fetch on error to ensure UI reflects backend state,
      // in case the action failed partially (e.g., frontend thought it updated, but backend didn't).
      await fetchUserAndRequests(); 
    }
  };

  // Render Logic
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-xl text-gray-700 p-10 rounded-lg shadow-lg bg-white">Loading Admin Requests...</p>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="p-10 text-center text-red-700 text-2xl font-bold bg-white rounded-lg shadow-xl border-2 border-red-500">
          ❌ Unauthorized Access. Please ensure you are logged in as an Admin.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-10 mt-4 drop-shadow-md">
        📝 Admin Requests
      </h1>

      {/* Conditional rendering based on 'requests' array length */}
      {requests.length === 0 ? (
        <div className="flex-grow flex flex-col justify-center items-center text-center p-12 bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-gray-200">
          <p className="text-3xl text-gray-700 font-semibold mb-4">🎉 All Clear!</p>
          <p className="text-lg text-gray-600">No pending admin requests at this time. You're all caught up!</p>
        </div>
      ) : (
        // <<<<<<<<<<<<<<<<<<<<<<<< GRID LAYOUT APPLIED HERE >>>>>>>>>>>>>>>>>>>>>>>>>>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl"> {/* Increased max-w for more space */}
          {requests.map((req) => (
            <div
              key={req._id}
              // Gift card styling: subtle gradient, stronger shadow, refined border
              className="relative bg-gradient-to-br from-white via-blue-50 to-purple-100 rounded-3xl shadow-2xl p-8 border border-opacity-70 border-blue-200 hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 overflow-hidden"
            >
              {/* Optional: Add a subtle patterned background overlay for a richer feel */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23a0a0a0\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 6V5zM6 5v1H5z\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
              
              <div className="relative z-10"> {/* Ensure content is above the background pattern */}
                <div className="mb-4 pb-4 border-b border-blue-100"> {/* Adjusted border color */}
                  <p className="text-xl font-bold text-blue-800 mb-1"> {/* Adjusted text color */}
                    Admission: <span className="text-gray-900">{req.user?.admission || "N/A"}</span> {/* Stronger text color */}
                  </p>
                  <p className="text-md text-gray-700"> {/* Adjusted text color */}
                    Email: <span className="font-medium text-gray-800">{req.user?.email || "N/A"}</span> {/* Stronger text color */}
                  </p>
                </div>
                
                <div className="mb-5">
                  <p className="text-lg font-semibold text-purple-800 mb-2"> {/* Adjusted text color */}
                    Reason for Admin Access:
                  </p>
                  <p className="text-gray-800 mt-2 p-4 bg-white rounded-lg border border-gray-200 italic shadow-sm">
                    "{req.reason}"
                  </p>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                  <button
                    onClick={() => handleAction(req._id, "accept")}
                    className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-7 rounded-full transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-75 transform hover:scale-105"
                  >
                    <span className="mr-2 text-2xl">✅</span> Accept
                  </button>
                  <button
                    onClick={() => handleAction(req._id, "reject")}
                    className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-7 rounded-full transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-red-400 focus:ring-opacity-75 transform hover:scale-105"
                  >
                    <span className="mr-2 text-2xl">❌</span> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminRequests;
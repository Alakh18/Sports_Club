import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calender.css";
import axios from "axios";
import { format } from "date-fns";

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [trackedEvents, setTrackedEvents] = useState([]);

  const token = localStorage.getItem("authToken");

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data.user);
        setTrackedEvents(res.data.user.trackedEvents || []);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    if (token) fetchUser();
  }, [token]);

  // Fetch all sports + events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("/api/sports");
        const allEvents = res.data.flatMap((sport) =>
          sport.events.map((event) => ({
            ...event,
            sportName: sport.name,
            eventName: event.name || event.eventName,
          }))
        );
        setEvents(allEvents);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
  }, []);

  const isSameDay = (d1, d2) => {
    try {
      return format(new Date(d1), "yyyy-MM-dd") === format(new Date(d2), "yyyy-MM-dd");
    } catch (err) {
      console.warn("Invalid date in isSameDay:", d1, d2);
      return false;
    }
  };
  const eventsForDate = Array.isArray(events)
    ? events.filter((event) =>
      event?.date && isSameDay(event.date, selectedDate)
    )
    : [];

  const isTracked = (event) => {
    if (!Array.isArray(trackedEvents)) return false;

    // Use normalized comparison
    const eventDateStr = format(new Date(event.date), "yyyy-MM-dd");
    const eventNameStr = event.eventName || event.name;
    const sportNameStr = event.sportName || event.sport;

    return trackedEvents.some((e) => {
      const trackedDateStr = format(new Date(e.date), "yyyy-MM-dd");
      return (
        (e.eventName === eventNameStr) &&
        (trackedDateStr === eventDateStr) &&
        (e.sport === sportNameStr)
      );
    });
  };

  const handleTrack = async (event) => {
    try {
      const res = await axios.post(
        "/api/track",
        {
          event: {
            eventName: event.eventName || event.name,
            date: format(new Date(event.date), "yyyy-MM-dd"),
            sport: event.sportName || event.sport,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTrackedEvents(res.data.trackedEvents);
    } catch (err) {
      console.error("Track failed:", err);
    }
  };

  // SOLVED: Updated handleUntrack function
  const handleUntrack = async (eventToUntrack) => {
    try {
      let fullEventDetails = { ...eventToUntrack };

      // If the event is missing a name (likely from the trackedEvents list), find it in the main events list
      if (!fullEventDetails.eventName && !fullEventDetails.name) {
        const matchingEvent = events.find(e =>
          isSameDay(e.date, fullEventDetails.date) &&
          (e.sportName === fullEventDetails.sport)
        );

        if (matchingEvent) {
          fullEventDetails = { ...matchingEvent, ...fullEventDetails };
        }
      }

      const eventToSend = {
        eventName: fullEventDetails.eventName || fullEventDetails.name,
        date: format(new Date(fullEventDetails.date), "yyyy-MM-dd"),
        sport: fullEventDetails.sportName || fullEventDetails.sport,
      };

      console.log("DEBUG: eventToSend for untrack:", eventToSend);

      if (!eventToSend.date || !eventToSend.sport) { // eventName is now optional for the lookup
            alert("Cannot untrack event: Missing required information (date, sport).");
            console.error("Untrack validation failed on client:", eventToSend);
            return;
        }

      const res = await axios.delete("/api/track", {
        headers: { Authorization: `Bearer ${token}` },
        data: { event: eventToSend },
      });

      // Update state by refetching user data for consistency
      const userRes = await axios.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrackedEvents(userRes.data.user.trackedEvents || []);
      // alert("Event untracked!");
      
    } catch (err) {
      console.error("❌ Untrack failed:", err?.response?.data || err.message);
      alert("Failed to untrack. See console.");
    }
  };


  const tileContent = ({ date }) => {
    try {
      const hasEvent = events.some((event) => {
        if (!event?.date) return false;
        const eventDate = new Date(event.date);
        const tileDate = new Date(date);
        if (isNaN(eventDate.getTime())) return false;
        return format(eventDate, "yyyy-MM-dd") === format(tileDate, "yyyy-MM-dd");
      });
      return hasEvent ? <div style={{ textAlign: "center", color: "green" }}>•</div> : null;
    } catch (err) {
      console.warn("Error in tileContent:", err);
      return null;
    }
  };

  return (
    <div className="main-calendar-layout">
      <div className="calendar-sidebar-container">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileContent={tileContent}
        />
        <div className="selected-date-box">
          <p className="selected-label">Selected Date:</p>
          <p className="selected-date">{selectedDate.toDateString()}</p>
        </div>
      </div>

      <div className="page-content-wrapper">
        <div className="events-box">
          <h2>📅 Events on {selectedDate.toDateString().toUpperCase()}</h2>
          {eventsForDate.length === 0 ? (
            <p>No events today.</p>
          ) : (
            eventsForDate.map((event, index) => {
              if (!event) {
                console.warn("⚠️ Skipping undefined event at index", index);
                return null;
              }

              return (
                <div key={index} className="date-highlight-box">
                  <p>
                    <strong>{event.eventName || "Unnamed Event"}</strong> — {event.time} @ {event.location}
                  </p>
                  {user && (
                    isTracked(event) ? (
                      <button
                        className="untrack-btn"
                        onClick={() => handleUntrack(event)}
                      >
                        Untrack
                      </button>
                    ) : (
                      <button className="untrack-btn" onClick={() => handleTrack(event)}>
                        Track
                      </button>
                    )
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="tracked-events-box">
          <h3>🎯 Tracked Events</h3>
          {!Array.isArray(trackedEvents) || trackedEvents.length === 0 ? (
            <p>No tracked events yet.</p>
          ) : (
            <ul>
              {trackedEvents.map((e, i) => (
                <li key={i}>
                  {/* Display eventName if available, otherwise find it for display */}
                  {e.eventName || events.find(evt => isSameDay(evt.date, e.date) && evt.sportName === e.sport)?.eventName || 'Unnamed Event'} 
                  ({format(new Date(e.date), "dd-MMM-yyyy")}) — {e.sport}
                  <button
                    className="untrack-btn"
                    onClick={() => {
                      console.log("DEBUG: Event from trackedEvents for untrack:", e);
                      handleUntrack(e);
                    }}
                  >
                    Untrack
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
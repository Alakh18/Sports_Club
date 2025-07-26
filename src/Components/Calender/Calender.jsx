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

  const token = localStorage.getItem("authToken"); // ✅ Auth token

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

  return trackedEvents.some(
    (e) =>
      e.eventName === event.name &&
      e.date === event.date &&
      e.sport === event.sportName
  );
};


  const handleTrack = async (event) => {
    try {
      const res = await axios.post(
        "/api/track",
        {
          event: {
            eventName: event.name,
            date: event.date,
            sport: event.sportName,
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

  const handleUntrack = async (event) => {
  try {
    const eventToSend = {
      eventName: event.eventName || event.name,
      date: format(new Date(event.date), "yyyy-MM-dd"), // ✅ force format match
      sport: event.sport || event.sportName,
    };

    console.log("Trying to untrack:", eventToSend);
    console.log("Tracked events:", trackedEvents);

    const res = await axios.delete("/api/track", {
      headers: { Authorization: `Bearer ${token}` },
      data: { event: eventToSend },
    });

    const userRes = await axios.get("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setTrackedEvents(userRes.data.user.trackedEvents || []);
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
            eventsForDate.map((event, index) => (
              <div key={index} className="date-highlight-box">
                <p>
                  <strong>{event.name}</strong> — {event.time} @ {event.location}
                </p>
                {user && (
  isTracked(event) ? (
    <button
      className="untrack-btn"
      onClick={() =>
        handleUntrack({
          eventName: event.name,
          date: event.date,
          sport: event.sportName
        })
      }
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
            ))
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
          {e.eventName} ({e.date}) — {e.sport}
          <button
            className="untrack-btn"
            onClick={() => handleUntrack(e)}
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

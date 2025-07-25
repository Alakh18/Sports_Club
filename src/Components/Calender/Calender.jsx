import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calender.css";

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const onChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="main-calendar-layout">
      <div className="calendar-sidebar-container">
        <Calendar onChange={onChange} value={selectedDate} />
        <div className="selected-date-box">
          <p className="selected-label">Selected Date:</p>
          <p className="selected-date">{selectedDate.toDateString()}</p>
        </div>
      </div>

      <div className="page-content-wrapper">
        <div className="events-box">
          <h2>📅 Events on {selectedDate.toDateString().toUpperCase()}</h2>
          <p>No events today.</p>
        </div>

        <div className="tracked-events-box">
          <h3>🎯 Tracked Events</h3>
          <ul>
            <li>
              Marathon
              <button className="untrack-btn">Untrack</button>
            </li>
            <li>
              Football Match
              <button className="untrack-btn">Untrack</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;

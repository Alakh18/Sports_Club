import React, { useState } from "react";
import CalendarSidebar from "./CalendarSidebar";
import CalendarEventList from "./CalendarEventList";
import TrackedEvents from "./TrackedEvents";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [refreshFlag, setRefreshFlag] = useState(false);

  const triggerRefresh = () => setRefreshFlag(prev => !prev);

return (
  <div className="min-h-screen bg-gray-100 py-10 px-4">
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Top Section: Calendar + Selected Date */}
      <div className="flex flex-col md:flex-row items-start justify-center gap-10">
        <CalendarSidebar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          triggerRefresh={triggerRefresh}
        />
      </div>

      {/* Centered Events Section */}
      <div className="bg-white p-6 rounded-xl shadow max-w-3xl mx-auto">
        <CalendarEventList
          selectedDate={selectedDate}
          refreshFlag={refreshFlag}
          triggerRefresh={triggerRefresh}
        />
      </div>

      {/* Centered Tracked Events Section */}
      <div className="bg-white p-6 rounded-xl shadow max-w-3xl mx-auto">
        <TrackedEvents triggerRefresh={triggerRefresh} />
      </div>
    </div>
  </div>
);
}

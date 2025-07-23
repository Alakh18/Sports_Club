import React, { useState } from "react";
import CalendarSidebar from "./CalendarSidebar";
import CalendarEventList from "./CalendarEventList";
import TrackedEvents from "./TrackedEvents";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [refreshFlag, setRefreshFlag] = useState(false);

  const triggerRefresh = () => setRefreshFlag(prev => !prev);

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <CalendarSidebar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        triggerRefresh={triggerRefresh}
      />
      <div className="flex-1 p-4">
        <CalendarEventList
          selectedDate={selectedDate}
          refreshFlag={refreshFlag}
          triggerRefresh={triggerRefresh}
        />
      </div>
      <TrackedEvents triggerRefresh={triggerRefresh} />
    </div>
  );
}

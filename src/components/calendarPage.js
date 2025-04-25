import React from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const handleEventClick = (event) => {
  alert(`${event.title}\nStart: ${event.start}\nEnd: ${event.end}`);
}

const ConcertCalendar = () => {
  const [shows, setShows] = React.useState([]);
  const [currentView, setCurrentView] = React.useState("month");
  const [currentDate, setCurrentDate] = React.useState(new Date());

  React.useEffect(() => {
    const getShows = async () => {
      try {
        const res = await fetch("http://localhost:8000/shows");
        const data = await res.json();
        setShows(data || []);
      } catch (err) {
        console.error("Failed to fetch shows:", err);
      }
    };

    getShows();
  }, []);

  const events = shows.map((show) => ({
    title: `${show.artist_name} @ ${show.venue_name}`,
    start: new Date(`${show.date}T${show.time || "19:00"}`),
    end: new Date(`${show.date}T${show.time || "21:00"}`),
    allDay: false,
  }));

  return (
    <div className="calendar-container" style={{ height: "80vh", padding: "1rem" }}>
      <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      titleAccessor="title"
      views={["month", "week", "day"]}
      view={currentView}
      onView={setCurrentView}
      date={currentDate}
      onNavigate={setCurrentDate}
      defaultView="month"
      popup
      style={{ height: "100%" }}
      onSelectEvent={handleEventClick} 
      />
    </div>
  );
};

export default ConcertCalendar;
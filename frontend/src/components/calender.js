import React, { useState, useEffect } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  format,
  isSameMonth,
  isSameDay,
  parseISO,
} from "date-fns";
import axios from "axios";
import "./calender.css";

function Calendar({ user }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [newEvent, setNewEvent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 👉 Improved date parsing function
  const parseDueDate = (dueDate, dueTime) => {
    if (!dueDate) {
      console.log("📭 No dueDate provided");
      return null;
    }
    
    try {
      // Check if dueDate has the expected structure
      if (typeof dueDate.year === 'undefined' || 
          typeof dueDate.month === 'undefined' || 
          typeof dueDate.day === 'undefined') {
        console.warn("⚠️ Invalid dueDate structure:", dueDate);
        return null;
      }

      const dateStr = `${dueDate.year}-${String(dueDate.month).padStart(2, '0')}-${String(dueDate.day).padStart(2, '0')}`;
      
      let dateObj;
      if (dueTime && typeof dueTime.hours !== 'undefined' && typeof dueTime.minutes !== 'undefined') {
        const timeStr = `${String(dueTime.hours).padStart(2, '0')}:${String(dueTime.minutes).padStart(2, '0')}:00`;
        dateObj = new Date(`${dateStr}T${timeStr}`);
      } else {
        dateObj = new Date(dateStr);
        // Set to end of day if no time specified
        dateObj.setHours(23, 59, 59);
      }

      if (isNaN(dateObj.getTime())) {
        console.warn("⚠️ Invalid date created from:", dueDate);
        return null;
      }

      return dateObj;
    } catch (error) {
      console.error("❌ Error parsing due date:", error);
      return null;
    }
  };

  // 👉 Fetch both DB events + Google Classroom assignments
  useEffect(() => {
    async function fetchAllEvents() {
      setError(null);
      setLoading(true);
      
      if (!user) {
        console.log("❌ No user available");
        setLoading(false);
        return;
      }

      try {
        console.log("🔍 Fetching events for user:", user.googleId || user._id);
        
        let dbEvents = [];
        
        // 1. Fetch MongoDB events (try both Google ID and MongoDB _id)
        try {
          let eventsRes;
          if (user.googleId) {
            eventsRes = await axios.get(`http://localhost:5000/api/users/google/${user.googleId}/events`, {
              withCredentials: true,
            });
          } else if (user._id) {
            eventsRes = await axios.get(`http://localhost:5000/api/users/${user._id}/events`, {
              withCredentials: true,
            });
          }
          
          if (eventsRes && eventsRes.data) {
            console.log("📅 DB Events found:", eventsRes.data.length);
            dbEvents = eventsRes.data.map((ev) => ({
              date: format(new Date(ev.date), "yyyy-MM-dd"),
              title: ev.title,
              type: "custom",
              dateObj: new Date(ev.date),
              sortKey: new Date(ev.date).getTime()
            }));
          }
        } catch (dbError) {
          console.log("📭 No DB events found or error:", dbError.message);
        }

        // 2. Fetch Google Classroom assignments
        let assignments = [];
        try {
          console.log("🔄 Fetching assignments from /api/assignments");
          const assignmentsRes = await axios.get("http://localhost:5000/api/assignments", {
            withCredentials: true,
          });
          
          console.log("📘 Assignments API Response:", assignmentsRes.data);
          
          if (Array.isArray(assignmentsRes.data)) {
            assignments = assignmentsRes.data
              .map((ev, index) => {
                console.log(`📋 Processing assignment ${index + 1}:`, ev.title, "dueDate:", ev.dueDate);
                
                // Handle assignments with due dates
                if (ev.dueDate) {
                  const dueDateObj = parseDueDate(ev.dueDate, ev.dueTime);
                  if (!dueDateObj) {
                    console.log("⏩ Skipping - invalid due date");
                    return null;
                  }
                  
                  const date = format(dueDateObj, "yyyy-MM-dd");
                  return {
                    date,
                    title: `${ev.course}: ${ev.title}`,
                    type: "assignment",
                    dateObj: dueDateObj,
                    sortKey: dueDateObj.getTime(),
                    dueDate: ev.dueDate,
                    dueTime: ev.dueTime,
                    course: ev.course,
                    hasDueDate: true
                  };
                } else {
                  // Handle assignments without due dates - assign to today or a default date
                  console.log("📅 Assignment has no due date, assigning to today");
                  const defaultDate = new Date();
                  const date = format(defaultDate, "yyyy-MM-dd");
                  return {
                    date,
                    title: `${ev.course}: ${ev.title} (No due date)`,
                    type: "assignment",
                    dateObj: defaultDate,
                    sortKey: defaultDate.getTime(),
                    course: ev.course,
                    hasDueDate: false
                  };
                }
              })
              .filter(ev => ev !== null);

            console.log("✅ Processed assignments:", assignments);
          } else {
            console.warn("⚠️ Assignments data is not an array:", assignmentsRes.data);
          }

        } catch (err) {
          console.error("❌ Error fetching assignments:", err);
          setError("Failed to load assignments: " + (err.response?.data?.message || err.message));
        }

        // 3. Merge and group events
        const allEvents = [...dbEvents, ...assignments];
        console.log("🔗 All events to merge - DB:", dbEvents.length, "Assignments:", assignments.length);

        const grouped = allEvents.reduce((acc, ev) => {
          if (!acc[ev.date]) acc[ev.date] = [];
          acc[ev.date].push(ev);
          return acc;
        }, {});

        // 4. Sort events within each date
        Object.keys(grouped).forEach(date => {
          grouped[date].sort((a, b) => {
            // Sort by date/time first
            if (a.sortKey !== b.sortKey) {
              return a.sortKey - b.sortKey;
            }
            // Then sort by type (assignments first)
            if (a.type !== b.type) {
              return a.type === 'assignment' ? -1 : 1;
            }
            // Then sort by title
            return a.title.localeCompare(b.title);
          });
        });

        console.log("📦 Final grouped events:", grouped);
        setEvents(grouped);

      } catch (err) {
        console.error("❌ Error in fetchAllEvents:", err);
        setError("Failed to load calendar: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    }

    fetchAllEvents();
  }, [user]);

  // 👉 Get events for the selected date, sorted properly
  const getSortedEventsForDate = (date) => {
    const key = format(date, "yyyy-MM-dd");
    const dateEvents = events[key] || [];
    
    return dateEvents.sort((a, b) => {
      // Sort by time if available
      if (a.dueTime && b.dueTime) {
        const aTime = a.dueTime.hours * 60 + a.dueTime.minutes;
        const bTime = b.dueTime.hours * 60 + b.dueTime.minutes;
        return aTime - bTime;
      }
      // If only one has time, put the one with time first
      if (a.dueTime && !b.dueTime) return -1;
      if (!a.dueTime && b.dueTime) return 1;
      // Sort by title for events without specific time
      return a.title.localeCompare(b.title);
    });
  };

  // 👉 Render events panel with sorted events
  function renderEvents() {
    const sortedEvents = getSortedEventsForDate(selectedDate);
    
    if (loading) {
      return (
        <div className="event-panel">
          <h3>Loading events...</h3>
        </div>
      );
    }

    return (
      <div className="event-panel">
        <h3>Events on {format(selectedDate, "dd MMM yyyy")}</h3>
        {sortedEvents.length > 0 ? (
          <ul className="events-list">
            {sortedEvents.map((ev, i) => (
              <li key={i} className={`event-item ${ev.type === 'assignment' ? 'assignment-item' : 'custom-item'} ${ev.hasDueDate === false ? 'no-due-date' : ''}`}>
                {ev.type === "assignment" ? "📘 " : "📝 "}
                <strong>{ev.title}</strong>
                {ev.dueTime && (
                  <span className="event-time">
                    {" "}at {String(ev.dueTime.hours).padStart(2, '0')}:{String(ev.dueTime.minutes).padStart(2, '0')}
                  </span>
                )}
                {ev.type === "assignment" && (
                  <div className="course-badge">{ev.course}</div>
                )}
                {ev.hasDueDate === false && (
                  <span className="no-due-date-badge">No due date</span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No events scheduled 🎯</p>
        )}
        <div className="add-event">
          <input
            type="text"
            value={newEvent}
            onChange={(e) => setNewEvent(e.target.value)}
            placeholder="Add new event..."
            onKeyPress={(e) => e.key === "Enter" && handleAddEvent()}
          />
          <button onClick={handleAddEvent}>Add Event</button>
        </div>
      </div>
    );
  }

  // 👉 Add custom event
  async function handleAddEvent() {
    if (!newEvent.trim() || !user) return;
    const dateKey = format(selectedDate, "yyyy-MM-dd");

    try {
      let res;
      // Try with Google ID first
      if (user.googleId) {
        res = await axios.post(
          `http://localhost:5000/api/users/google/${user.googleId}/events`,
          { title: newEvent, date: selectedDate },
          { withCredentials: true }
        );
      } else if (user._id) {
        // Fallback to MongoDB _id
        res = await axios.post(
          `http://localhost:5000/api/users/${user._id}/events`,
          { title: newEvent, date: selectedDate },
          { withCredentials: true }
        );
      } else {
        throw new Error("No user ID available");
      }

      const newEventObj = {
        date: dateKey,
        title: res.data.title,
        type: "custom",
        dateObj: new Date(selectedDate),
        sortKey: new Date(selectedDate).getTime()
      };

      setEvents((prev) => ({
        ...prev,
        [dateKey]: prev[dateKey]
          ? [...prev[dateKey], newEventObj].sort((a, b) => a.sortKey - b.sortKey)
          : [newEventObj],
      }));
      setNewEvent("");
    } catch (err) {
      console.error("❌ Error adding event:", err);
      alert("Failed to add event. Please try again.");
    }
  }

  // 👉 Navigation
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // 👉 Render header
  function renderHeader() {
    return (
      <div className="header">
        <button onClick={prevMonth}>{"<"}</button>
        <h2>{format(currentMonth, "MMMM yyyy")}</h2>
        <button onClick={nextMonth}>{">"}</button>
      </div>
    );
  }

  // 👉 Render day names
  function renderDays() {
    const days = [];
    const start = startOfWeek(currentMonth);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="day-name" key={i}>
          {format(addDays(start, i), "EEE")}
        </div>
      );
    }
    return <div className="days-row">{days}</div>;
  }

  // 👉 Render date cells
  function renderCells() {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const formattedDate = format(cloneDay, "yyyy-MM-dd");
        const dayEvents = events[formattedDate] || [];
        const hasEvents = dayEvents.length > 0;

        days.push(
          <div
            className={`cell 
              ${!isSameMonth(cloneDay, monthStart) ? "disabled" : ""} 
              ${isSameDay(cloneDay, selectedDate) ? "selected" : ""} 
              ${hasEvents ? "event-day" : ""}`}
            key={cloneDay.toString()}
            onClick={() => setSelectedDate(cloneDay)}
          >
            <span className="day-number">{format(cloneDay, "d")}</span>
            {hasEvents && (
              <div className="event-dots">
                {dayEvents.slice(0, 3).map((ev, index) => ( // Limit to 3 dots
                  <span 
                    key={index} 
                    className={`event-dot ${ev.type === 'assignment' ? 'assignment-dot' : 'custom-dot'} ${ev.hasDueDate === false ? 'no-due-date-dot' : ''}`}
                    title={ev.title}
                  ></span>
                ))}
                {dayEvents.length > 3 && (
                  <span className="more-events-dot" title={`${dayEvents.length - 3} more events`}>+</span>
                )}
              </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }

    return <div className="body">{rows}</div>;
  }

  return (
    <div className="calendar-container">
      {error && (
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
      
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      {renderEvents()}
    </div>
  );
}

export default Calendar;
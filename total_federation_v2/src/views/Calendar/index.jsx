import React from 'react';

const GEORGIAN_MONTHS = [
  "იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი",
  "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"
];

const WEEKDAYS = ["ორშ", "სამ", "ოთხ", "ხუთ", "პარ", "შაბ", "კვი"];

const formatLocalDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const getGeorgianDateTitle = (dateStr) => {
  if (!dateStr) return "";
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = parts[0];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  return `${day} ${GEORGIAN_MONTHS[monthIdx]}, ${year}`;
};

const CalendarDashboard = () => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [events, setEvents] = React.useState([]); // all events for indicator dots
  const [selectedDayEvents, setSelectedDayEvents] = React.useState([]); // events for the selected date
  const [loading, setLoading] = React.useState(false);
  
  // Selection and form states
  const [selectedDateStr, setSelectedDateStr] = React.useState(() => formatLocalDate(new Date()));
  const [eventTitle, setEventTitle] = React.useState("");
  const [eventDescription, setEventDescription] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const fetchAllEvents = async () => {
    try {
      const res = await fetch('/api/v1/calendar');
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error("Error fetching all calendar events:", err);
    }
  };

  const fetchSelectedDayEvents = async (dateStr) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/calendar?date=${dateStr}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedDayEvents(data);
      }
    } catch (err) {
      console.error("Error fetching day events:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAllEvents();
  }, []);

  React.useEffect(() => {
    if (selectedDateStr) {
      fetchSelectedDayEvents(selectedDateStr);
    }
  }, [selectedDateStr]);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Generate calendar days
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  // Shift Sunday (0) to index 6, Monday (1) to index 0, etc.
  const startOffset = (firstDay + 6) % 7; 

  const daysArray = [];

  // Previous month trailing days
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  for (let i = startOffset - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    daysArray.push({
      day,
      isCurrentMonth: false,
      dateStr,
      year: prevYear,
      month: prevMonth
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    daysArray.push({
      day,
      isCurrentMonth: true,
      dateStr,
      year: currentYear,
      month: currentMonth
    });
  }

  // Next month leading days to fill grid to 35 or 42 cells
  const totalCells = daysArray.length <= 35 ? 35 : 42;
  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  let nextMonthDay = 1;
  while (daysArray.length < totalCells) {
    const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(nextMonthDay).padStart(2, '0')}`;
    daysArray.push({
      day: nextMonthDay,
      isCurrentMonth: false,
      dateStr,
      year: nextYear,
      month: nextMonth
    });
    nextMonthDay++;
  }

  const handleCellClick = (dateStr) => {
    setSelectedDateStr(dateStr);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!eventTitle.trim()) {
      alert("გთხოვთ შეიყვანოთ აქტივობის დასახელება!");
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch('/api/v1/calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event_date: selectedDateStr,
          event_title: eventTitle.trim(),
          event_description: eventDescription.trim()
        })
      });
      if (res.ok) {
        const result = await res.json();
        if (result.success) {
          setEventTitle("");
          setEventDescription("");
          await fetchAllEvents();
          await fetchSelectedDayEvents(selectedDateStr);
        } else {
          alert("შეცდომა შენახვისას: " + result.error);
        }
      } else {
        alert("კავშირის შეცდომა სერვერთან.");
      }
    } catch (err) {
      console.error("Error saving event:", err);
      alert("გაუთვალისწინებელი შეცდომა შენახვისას.");
    } finally {
      setIsSaving(false);
    }
  };

  // Group events by dateStr for fast lookup (indicators)
  const eventsByDate = React.useMemo(() => {
    const map = {};
    events.forEach(event => {
      const date = event.event_date || event.eventDate;
      if (date) {
        if (!map[date]) {
          map[date] = [];
        }
        map[date].push(event);
      }
    });
    return map;
  }, [events]);

  // Style objects matching the premium dark theme
  const containerStyle = {
    flex: 1,
    padding: "24px",
    backgroundColor: "var(--color-iron)",
    color: "var(--color-bone-light)",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    fontFamily: "'FiraGO', 'Lato', 'Poppins', sans-serif",
    height: "100%",
    boxSizing: "border-box",
    overflowY: "auto"
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    flexShrink: 0
  };

  const titleStyle = {
    margin: 0,
    fontSize: "20px",
    fontWeight: "700",
    color: "var(--color-bone-light)",
    display: "flex",
    alignItems: "center",
    gap: "10px"
  };

  const navControlsStyle = {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    backgroundColor: "var(--color-iron-surface)",
    border: "1px solid var(--color-iron-border)",
    padding: "6px 14px",
    borderRadius: "10px"
  };

  const navButtonStyle = {
    background: "none",
    border: "none",
    color: "var(--color-emerald-core)",
    fontSize: "18px",
    cursor: "pointer",
    padding: "0 6px",
    transition: "transform 0.2s ease, text-shadow 0.2s ease",
    textShadow: "0 0 8px color-mix(in oklab, var(--color-emerald-core) 40%, transparent)",
    outline: "none"
  };

  const monthYearTextStyle = {
    fontSize: "15px",
    fontWeight: "600",
    color: "var(--color-bone-light)",
    minWidth: "140px",
    textAlign: "center"
  };

  const workspaceContainerStyle = {
    display: "flex",
    flexDirection: "row",
    gap: "24px",
    alignItems: "flex-start",
    height: "auto",
    width: "100%",
    boxSizing: "border-box"
  };

  const leftColumnStyle = {
    flex: "0 0 40%",
    maxWidth: "40%",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    boxSizing: "border-box"
  };

  const gridWrapperStyle = {
    backgroundColor: "var(--color-iron-surface)",
    borderRadius: "12px",
    border: "1px solid var(--color-iron-border)",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
    width: "100%",
    boxSizing: "border-box"
  };

  const weekdayHeaderStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "8px",
    textAlign: "center",
    borderBottom: "1px solid var(--color-iron-border)",
    paddingBottom: "10px"
  };

  const weekdayLabelStyle = {
    fontSize: "12px",
    fontWeight: "600",
    color: "var(--color-silver-structure)",
    textTransform: "uppercase",
    letterSpacing: "1px"
  };

  const calendarGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "6px",
  };

  const getCellStyles = (dayInfo) => {
    const isActive = dayInfo.dateStr === selectedDateStr;
    const today = new Date();
    const isToday = today.getFullYear() === dayInfo.year &&
                    today.getMonth() === dayInfo.month &&
                    today.getDate() === dayInfo.day;

    return {
      position: "relative",
      backgroundColor: dayInfo.isCurrentMonth ? "rgba(255, 255, 255, 0.02)" : "rgba(255, 255, 255, 0.005)",
      border: isActive 
        ? "1.5px solid var(--color-emerald-core)" 
        : isToday
          ? "1px dashed var(--color-emerald-core)"
          : "1px solid var(--color-iron-border)",
      borderRadius: "8px",
      padding: "8px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "50px",
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
      boxShadow: isActive ? "0 0 10px rgba(0, 230, 118, 0.25)" : "none"
    };
  };

  const dayNumberStyle = (dayInfo) => {
    const isActive = dayInfo.dateStr === selectedDateStr;
    const today = new Date();
    const isToday = today.getFullYear() === dayInfo.year &&
                    today.getMonth() === dayInfo.month &&
                    today.getDate() === dayInfo.day;

    return {
      fontSize: "14px",
      fontWeight: (isActive || isToday) ? "700" : "500",
      color: isActive 
        ? "var(--color-emerald-core)" 
        : isToday
          ? "var(--color-emerald-core)"
          : dayInfo.isCurrentMonth 
            ? "var(--color-bone-light)" 
            : "rgba(245, 245, 247, 0.2)"
    };
  };

  const rightColumnStyle = {
    flex: "0 0 60%",
    maxWidth: "60%",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    backgroundColor: "var(--color-iron-surface)",
    borderRadius: "12px",
    border: "1px solid var(--color-iron-border)",
    padding: "24px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
    boxSizing: "border-box"
  };

  return (
    <div style={containerStyle}>
      {/* Page Header */}
      <div style={headerStyle}>
        <h3 style={titleStyle}>
          <i className="fa-solid fa-calendar-days" style={{ color: "var(--color-emerald-core)", textShadow: "0 0 8px rgba(0,230,118,0.4)" }}></i>
          აქტივობის კალენდარი
        </h3>
        
        {/* Navigation Arrows & Current Month */}
        <div style={navControlsStyle}>
          <button 
            style={navButtonStyle} 
            onClick={handlePrevMonth}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.2)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            title="წინა თვე"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          
          <span style={monthYearTextStyle}>
            {GEORGIAN_MONTHS[currentMonth]} {currentYear}
          </span>
          
          <button 
            style={navButtonStyle} 
            onClick={handleNextMonth}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.2)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            title="შემდეგი თვე"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>

      {/* Two-Column Main Workspace */}
      <div style={workspaceContainerStyle}>
        {/* Left Column - 40% Calendar */}
        <div style={leftColumnStyle}>
          <div style={gridWrapperStyle}>
            {/* Weekdays Header */}
            <div style={weekdayHeaderStyle}>
              {WEEKDAYS.map(day => (
                <div key={day} style={weekdayLabelStyle}>
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div style={calendarGridStyle}>
              {daysArray.map((dayInfo, idx) => {
                const dayEvents = eventsByDate[dayInfo.dateStr] || [];
                const isActive = dayInfo.dateStr === selectedDateStr;

                return (
                  <div
                    key={`${dayInfo.dateStr}-${idx}`}
                    style={getCellStyles(dayInfo)}
                    onClick={() => handleCellClick(dayInfo.dateStr)}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = "var(--color-emerald-core)";
                      e.currentTarget.style.boxShadow = "0 0 10px rgba(0, 230, 118, 0.15)";
                    }}
                    onMouseLeave={e => {
                      const today = new Date();
                      const isToday = today.getFullYear() === dayInfo.year &&
                                      today.getMonth() === dayInfo.month &&
                                      today.getDate() === dayInfo.day;
                      e.currentTarget.style.borderColor = isActive
                        ? "var(--color-emerald-core)"
                        : isToday
                          ? "var(--color-emerald-core)"
                          : "var(--color-iron-border)";
                      e.currentTarget.style.boxShadow = isActive ? "0 0 10px rgba(0, 230, 118, 0.25)" : "none";
                    }}
                  >
                    {/* Day number */}
                    <span style={dayNumberStyle(dayInfo)}>
                      {dayInfo.day}
                    </span>

                    {/* Indicator Dot */}
                    {dayEvents.length > 0 && (
                      <span style={{
                        position: "absolute",
                        bottom: "6px",
                        right: "6px",
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "var(--color-emerald-core)",
                        boxShadow: "0 0 6px var(--color-emerald-core)"
                      }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - 60% Workspace */}
        <div style={rightColumnStyle}>
          {/* Header */}
          <h4 style={{
            margin: 0,
            fontSize: "17px",
            fontWeight: "700",
            color: "var(--color-bone-light)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            borderBottom: "1px solid var(--color-iron-border)",
            paddingBottom: "12px"
          }}>
            <i className="fa-solid fa-clipboard-list" style={{ color: "var(--color-emerald-core)", textShadow: "0 0 8px rgba(0,230,118,0.3)" }}></i>
            ჩანიშვნები: {getGeorgianDateTitle(selectedDateStr)}
          </h4>

          {/* Existing list block */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            maxHeight: "350px",
            overflowY: "auto",
            paddingRight: "6px"
          }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: "20px", color: "var(--color-silver-structure)" }}>
                იტვირთება...
              </div>
            ) : selectedDayEvents.length === 0 ? (
              <div style={{
                textAlign: "center",
                padding: "40px 16px",
                color: "var(--color-silver-structure)",
                fontSize: "14px",
                border: "1px dashed var(--color-iron-border)",
                borderRadius: "8px",
                backgroundColor: "rgba(0, 0, 0, 0.1)"
              }}>
                <i className="fa-solid fa-calendar-xmark" style={{ display: "block", fontSize: "24px", marginBottom: "8px", color: "var(--color-silver-structure)", opacity: 0.6 }}></i>
                ამ დღისთვის აქტივობები არ არის ჩანიშნული
              </div>
            ) : (
              selectedDayEvents.map(event => (
                <div 
                  key={event.id}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid var(--color-iron-border)",
                    borderLeft: "3.5px solid var(--color-emerald-core)",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)"
                  }}
                >
                  <div style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "var(--color-bone-light)"
                  }}>
                    {event.event_title || event.eventTitle}
                  </div>
                  {event.event_description && (
                    <div style={{
                      fontSize: "13px",
                      color: "var(--color-silver-structure)",
                      whiteSpace: "pre-wrap",
                      lineHeight: "1.4"
                    }}>
                      {event.event_description}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSaveEvent} style={{
            borderTop: "1px solid var(--color-iron-border)",
            paddingTop: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "14px"
          }}>
            <div>
              <label style={{
                display: "block",
                fontSize: "12px",
                fontWeight: "600",
                color: "var(--color-silver-structure)",
                marginBottom: "6px"
              }}>
                📝 დასახელება *
              </label>
              <input
                type="text"
                value={eventTitle}
                onChange={e => setEventTitle(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                  border: "1px solid var(--color-iron-border)",
                  borderRadius: "8px",
                  color: "var(--color-bone-light)",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease"
                }}
                placeholder="მაგ: უშბის ექსპედიცია"
                required
                onFocus={e => {
                  e.currentTarget.style.borderColor = "var(--color-emerald-core)";
                  e.currentTarget.style.boxShadow = "0 0 8px rgba(0, 230, 118, 0.2)";
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = "var(--color-iron-border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            <div>
              <label style={{
                display: "block",
                fontSize: "12px",
                fontWeight: "600",
                color: "var(--color-silver-structure)",
                marginBottom: "6px"
              }}>
                📜 კონკრეტული აღწერა
              </label>
              <textarea
                value={eventDescription}
                onChange={e => setEventDescription(e.target.value)}
                style={{
                  width: "100%",
                  height: "80px",
                  padding: "10px 12px",
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                  border: "1px solid var(--color-iron-border)",
                  borderRadius: "8px",
                  color: "var(--color-bone-light)",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                  resize: "vertical",
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease"
                }}
                placeholder="მაგ: გუნდის შეკრება და აღჭურვილობის შემოწმება"
                onFocus={e => {
                  e.currentTarget.style.borderColor = "var(--color-emerald-core)";
                  e.currentTarget.style.boxShadow = "0 0 8px rgba(0, 230, 118, 0.2)";
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = "var(--color-iron-border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                backgroundColor: "var(--color-emerald-core)",
                border: "none",
                color: "#121418",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
                alignSelf: "flex-start",
                transition: "all 0.3s ease-in-out",
                boxShadow: "0 0 10px rgba(0, 230, 118, 0.25)",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = "0 0 15px rgba(0, 230, 118, 0.45)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = "0 0 10px rgba(0, 230, 118, 0.25)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <i className="fa-solid fa-floppy-disk"></i>
              {isSaving ? "ინახება..." : "ჩანიშვნის დამატება"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CalendarDashboard;

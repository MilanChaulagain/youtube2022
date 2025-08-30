import React, { useEffect, useState } from "react";
import bs from "bikram-sambat-js";
import "./calender.css";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

const monthsNepali = [
    "बैशाख", "जेठ", "असार", "साउन", "भदौ", "आश्विन",
    "कार्तिक", "मंसिर", "पौष", "माघ", "फागुन", "चैत्र"
];

const monthsEnglish = [
    "Baishakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
    "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
];

const daysNep = ["आइत", "सोम", "मंगल", "बुध", "बिहि", "शुक्र", "शनि"];
const daysEng = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const API_BASE = "http://localhost:8800/api";

export default function BilingualNepaliCalendar() {
    const [year, setYear] = useState(2082);
    const [monthIndex, setMonthIndex] = useState(2); // 2 = Ashadh (असार)
    const [todayDate, setTodayDate] = useState(8); // 8th day
    const [events, setEvents] = useState([]);
    const [monthData, setMonthData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startDayOfWeek, setStartDayOfWeek] = useState(0);

    const updateCurrentDate = () => {
        try {
            // For production: uncomment this block
            /*
            const now = new Date();
            const nepDate = bs.toBik(now);
            setYear(nepDate.year);
            setMonthIndex(nepDate.month - 1);
            setTodayDate(nepDate.day);
            */

            // For demo/testing: hardcoded today as 2082/03/08
            setYear(2082);
            setMonthIndex(2); // Ashadh
            setTodayDate(8);
        } catch (error) {
            console.error("Error converting date:", error);
            setYear(2082);
            setMonthIndex(2);
            setTodayDate(8);
        }
    };

    useEffect(() => {
        updateCurrentDate();

        const minuteInterval = setInterval(updateCurrentDate, 60000);

        const setupMidnightUpdate = () => {
            const now = new Date();
            const nextMidnight = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 1,
                0, 0, 0, 0
            );
            const msToMidnight = nextMidnight - now;

            return setTimeout(() => {
                updateCurrentDate();
                setupMidnightUpdate();
            }, msToMidnight);
        };

        const midnightTimeout = setupMidnightUpdate();

        return () => {
            clearInterval(minuteInterval);
            clearTimeout(midnightTimeout);
        };
    }, []);

    useEffect(() => {
        const fetchMonthData = async () => {
            setLoading(true);
            try {
                const englishMonth = monthsEnglish[monthIndex];
                const [monthRes, eventsRes] = await Promise.all([
                    fetch(`${API_BASE}/month/${englishMonth}`),
                    fetch(`${API_BASE}/month/${englishMonth}/events`)
                ]);

                const monthData = await monthRes.json();
                const eventsData = await eventsRes.json();

                setMonthData(monthData);
                setEvents(eventsData.map(event => ({
                    ...event,
                    date: parseInt(event.np)
                })));

                if (monthData.length > 0) {
                    const firstDay = monthData[0].day.toLowerCase();
                    const dayMap = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
                    setStartDayOfWeek(dayMap[firstDay] || 0);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMonthData();
    }, [monthIndex, year]);

    const prevMonth = () => {
        setMonthIndex(prev => {
            if (prev === 0) {
                setYear(y => y - 1);
                return 11;
            }
            return prev - 1;
        });
    };

    const nextMonth = () => {
        setMonthIndex(prev => {
            if (prev === 11) {
                setYear(y => y + 1);
                return 0;
            }
            return prev + 1;
        });
    };

    const generateCalendarGrid = () => {
        const calendarDays = [];
        const currentMonthDays = monthData.length;

        for (let i = 0; i < startDayOfWeek; i++) {
            calendarDays.push({
                date: null,
                isCurrentMonth: false,
                isPrevMonth: true,
            });
        }

        for (let i = 0; i < currentMonthDays; i++) {
            const day = monthData[i];
            calendarDays.push({
                ...day,
                date: parseInt(day.np),
                isCurrentMonth: true,
                holiday: day.holiday
            });
        }

        const totalCells = Math.ceil(calendarDays.length / 7) * 7;
        const remainingCells = totalCells - calendarDays.length;
        for (let i = 0; i < remainingCells; i++) {
            calendarDays.push({
                date: null,
                isCurrentMonth: false,
                isNextMonth: true,
            });
        }

        return calendarDays;
    };

    const renderCalendarGrid = () => {
        const calendarDays = generateCalendarGrid();
        const rows = [];

        for (let i = 0; i < calendarDays.length; i += 7) {
            rows.push(calendarDays.slice(i, i + 7));
        }

        return (
            <tbody>
                {rows.map((week, wi) => (
                    <tr key={wi}>
                        {week.map((day, di) => (
                            <td
                                key={di}
                                className={`calendar-cell ${day.isCurrentMonth ? "current-month" : "other-month"} 
                                ${day.holiday ? "full-holiday" : ""}
                                ${day.day === "sat" ? "saturday" : ""}
                                ${day.date === todayDate && day.isCurrentMonth ? "full-today" : ""}`}
                            >
                                {day.date && <div className="date-number">{day.date}</div>}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        );
    };

    const parseEvent = (eventStr) => {
        if (eventStr.includes("(") && eventStr.includes(")")) {
            const parts = eventStr.split("(");
            const nepali = parts[0].trim();
            const english = parts[1].replace(")", "").trim();
            return { nepali, english };
        }
        return { nepali: eventStr, english: eventStr };
    };

    if (loading) {
        return (
            <div className="calendar-container">
                <div className="loading-message">Loading calendar...</div>
            </div>
        );
    }

    const currentMonthEvents = events.filter(e => e.date);
    const totalDays = monthData.length;

    return (
        <>
            <Navbar />
            <Header />
            <div className="calendar-container">
                <div className="calendar-header">
                    <button className="nav-button" onClick={prevMonth}>⟨</button>
                    <div className="header-info">
                        <h2 className="main-title">{year} / {monthsEnglish[monthIndex]}</h2>
                        <div className="sub-title">
                            {monthsNepali[monthIndex]} {todayDate}, {daysNep[new Date().getDay()]}
                        </div>
                    </div>
                    <button className="nav-button" onClick={nextMonth}>⟩</button>
                </div>

                <table className="calendar-table">
                    <thead>
                        <tr>
                            {daysNep.map((d, i) => (
                                <th key={i} className={`day-header ${i === 6 ? "saturday-header" : ""}`}>
                                    <div className="day-nepali">{d}</div>
                                    <div className="day-english">{daysEng[i]}</div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    {renderCalendarGrid()}
                </table>

                <div className="events-section">
                    <h3 className="events-title">📋 Events for {monthsEnglish[monthIndex]} {year}</h3>
                    {currentMonthEvents.length === 0 ? (
                        <div className="no-events">No events scheduled for this month.</div>
                    ) : (
                        <div className="events-grid">
                            {currentMonthEvents
                                .sort((a, b) => a.date - b.date)
                                .map((event, i) => {
                                    const { nepali: eventNepali, english: eventEnglish } = parseEvent(event.event);
                                    return (
                                        <div key={i} className="event-card">
                                            <div className="event-date-badge">{event.date}</div>
                                            <div className="event-details">
                                                <div className="event-title-nepali">{eventNepali}</div>
                                                <div className="event-title-english">{eventEnglish}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </div>

                <div className="legend">
                    <div className="legend-item">
                        <span className="legend-dot saturday-dot">●</span> Saturday
                    </div>
                    <div className="legend-item">
                        <span className="legend-dot today-dot">●</span> Today
                    </div>
                    <div className="legend-item">
                        <span className="legend-dot holiday-dot">●</span> Public Holiday
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

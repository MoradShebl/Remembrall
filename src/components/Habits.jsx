import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faCheck,
  faEdit,
  faSave,
  faTimes,
  faCalendarAlt,
  faChartLine,
  faFire,
  faTrophy,
  faCalendarCheck,
  faList,
  faPrayingHands,
} from "@fortawesome/free-solid-svg-icons";

const Habits = ({ darkMode }) => {
  // State for habits and habit stats
  const [habits, setHabits] = useState([]);
  const [habitStats, setHabitStats] = useState({});

  const [showAddHabit, setShowAddHabit] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [analyzeHabit, setAnalyzeHabit] = useState(null);

  // New habit form state
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitFrequency, setNewHabitFrequency] = useState("daily");
  const [newHabitGoal, setNewHabitGoal] = useState(1);
  const [newHabitColor, setNewHabitColor] = useState("#4CAF50");
  const [newHabitIcon, setNewHabitIcon] = useState("faCheck");
  const [newHabitReminder, setNewHabitReminder] = useState("");
  const [newHabitNotes, setNewHabitNotes] = useState("");
  const [selectedDays, setSelectedDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true,
  });
  const [showTemplates, setShowTemplates] = useState(false);

  // Edit mode state
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Calendar view state
  const [calendarView, setCalendarView] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return { month: now.getMonth(), year: now.getFullYear() };
  });

  // Handler to go to previous month
  const goToPrevMonth = () => {
    setCalendarMonth((prev) => {
      let month = prev.month - 1;
      let year = prev.year;
      if (month < 0) {
        month = 11;
        year -= 1;
      }
      return { month, year };
    });
  };

  // Handler to go to next month
  const goToNextMonth = () => {
    setCalendarMonth((prev) => {
      let month = prev.month + 1;
      let year = prev.year;
      if (month > 11) {
        month = 0;
        year += 1;
      }
      return { month, year };
    });
  };

  // Helper to get the first day and days in the selected month
  const getMonthInfo = () => {
    const { month, year } = calendarMonth;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth, month, year };
  };

  // No duplicate code needed - we already have localStorage save functionality below

  // Load habits from localStorage on component mount
  useEffect(() => {
    const savedHabits = localStorage.getItem("habits");
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }

    // Load habit stats
    const savedStats = localStorage.getItem("habitStats");
    if (savedStats) {
      setHabitStats(JSON.parse(savedStats));
    } else {
      // Initialize empty stats object
      setHabitStats({});
    }
  }, []);

  // Save habits to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  // Save habit stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("habitStats", JSON.stringify(habitStats));
  }, [habitStats]);

  // Update current date every minute to keep the calendar in sync
  useEffect(() => {
    const updateCurrentDate = () => {
      const now = new Date();
      const current = new Date(currentDate);

      // Only update if the day has changed
      if (
        now.getDate() !== current.getDate() ||
        now.getMonth() !== current.getMonth() ||
        now.getFullYear() !== current.getFullYear()
      ) {
        setCurrentDate(new Date(now));
      }
    };

    // Update immediately
    updateCurrentDate();

    // Then update every minute to catch day changes
    const intervalId = setInterval(updateCurrentDate, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [currentDate]);

  // Generate a unique ID for new habits
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Pre-made habit templates
  const habitTemplates = [
    {
      name: "Gym Workout",
      frequency: "custom",
      goal: 1,
      color: "#FF5722",
      icon: "faFire",
      notes: "Complete a gym session with cardio and strength training.",
      days: {
        monday: true,
        wednesday: true,
        friday: true,
        tuesday: false,
        thursday: false,
        saturday: false,
        sunday: false,
      },
    },
    {
      name: "Drink Water",
      frequency: "daily",
      goal: 8,
      color: "#2196F3",
      icon: "faCheck",
      notes: "Drink 8 glasses of water throughout the day.",
    },
    {
      name: "Read Book",
      frequency: "daily",
      goal: 1,
      color: "#9C27B0",
      icon: "faCalendarCheck",
      notes: "Read for at least 30 minutes.",
    },
    {
      name: "Meditation",
      frequency: "daily",
      goal: 1,
      color: "#4CAF50",
      icon: "faCalendarAlt",
      notes: "Meditate for 10 minutes in the morning.",
    },
    {
      name: "Weekend Jog",
      frequency: "custom",
      goal: 1,
      color: "#FF9800",
      icon: "faChartLine",
      notes: "Go for a 30-minute jog.",
      days: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: true,
        sunday: true,
      },
    },
    {
      name: "Praying",
      frequency: "custom",
      goal: 5,
      color: "#6d4aff",
      icon: "faPrayingHands",
      reminder: "",
      notes: "Daily prayers (Fajr, Dhuhr, Asr, Maghrib, Isha)",
      days: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: true,
      },
    },
  ];

  // Apply a template to the form
  const applyTemplate = (template) => {
    setNewHabitName(template.name);
    setNewHabitFrequency(template.frequency);
    setNewHabitGoal(template.goal);
    setNewHabitColor(template.color);
    setNewHabitIcon(template.icon);
    setNewHabitNotes(template.notes || "");

    // Set selected days if the template has them
    if (template.days) {
      setSelectedDays(template.days);
    } else {
      // Default to all days selected if template doesn't specify
      setSelectedDays({
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: true,
      });
    }

    setShowTemplates(false);
  };

  // Add a new habit
  const addHabit = () => {
    if (!newHabitName.trim()) {
      alert("Please enter a habit name");
      return;
    }

    const newHabit = {
      id: generateId(),
      name: newHabitName,
      frequency: newHabitFrequency,
      goal: newHabitGoal,
      color: newHabitColor,
      icon: newHabitIcon,
      reminder: newHabitReminder,
      notes: newHabitNotes,
      selectedDays: { ...selectedDays },
      createdAt: new Date().toISOString(),
      streak: 0,
      bestStreak: 0,
    };

    setHabits([...habits, newHabit]);
    resetForm();
    setShowAddHabit(false);

    // Initialize stats for this habit
    setHabitStats((prev) => ({
      ...prev,
      [newHabit.id]: {
        completions: {},
        totalCompletions: 0,
        currentStreak: 0,
        bestStreak: 0,
        lastCompleted: null,
      },
    }));
  };

  // Reset the form fields
  const resetForm = () => {
    setNewHabitName("");
    setNewHabitFrequency("daily");
    setNewHabitGoal(1);
    setNewHabitColor("#4CAF50");
    setNewHabitIcon("faCheck");
    setNewHabitReminder("");
    setNewHabitNotes("");
    setSelectedDays({
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    });
  };

  // Delete a habit
  const deleteHabit = (id) => {
    if (window.confirm("Are you sure you want to delete this habit?")) {
      setHabits(habits.filter((habit) => habit.id !== id));

      // Remove stats for this habit
      const newStats = { ...habitStats };
      delete newStats[id];
      setHabitStats(newStats);
    }
  };

  // Edit a habit
  const startEditHabit = (habit) => {
    setEditMode(true);
    setEditId(habit.id);
    setNewHabitName(habit.name);
    setNewHabitFrequency(habit.frequency);
    setNewHabitGoal(habit.goal);
    setNewHabitColor(habit.color);
    setNewHabitIcon(habit.icon);
    setNewHabitReminder(habit.reminder || "");
    setNewHabitNotes(habit.notes || "");
    setShowAddHabit(true);
  };

  // Save edited habit
  const saveEditedHabit = () => {
    if (!newHabitName.trim()) {
      alert("Please enter a habit name");
      return;
    }

    const updatedHabits = habits.map((habit) => {
      if (habit.id === editId) {
        return {
          ...habit,
          name: newHabitName,
          frequency: newHabitFrequency,
          goal: newHabitGoal,
          color: newHabitColor,
          icon: newHabitIcon,
          reminder: newHabitReminder,
          notes: newHabitNotes,
        };
      }
      return habit;
    });

    setHabits(updatedHabits);
    setEditMode(false);
    setEditId(null);
    resetForm();
    setShowAddHabit(false);
  };

  // Check if a habit should be active on a given day
  const isHabitActiveOnDay = (habit, date) => {
    if (habit.frequency === "daily") return true;
    if (habit.frequency === "weekly" && date.getDay() === 1) return true; // Monday
    if (habit.frequency === "monthly" && date.getDate() === 1) return true; // First day of month

    if (habit.frequency === "custom" && habit.selectedDays) {
      const dayMap = {
        0: "sunday",
        1: "monday",
        2: "tuesday",
        3: "wednesday",
        4: "thursday",
        5: "friday",
        6: "saturday",
      };
      const dayName = dayMap[date.getDay()];
      return habit.selectedDays[dayName];
    }

    return true; // Default to active if no specific rule
  };

  // Mark a habit as completed for today
  const completeHabit = (habitId) => {
    // Get current date and time
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const todayStr = now.toISOString().split("T")[0];

    // Find the habit
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    // Update state using functional updates to ensure we have the latest state
    setHabitStats((prevStats) => {
      const habitStat = prevStats[habitId] || {
        completions: {},
        totalCompletions: 0,
        currentStreak: 0,
        bestStreak: 0,
        lastCompleted: null,
      };

      // Check if habit is already completed for today
      const todayCount = habitStat.completions[todayStr] || 0;
      if (todayCount >= habit.goal) {
        alert(`You've already completed this habit for today!`);
        return prevStats; // Return previous state if already completed
      }

      // Update completions for today
      const newCompletions = {
        ...habitStat.completions,
        [todayStr]: todayCount + 1,
      };

      // Calculate streak
      let { currentStreak, bestStreak } = habitStat;

      // If we're meeting the goal with this completion
      if (todayCount + 1 >= habit.goal) {
        // Check if we completed it yesterday to continue the streak
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];
        const yesterdayCompleted =
          habitStat.completions[yesterdayStr] >= habit.goal;

        if (yesterdayCompleted || currentStreak === 0) {
          // Continue or start a new streak
          currentStreak = (currentStreak > 0 ? currentStreak : 0) + 1;
          bestStreak = Math.max(currentStreak, bestStreak);
        } else {
          // Check if we missed any days in the streak
          let lastCompleted = habitStat.lastCompleted
            ? new Date(habitStat.lastCompleted)
            : null;
          if (lastCompleted) {
            lastCompleted.setHours(0, 0, 0, 0);
            const daysSinceLastCompletion = Math.floor(
              (now - lastCompleted) / (1000 * 60 * 60 * 24)
            );

            if (daysSinceLastCompletion === 1) {
              // Only one day missed, continue the streak
              currentStreak++;
              bestStreak = Math.max(currentStreak, bestStreak);
            } else if (daysSinceLastCompletion > 1) {
              // More than one day missed, reset streak
              currentStreak = 1;
              bestStreak = Math.max(1, bestStreak);
            }
          } else {
            // First time completing this habit
            currentStreak = 1;
            bestStreak = Math.max(1, bestStreak);
          }
        }
      }

      // Update the habit's streak in the habits array
      setHabits((prevHabits) =>
        prevHabits.map((h) =>
          h.id === habitId
            ? {
                ...h,
                streak: currentStreak,
                bestStreak,
                lastCompleted: todayStr,
              }
            : h
        )
      );

      // Return updated stats
      return {
        ...prevStats,
        [habitId]: {
          completions: newCompletions,
          totalCompletions: habitStat.totalCompletions + 1,
          currentStreak,
          bestStreak,
          lastCompleted: todayStr,
        },
      };
    });

    // Force a re-render of the calendar if it's open
    if (calendarView) {
      setCurrentDate(new Date(now));
    }
  };

  // Mark a habit as completed for a specific date
  const completeHabitOnDate = (habitId, date) => {
    // Get the date string in YYYY-MM-DD format for today
    const dateStr = new Date(date).toISOString().split("T")[0];

    // Update habit stats for the correct date
    setHabitStats((prevStats) => {
      const habitStat = prevStats[habitId] || {
        completions: {},
        totalCompletions: 0,
      };
      const newCompletions = { ...habitStat.completions };

      // Toggle completion for the exact date selected
      if (newCompletions[dateStr]) {
        delete newCompletions[dateStr];
      } else {
        newCompletions[dateStr] = 1;
      }

      return {
        ...prevStats,
        [habitId]: {
          ...habitStat,
          completions: newCompletions,
          totalCompletions: Object.keys(newCompletions).length,
        },
      };
    });
  };

  // Get the appropriate icon for a habit
  const getHabitIcon = (iconName) => {
    switch (iconName) {
      case "faCheck":
        return faCheck;
      case "faCalendarAlt":
        return faCalendarAlt;
      case "faChartLine":
        return faChartLine;
      case "faFire":
        return faFire;
      case "faTrophy":
        return faTrophy;
      case "faCalendarCheck":
        return faCalendarCheck;
      case "faPrayingHands":
        return faPrayingHands;
      default:
        return faCheck;
    }
  };

  // Calculate completion percentage for a habit
  const getCompletionPercentage = (habit) => {
    const stats = habitStats[habit.id];
    if (!stats) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split("T")[0];
    const completedToday = stats.completions[todayStr] || 0;

    return Math.min(100, Math.round((completedToday / habit.goal) * 100));
  };

  // Get today's completion count for a habit
  const getTodaysCompletion = (habitId) => {
    const stats = habitStats[habitId];
    if (!stats) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split("T")[0];

    // Ensure we have the latest completion count
    return stats.completions ? stats.completions[todayStr] || 0 : 0;
  };

  // Get habits for the selected date in calendar view
  const getHabitsForSelectedDate = () => {
    const dateStr = selectedDate.toISOString().split("T")[0];

    return habits.map((habit) => {
      const completed = habitStats[habit.id]?.completions[dateStr] || 0;
      const isCompleted = completed >= habit.goal;

      return {
        ...habit,
        completed,
        isCompleted,
      };
    });
  };

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const { firstDay, daysInMonth, month, year } = getMonthInfo();
    const now = new Date();
    const isCurrentMonth =
      now.getFullYear() === year && now.getMonth() === month;

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      if (isCurrentMonth && i === now.getDate()) {
        dayDate._timestamp = now.getTime();
      }
      days.push(dayDate);
    }

    return days;
  };

  // Check if a date has any completed habits
  const hasCompletedHabitsOnDate = (date) => {
    if (!date) return false;

    const dateStr = date.toISOString().split("T")[0];

    return habits.some((habit) => {
      const completed = habitStats[habit.id]?.completions[dateStr] || 0;
      return completed >= habit.goal;
    });
  };

  // View detailed stats for a habit
  const viewHabitStats = (habit) => {
    setSelectedHabit(habit);
    setShowStats(true);
  };

  // Get the last 7 days of habit data
  const getWeeklyData = (habitId) => {
    const stats = habitStats[habitId] || {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Array of day short names, starting from Sunday
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Build last 7 days, ending with today
    return Array.from({ length: 7 }).map((_, idx) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - idx)); // 6-idx: so today is last, 6 days ago is first
      const dateStr = date.toISOString().split("T")[0];
      const completed = stats.completions?.[dateStr] || 0;
      const goal = stats.goal || 1;
      return {
        day: dayNames[date.getDay()],
        completed,
        goal,
        achieved: completed >= goal,
      };
    });
  };

  const { firstDay, daysInMonth, month, year } = getMonthInfo();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="habits-container" data-theme={darkMode ? "dark" : "light"}>
      <div className="habits-header">
        <h2>Habit Tracker</h2>
        <div className="habits-actions">
          <button
            className={`view-toggle ${!calendarView ? "active" : ""}`}
            onClick={() => setCalendarView(false)}
          >
            <FontAwesomeIcon icon={faFire} /> List
          </button>
          <button
            className={`view-toggle ${calendarView ? "active" : ""}`}
            onClick={() => setCalendarView(true)}
          >
            <FontAwesomeIcon icon={faCalendarAlt} /> Calendar
          </button>
        </div>
      </div>

      {!calendarView ? (
        // List view
        <div className="habits-list">
          {habits.length === 0 ? (
            <div className="empty-habits">
              <FontAwesomeIcon icon={faFire} className="empty-icon" />
              <p>No habits yet! Add your first habit to start tracking.</p>
            </div>
          ) : (
            habits.map((habit) => {
              const completionPercentage = getCompletionPercentage(habit);
              const stats = habitStats[habit.id] || {
                currentStreak: 0,
                bestStreak: 0,
              };
              const todayCount = getTodaysCompletion(habit.id);

              return (
                <div
                  key={habit.id}
                  className="habit-item"
                  style={{ borderLeft: `4px solid ${habit.color}` }}
                >
                  <div
                    className="habit-info"
                    onClick={() => viewHabitStats(habit)}
                  >
                    <div
                      className="habit-icon"
                      style={{ backgroundColor: habit.color }}
                    >
                      <FontAwesomeIcon icon={getHabitIcon(habit.icon)} />
                    </div>
                    <div className="habit-details">
                      <div className="habit-header">
                        <h3>{habit.name}</h3>
                        <div
                          className="habit-streak"
                          title={`Current streak: ${stats.currentStreak} days`}
                        >
                          <FontAwesomeIcon
                            icon={faFire}
                            className={
                              stats.currentStreak > 0 ? "active-streak" : ""
                            }
                          />
                          <span>{stats.currentStreak}</span>
                          {stats.bestStreak > 0 &&
                            stats.bestStreak !== stats.currentStreak && (
                              <span
                                className="best-streak"
                                title={`Best streak: ${stats.bestStreak} days`}
                              >
                                <FontAwesomeIcon icon={faTrophy} />{" "}
                                {stats.bestStreak}
                              </span>
                            )}
                        </div>
                      </div>
                      <div className="habit-meta">
                        <span className={`habit-frequency ${habit.frequency}`}>
                          {habit.frequency}
                        </span>
                        <span className="habit-goal">
                          {todayCount >= habit.goal ? (
                            <span className="completed-text">
                              Completed today!
                            </span>
                          ) : (
                            <span>{habit.goal - todayCount} more to go</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="habit-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${completionPercentage}%`,
                          backgroundColor: habit.color,
                        }}
                      ></div>
                    </div>
                    <div className="progress-text">
                      {todayCount + " "}/ {habit.goal}
                    </div>
                  </div>

                  <div className="habit-actions">
                    <button
                      className={`habit-complete ${
                        todayCount >= habit.goal ? "completed" : ""
                      }`}
                      onClick={() => completeHabit(habit.id)}
                      style={{
                        backgroundColor:
                          todayCount >= habit.goal ? "#4CAF50" : habit.color,
                        opacity: todayCount >= habit.goal ? 0.7 : 1,
                      }}
                      disabled={todayCount >= habit.goal}
                      title={
                        todayCount >= habit.goal
                          ? "Already completed for today"
                          : "Mark as completed"
                      }
                    >
                      <FontAwesomeIcon icon={faCheck} />
                      {todayCount >= habit.goal && (
                        <span className="completed-check">✓</span>
                      )}
                    </button>
                    <button
                      className="habit-edit"
                      onClick={() => startEditHabit(habit)}
                      title="Edit habit"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="habit-delete"
                      onClick={() => deleteHabit(habit.id)}
                      title="Delete habit"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              );
            })
          )}

          <button
            className="add-habit-button"
            onClick={() => setShowAddHabit(true)}
          >
            <FontAwesomeIcon icon={faPlus} /> Add New Habit
          </button>
        </div>
      ) : (
        // Calendar view
        <div className="calendar-view">
          <div className="calendar-header">
            <button onClick={goToPrevMonth} aria-label="Previous month">
              &lt;
            </button>
            <h3>
              {monthNames[month]} {year}
            </h3>
            <button onClick={goToNextMonth} aria-label="Next month">
              &gt;
            </button>
          </div>

          <div className="day-names">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="days-grid">
            {/* Empty cells for days before the 1st */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div className="day-cell empty-cell" key={`empty-${i}`} />
            ))}
            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dateObj = new Date(year, month, i + 1);
              return (
                <div
                  key={i + 1}
                  className={`day-cell ${
                    dateObj &&
                    dateObj.toDateString() === selectedDate.toDateString()
                      ? "selected-day"
                      : ""
                  } ${
                    dateObj &&
                    dateObj.toDateString() === new Date().toDateString()
                      ? "today"
                      : ""
                  } ${
                    hasCompletedHabitsOnDate(dateObj) ? "completed-day" : ""
                  }`}
                  onClick={() => setSelectedDate(dateObj)}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>

          <div className="selected-date-habits">
            <h4>
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </h4>

            {getHabitsForSelectedDate().map((habit) => (
              <div
                key={habit.id}
                className={`calendar-habit-item ${
                  habit.isCompleted ? "completed" : ""
                }`}
                style={{ borderLeft: `4px solid ${habit.color}` }}
              >
                <div className="habit-info">
                  <div
                    className="habit-icon"
                    style={{ backgroundColor: habit.color }}
                  >
                    <FontAwesomeIcon icon={getHabitIcon(habit.icon)} />
                  </div>
                  <div className="habit-name">{habit.name}</div>
                </div>
                <div className="habit-completion">
                  {habit.completed} / {habit.goal}
                </div>
              </div>
            ))}
          </div>
          {/* Analyze Section */}
          <div className="calendar-analyze-section">
            <h4>Analyze</h4>
            {habits.length === 0 ? (
              <div style={{ color: "#888" }}>No habits to analyze.</div>
            ) : (
              habits.map((habit) => (
                <div key={habit.id} className="analyze-habit-block">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 6,
                    }}
                  >
                    <span
                      className="habit-icon"
                      style={{
                        background: habit.color,
                        width: 28,
                        height: 28,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        color: "#fff",
                        fontSize: "1rem",
                      }}
                    >
                      <FontAwesomeIcon icon={getHabitIcon(habit.icon)} />
                    </span>
                    <span style={{ fontWeight: 600 }}>{habit.name}</span>
                  </div>
                  <div className="analyze-heatmap">
                    <div className="heatmap-row">
                      <div className="heatmap-label"></div>
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                        <div key={d} className="heatmap-day-label">
                          {d}
                        </div>
                      ))}
                    </div>
                    {/* Build heatmap grid for the month */}
                    {(() => {
                      const { daysInMonth, month, year } = getMonthInfo();
                      const grid = [];
                      let day = 1;
                      for (let week = 0; week < 6; week++) {
                        const row = [];
                        for (let dow = 0; dow < 7; dow++) {
                          const date = new Date(year, month, day);
                          if (
                            (week === 0 && dow < new Date(year, month, 1).getDay()) ||
                            day > daysInMonth
                          ) {
                            row.push(<div key={dow} className="heatmap-cell empty"></div>);
                          } else {
                            const dateStr = date.toISOString().split("T")[0];
                            const completed =
                              habitStats[habit.id]?.completions[dateStr] || 0;
                            row.push(
                              <div
                                key={dow}
                                className={`heatmap-cell ${
                                  completed >= habit.goal ? "filled" : ""
                                }`}
                                title={`${dateStr}: ${completed}/${habit.goal}`}
                              >
                                {completed > 0 ? completed : ""}
                              </div>
                            );
                            day++;
                          }
                        }
                        grid.push(
                          <div key={week} className="heatmap-row">
                            <div className="heatmap-label"></div>
                            {row}
                          </div>
                        );
                      }
                      return grid;
                    })()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Habit Modal */}
      {showAddHabit && (
        <div className="habit-modal-overlay">
          <div className="habit-modal">
            <div className="habit-modal-header">
              <h3>{editMode ? "Edit Habit" : "Add New Habit"}</h3>
              <button
                className="close-modal"
                onClick={() => {
                  setShowAddHabit(false);
                  setEditMode(false);
                  resetForm();
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="habit-form">
              {/* Template Selection Button */}
              {!editMode && (
                <button
                  className="template-button"
                  onClick={() => setShowTemplates(!showTemplates)}
                >
                  <FontAwesomeIcon icon={faList} />{" "}
                  {showTemplates ? "Hide Templates" : "Choose from Templates"}
                </button>
              )}

              {/* Template List */}
              {showTemplates && (
                <div className="template-list">
                  {habitTemplates.map((template, index) => (
                    <div
                      key={index}
                      className="template-item"
                      onClick={() => applyTemplate(template)}
                      style={{ borderLeft: `4px solid ${template.color}` }}
                    >
                      <div
                        className="template-icon"
                        style={{ backgroundColor: template.color }}
                      >
                        <FontAwesomeIcon icon={getHabitIcon(template.icon)} />
                      </div>
                      <div className="template-details">
                        <h4>{template.name}</h4>
                        <p>{template.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="form-group">
                <label>Habit Name</label>
                <input
                  type="text"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="e.g., Drink water, Exercise, Read"
                />
              </div>

              <div className="form-group">
                <label>Frequency</label>
                <select
                  value={newHabitFrequency}
                  onChange={(e) => setNewHabitFrequency(e.target.value)}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="custom">Custom Days</option>
                </select>
              </div>

              <div className="form-group">
                <label>Daily Goal (times per day)</label>
                <input
                  type="number"
                  min="1"
                  value={newHabitGoal}
                  onChange={(e) =>
                    setNewHabitGoal(parseInt(e.target.value) || 1)
                  }
                />
              </div>

              {/* Day Selection - Only show when frequency is custom */}
              {newHabitFrequency === "custom" && (
                <div className="form-group day-selection">
                  <label>Select Days</label>
                  <div className="days-container">
                    {Object.entries({
                      monday: "Mon",
                      tuesday: "Tue",
                      wednesday: "Wed",
                      thursday: "Thu",
                      friday: "Fri",
                      saturday: "Sat",
                      sunday: "Sun",
                    }).map(([day, label]) => (
                      <div
                        key={day}
                        className={`day-item ${
                          selectedDays[day] ? "selected" : ""
                        }`}
                        onClick={() =>
                          setSelectedDays({
                            ...selectedDays,
                            [day]: !selectedDays[day],
                          })
                        }
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Color</label>
                <input
                  type="color"
                  value={newHabitColor}
                  onChange={(e) => setNewHabitColor(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Icon</label>
                <select
                  value={newHabitIcon}
                  onChange={(e) => setNewHabitIcon(e.target.value)}
                >
                  <option value="faCheck">✓ Check</option>
                  <option value="faCalendarAlt">📅 Calendar</option>
                  <option value="faChartLine">📈 Chart</option>
                  <option value="faFire">🔥 Fire</option>
                  <option value="faTrophy">🏆 Trophy</option>
                  <option value="faCalendarCheck">✅ Calendar Check</option>
                </select>
              </div>

              <div className="form-group">
                <label>Reminder (optional)</label>
                <input
                  type="time"
                  value={newHabitReminder}
                  onChange={(e) => setNewHabitReminder(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Notes (optional)</label>
                <textarea
                  value={newHabitNotes}
                  onChange={(e) => setNewHabitNotes(e.target.value)}
                  placeholder="Any additional details about this habit"
                />
              </div>

              <div className="form-actions">
                <button
                  className="cancel-button"
                  onClick={() => {
                    setShowAddHabit(false);
                    setEditMode(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  className="save-button"
                  onClick={editMode ? saveEditedHabit : addHabit}
                >
                  <FontAwesomeIcon icon={faSave} />{" "}
                  {editMode ? "Update Habit" : "Add Habit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Habit Stats Modal */}
      {showStats && selectedHabit && (
        <div className="habit-modal-overlay">
          <div className="habit-modal stats-modal">
            <div className="habit-modal-header">
              <h3>
                <div
                  className="habit-icon"
                  style={{ backgroundColor: selectedHabit.color }}
                >
                  <FontAwesomeIcon icon={getHabitIcon(selectedHabit.icon)} />
                </div>
                {selectedHabit.name} Stats
              </h3>
              <button
                className="close-modal"
                onClick={() => {
                  setShowStats(false);
                  setSelectedHabit(null);
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="habit-stats">
              <div className="stats-summary">
                <div className="stat-box">
                  <div className="stat-value">
                    {habitStats[selectedHabit.id]?.currentStreak || 0}
                  </div>
                  <div className="stat-label">
                    <FontAwesomeIcon
                      icon={faFire}
                      style={{ color: "#ff9800" }}
                    />{" "}
                    Current Streak
                  </div>
                </div>
                <div className="stat-box">
                  <div className="stat-value">
                    {habitStats[selectedHabit.id]?.bestStreak || 0}
                  </div>
                  <div className="stat-label">
                    <FontAwesomeIcon
                      icon={faTrophy}
                      style={{ color: "#ffd700" }}
                    />{" "}
                    Best Streak
                  </div>
                </div>
                <div className="stat-box">
                  <div className="stat-value">
                    {habitStats[selectedHabit.id]?.totalCompletions || 0}
                  </div>
                  <div className="stat-label">
                    <FontAwesomeIcon
                      icon={faCheck}
                      style={{ color: "#4caf50" }}
                    />{" "}
                    Total Completions
                  </div>
                </div>
                <div className="stat-box">
                  <div className="stat-value">
                    {(() => {
                      // Calculate average per day for last 7 days
                      const data = getWeeklyData(selectedHabit.id);
                      if (!data.length) return 0;
                      const sum = data.reduce((acc, d) => acc + d.completed, 0);
                      return (sum / data.length).toFixed(1);
                    })()}
                  </div>
                  <div className="stat-label">
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      style={{ color: "#6d4aff" }}
                    />{" "}
                    Avg/Day (7d)
                  </div>
                </div>
              </div>
              <h4>Last 7 Days</h4> <br />
              <div className="weekly-progress">
                <div className="weekly-chart">
                  {getWeeklyData(selectedHabit.id).map((day, index) => (
                    <div key={index} className="day-progress">
                      <div className="day-label">{day.day}</div>
                      <div
                        className={`day-bar-container ${
                          day.achieved ? "achieved" : ""
                        }`}
                        title={`${day.completed} / ${day.goal}`}
                      >
                        <div
                          className="day-bar"
                          style={{
                            height: `${Math.min(
                              100,
                              (day.completed / day.goal) * 100
                            )}%`,
                            backgroundColor: selectedHabit.color,
                            borderRadius: "6px",
                            transition: "height 0.3s",
                          }}
                        ></div>
                      </div>
                      <div className="day-count">
                        {day.completed}/{day.goal}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {selectedHabit.notes && (
                <div className="habit-notes">
                  <h4>Notes</h4>
                  <p>{selectedHabit.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Habits;

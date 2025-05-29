import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import Recent from "./components/Recent.jsx";
import Habits from "./components/Habits.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faX, faTrash, faPalette } from "@fortawesome/free-solid-svg-icons";
import nameLogo from "./assets/logo.png";
import "./components/Habits.css";
import "./components/AppSectionNav.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isClosingSettings, setIsClosingSettings] = useState(false);
  const [speechLanguage, setSpeechLanguage] = useState("en");
  const [addCataScreen, setAddCataScreen] = useState(false);
  const [showCataScreen, setshowCataScreen] = useState(false);
  const [newCataName, setNewCataName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("faUser");
  const [activeSection, setActiveSection] = useState(() => {
    // Load active section from localStorage or default to 'items'
    const savedSection = localStorage.getItem("activeSection");
    return savedSection || "items";
  });
  const [defaultHabitColor, setDefaultHabitColor] = useState("#4CAF50");
  const [defaultHabitGoal, setDefaultHabitGoal] = useState(1);
  const [showCompletedHabits, setShowCompletedHabits] = useState(true);
  const [customAccent, setCustomAccent] = useState("#4a90e2");
  const [customBackground, setCustomBackground] = useState("#fff");
  const [showCustomTheme, setShowCustomTheme] = useState(false);

  const resetAllData = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all data? This cannot be undone."
      )
    ) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Load categories from localStorage or use defaults
  const defaultCategories = [
    { name: "Personal", icon: "faUser", emoji: "👤" },
    { name: "Work", icon: "faBriefcase", emoji: "💼" },
    { name: "Home", icon: "faHome", emoji: "🏠" },
  ];

  // Available emojis for selection
  const emojiOptions = [
    { value: "faUser", label: "👤 Person" },
    { value: "faBriefcase", label: "💼 Work" },
    { value: "faHome", label: "🏠 Home" },
    { value: "faBook", label: "📚 Book" },
    { value: "faLaptop", label: "💻 Laptop" },
    { value: "faPhone", label: "📱 Phone" },
    { value: "faCar", label: "🚗 Car" },
    { value: "faKey", label: "🔑 Key" },
    { value: "faWallet", label: "👛 Wallet" },
    { value: "faGlasses", label: "👓 Glasses" },
  ];

  const [categories, setCategories] = useState(() => {
    try {
      const savedCategories = localStorage.getItem("categories");
      return savedCategories ? JSON.parse(savedCategories) : defaultCategories;
    } catch (error) {
      console.error("Error loading categories from localStorage:", error);
      return defaultCategories;
    }
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    } else {
      const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("activeSection", activeSection);
  }, [activeSection]);

  useEffect(() => {
    try {
      localStorage.setItem("categories", JSON.stringify(categories));
    } catch (error) {
      console.error("Error saving categories to localStorage:", error);
    }
  }, [categories]);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', customAccent);
    document.documentElement.style.setProperty('--primary-color', customBackground);
  }, [customAccent, customBackground]);

  const toggleTheme = () => {
    setIsTransitioning(true);
    setDarkMode(!darkMode);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const handleCloseSettings = () => {
    // Start the closing animation
    setIsClosingSettings(true);

    // Wait for animation to complete before hiding the settings panel
    setTimeout(() => {
      setShowSettings(false);
      setIsClosingSettings(false);
    }, 300); // Match this with the animation duration in CSS
  };

  const handleAddCategory = () => {
    if (!newCataName.trim()) {
      alert("Please enter a category name");
      return;
    }

    // Check if category already exists
    if (categories.some((cat) => cat.name === newCataName)) {
      alert("This category already exists");
      return;
    }

    // Find the selected emoji
    const selectedOption = emojiOptions.find(
      (option) => option.value === selectedIcon
    );

    // Add new category
    const newCategory = {
      name: newCataName,
      icon: selectedIcon,
      emoji: selectedOption ? selectedOption.label.split(" ")[0] : "👤",
    };

    setCategories([...categories, newCategory]);
    setNewCataName("");
    setAddCataScreen(false);
  };

  const closeAddCategoryScreen = () => {
    setAddCataScreen(false);
    setNewCataName("");
  };

  const handleRemoveCata = (name) => {
    setCategories(categories.filter((cata) => cata.name !== name));
  };

  return (
    <>
      <main>
        <div
          className={`container ${isTransitioning ? "theme-changing" : ""}`}
          data-theme={darkMode ? "dark" : "light"}
        >
          <header>
            <h1>
              <img src={nameLogo} alt="Remembrall" />
            </h1>
            {/* App Section Navigation */}
            <div className="app-section-nav">
              <button
                className={`section-btn ${
                  activeSection === "items" ? "active" : ""
                }`}
                onClick={() => setActiveSection("items")}
              >
                Items & Todos
              </button>
              <button
                className={`section-btn ${
                  activeSection === "habits" ? "active" : ""
                }`}
                onClick={() => setActiveSection("habits")}
              >
                Habit Tracker
              </button>
            </div>
            <div className="settings-container">
              <button
                className="settings-btn"
                onClick={() => setShowSettings(true)}
                aria-label="Open settings"
              >
                <FontAwesomeIcon icon={faGear} />
              </button>
            </div>
          </header>
          {showSettings && (
            <div
              className={`settings ${
                isClosingSettings ? "settings-closing" : ""
              }`}
            >
              <div className="settings-header">
                <h3>Settings</h3>
                <button
                  className="close"
                  onClick={handleCloseSettings}
                  aria-label="Close settings"
                >
                  <FontAwesomeIcon icon={faX} />
                </button>
              </div>
              <div className="settings-content">
                <div className="settings-item">
                  <h3>Theme</h3>
                  <div className="settings-item-content">
                    <button
                      className="toggle-btn"
                      onClick={toggleTheme}
                      aria-label={
                        darkMode
                          ? "Switch to light mode"
                          : "Switch to dark mode"
                      }
                    >
                      {darkMode ? (
                        <Sun className="mode-icon" size={24} />
                      ) : (
                        <Moon className="mode-icon" size={24} />
                      )}
                    </button>
                    <button
                      className="toggle-btn custom-theme-btn"
                      onClick={() => setShowCustomTheme(true)}
                      aria-label="Customize theme colors"
                    >
                      <FontAwesomeIcon icon={faPalette} size={20} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="settings-content">
                <div className="settings-item">
                  <h3>Speech Language</h3>
                  <div className="settings-item-content">
                    <select
                      className="language-select"
                      value={speechLanguage}
                      onChange={(e) => setSpeechLanguage(e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="ar">Arabic</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="settings-content">
                <div className="settings-item">
                  <h3>Default Habit Color</h3>
                  <input
                    type="color"
                    value={defaultHabitColor}
                    onChange={(e) => setDefaultHabitColor(e.target.value)}
                  />
                </div>
              </div>
              <div className="settings-content">
                <div className="settings-item">
                  <h3>Default Habit Goal</h3>
                  <input
                    type="number"
                    min={1}
                    value={defaultHabitGoal}
                    onChange={(e) =>
                      setDefaultHabitGoal(Number(e.target.value))
                    }
                  />
                </div>
              </div>
              <div className="settings-content">
                <div className="settings-item">
                  <h3>Show Completed Habits</h3>
                  <input
                    type="checkbox"
                    checked={showCompletedHabits}
                    onChange={(e) => setShowCompletedHabits(e.target.checked)}
                  />
                </div>
              </div>
              <div className="settings-content">
                <div className="settings-item">
                  <h3>Reset All Data</h3>
                  <button
                    className="add-button"
                    style={{ background: "#dc2626", color: "#fff" }}
                    onClick={resetAllData}
                  >
                    <FontAwesomeIcon icon={faTrash} /> Reset
                  </button>
                </div>
              </div>
              <div className="settings-content">
                <div className="settings-item">
                  <h3>About</h3>
                  <div style={{ fontSize: "0.95em", color: "#888" }}>
                    Remembrall v1.0
                    <br />
                  </div>
                </div>
              </div>
            </div>
          )}
          {showCataScreen && (
            <div className="bg">
              <div className="add-item-screen show-categories">
                <div className="settings-header header">
                  <h3>Your Categories</h3>
                  <button
                    className="close"
                    onClick={() => setshowCataScreen(false)}
                  >
                    <FontAwesomeIcon icon={faX} />
                  </button>
                </div>
                {!categories ? (
                  <div className="empty">
                    <p>No Folks here!</p>
                  </div>
                ) : (
                  categories.map((cata) => (
                    <ul className="cata-wrapper">
                      <li key={cata.name} className="cata-edit">
                        {cata.name}
                        {cata.name === "Personal" ||
                        cata.name === "Work" ||
                        cata.name === "Home" ? (
                          <></>
                        ) : (
                          <button aria-label="Remove item" className="remove">
                            <FontAwesomeIcon
                              aria-hidden="true"
                              icon={faTrash}
                              onClick={() => handleRemoveCata(cata.name)}
                            />
                          </button>
                        )}
                      </li>
                    </ul>
                  ))
                )}
                <button
                  className="add-button add-cata"
                  onClick={() => setAddCataScreen(true)}
                >
                  Add Cata
                </button>
              </div>
            </div>
          )}
          {addCataScreen && (
            <div className="bg">
              <div className="add-item-screen add-cata-screen">
                <div className="header">
                  <h2>Add New Category</h2>
                  <button className="close" onClick={closeAddCategoryScreen}>
                    <FontAwesomeIcon icon={faX} />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Category name"
                  value={newCataName}
                  onChange={(e) => setNewCataName(e.target.value)}
                />
                <select
                  className="catagory-select add-item-select"
                  value={selectedIcon}
                  onChange={(e) => setSelectedIcon(e.target.value)}
                >
                  {emojiOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="add-item-buttons">
                  <button
                    className="add-button add-item-screen-button"
                    onClick={handleAddCategory}
                  >
                    Add Category
                  </button>
                </div>
              </div>
            </div>
          )}
          {showCustomTheme && (
            <div className="bg cutom-theme">
              <div className="custom-theme-screen">
                <div className="header">
                  <h2>Customize Theme</h2>
                  <button 
                    className="close"
                    onClick={() => setShowCustomTheme(false)}
                  >
                    <FontAwesomeIcon icon={faX} />
                  </button>
                </div>

                <div className="theme-preview">
                  <h3>Preview</h3>
                  <div 
                    className="preview-box"
                    style={{
                      background: customBackground,
                      padding: "20px",
                      borderRadius: "12px",
                      marginBottom: "24px"
                    }}
                  >
                    <div style={{ color: customAccent, marginBottom: "12px", fontWeight: "600" }}>
                      Accent Color Text
                    </div>
                    <button
                      className="preview-button"
                      style={{
                        background: customAccent,
                        color: customBackground,
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        cursor: "pointer"
                      }}
                    >
                      Sample Button
                    </button>
                  </div>
                </div>

                <div className="theme-colors">
                  <div className="color-picker-group">
                    <label>Background Color</label>
                    <div className="color-input">
                      <input
                        type="color"
                        value={customBackground}
                        onChange={(e) => setCustomBackground(e.target.value)}
                      />
                      <input
                        type="text"
                        value={customBackground}
                        onChange={(e) => setCustomBackground(e.target.value)}
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>

                  <div className="color-picker-group">
                    <label>Accent Color</label>
                    <div className="color-input">
                      <input
                        type="color"
                        value={customAccent}
                        onChange={(e) => setCustomAccent(e.target.value)}
                      />
                      <input
                        type="text"
                        value={customAccent}
                        onChange={(e) => setCustomAccent(e.target.value)}
                        placeholder="#7a81ff"
                      />
                    </div>
                  </div>

                  <div className="theme-presets">
                    <h3>Presets</h3>
                    <div className="preset-buttons">
                      <button 
                        className="preset-btn"
                        onClick={() => {
                          setCustomBackground("#f8f8f8");
                          setCustomAccent("#7a81ff");
                        }}
                      >
                        Light Theme
                      </button>
                      <button 
                        className="preset-btn"
                        onClick={() => {
                          setCustomBackground("#1a1a1a");
                          setCustomAccent("#646cff");
                        }}
                      >
                        Dark Theme
                      </button>
                      <button 
                        className="preset-btn"
                        onClick={() => {
                          setCustomBackground("#ffffff");
                          setCustomAccent("#4a90e2");
                        }}
                      >
                        Classic
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Keep both components mounted but toggle visibility */}
          <div
            style={{ display: activeSection === "items" ? "block" : "none" }}
          >
            <Recent
              className="recent-items"
              darkMode={darkMode}
              speechLanguage={speechLanguage}
              categories={categories}
            />
          </div>

          <div
            style={{
              display: activeSection === "habits" ? "block" : "none",
              height: "100vh", width: "100%"
            }}
          >
            <Habits darkMode={darkMode} />
          </div>
        </div>
      </main>
    </>
  );
}

export default App;

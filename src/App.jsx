import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import Recent from "./components/Recent.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faX } from "@fortawesome/free-solid-svg-icons";

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
  }, [darkMode]);

  useEffect(() => {
    try {
      localStorage.setItem("categories", JSON.stringify(categories));
    } catch (error) {
      console.error("Error saving categories to localStorage:", error);
    }
  }, [categories]);

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

  return (
    <>
      <main>
        <div
          className={`container ${isTransitioning ? "theme-changing" : ""}`}
          data-theme={darkMode ? "dark" : "light"}
        >
          <header>
            <h1>Remembrall</h1>
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
                <h2>Settings</h2>
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
                      onChange={(e) => {
                        setSpeechLanguage(e.target.value);
                      }}
                    >
                      <option value="en">English</option>
                      <option value="ar">Arabic</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="settings-content">
                <div className="settings-item">
                  <h3>Add Cata</h3>
                  <div className="settings-item-content">
                    <button
                      className="add-cata"
                      onClick={() => setAddCataScreen(true)}
                    >
                      Add Cata
                    </button>
                    <button
                      className="add-cata"
                      onClick={() => setshowCataScreen(true)}
                    >
                      Categories
                    </button>
                  </div>
                </div>
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
          {showCataScreen && (
            <div className="bg">
              <div className="add-item-screen show-categories">
                <div className="header">
                  <h2>Your Categories:</h2>
                  <button className="close" onClick={() => setshowCataScreen(false)}>
                    <FontAwesomeIcon icon={faX} />
                  </button>
                </div>
                {categories.map((cata) => (
                  <ul>
                    <li key={cata.name}>
                      {cata.name}
                    </li>
                  </ul>
                ))}
              </div>
            </div>
          )}
          <Recent
            darkMode={darkMode}
            speechLanguage={speechLanguage}
            categories={categories}
          />
        </div>
      </main>
    </>
  );
}

export default App;

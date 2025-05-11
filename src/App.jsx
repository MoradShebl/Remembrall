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

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

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

  return (
    <>
      <main>
        <div 
          className={`container ${isTransitioning ? 'theme-changing' : ''}`} 
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
            <div className={`settings ${isClosingSettings ? 'settings-closing' : ''}`}>
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
                      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                    >
                      {darkMode ? <Sun className="mode-icon" size={24} /> : <Moon className="mode-icon" size={24} />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="settings-content">
                <div className="settings-item">
                  <h3>Speech Language</h3>
                  <div className="settings-item-content">
                    <select className="language-select" value={speechLanguage} onChange={(e) => {setSpeechLanguage(e.target.value)}}>
                      <option value="en">English</option>
                      <option value="ar">Arabic</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
          <Recent darkMode={darkMode} speechLanguage={speechLanguage}/>
        </div>
      </main>
    </>
  );
}

export default App;

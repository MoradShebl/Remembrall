import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import Recent from "./components/Recent.jsx";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  return (
    <>
      <main>
        <div 
          className={`container ${isTransitioning ? 'theme-changing' : ''}`} 
          data-theme={darkMode ? "dark" : "light"}
        >
          <header>
            <h1>Remembrall</h1>
            <button 
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun className="mode-icon" size={24} /> : <Moon className="mode-icon" size={24} />}
            </button>
          </header>
          <Recent darkMode={darkMode} />
        </div>
      </main>
    </>
  );
}

export default App;

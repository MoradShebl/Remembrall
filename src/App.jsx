import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import Recent from "./components/Recent.jsx";
import { useState, useEffect } from "react";

function App() {
  const [darkMode, setDarkMode] = useState(false);

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
  return (
    <>
      <main>
        <div className="container" data-theme={darkMode ? "dark" : "light"}>
          <header>
            <h1>Remembrall</h1>
            <FontAwesomeIcon className="mode-icon" icon={darkMode ? faMoon : faSun} onClick={() => setDarkMode(!darkMode)} />
          </header>
          <Recent darkMode={darkMode} />
        </div>
      </main>
    </>
  );
}

export default App;

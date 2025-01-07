import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false); // Starea pentru dark mode
  const navigate = useNavigate();

  // Încărcarea setărilor la încărcarea paginii
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    }
  }, []);

  // Schimbarea temei
  const handleThemeChange = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      localStorage.setItem('theme', 'light');
    } else {
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <div className={`SettingsContainer ${darkMode ? 'dark-mode' : ''}`}>
      <form className="SettingsForm">
        <h2>Setări</h2>

      </form>
    </div>
  );
};

export default Settings;

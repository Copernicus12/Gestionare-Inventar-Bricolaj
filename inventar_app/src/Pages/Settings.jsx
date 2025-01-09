import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    }
  }, []);

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

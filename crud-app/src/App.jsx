import React from 'react';
import './App.css';
import AppHeader from './Components/AppHeader';
import AppFooter from './Components/AppFooter';
import SideMenu from './Components/SideMenu';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Pages
import Dashboard from './Pages/Dashboard';
import Inventory from './Pages/Inventory';


function App() {
  return (
    <Router>
      <div className="App">
        <AppHeader />
        <div className="SideMenuAndPageContent">
          <SideMenu />
          <div className="PageContent">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
            </Routes>
          </div>
        </div>
        <AppFooter />
      </div>
    </Router>
  );
}

export default App;

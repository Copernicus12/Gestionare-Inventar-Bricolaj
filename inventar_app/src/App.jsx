import React, { useEffect, useState } from 'react';
import './App.css';
import AppHeader from './Components/AppHeader';
import AppFooter from './Components/AppFooter';
import SideMenu from './Components/SideMenu';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

// Import Pages
import Dashboard from './Pages/Dashboard';
import Inventory from './Pages/Inventory';
import Orders from './Pages/Orders';
import Stock from './Pages/Stock';
import RFID from './Pages/RFID';
import Settings from './Pages/Settings';
import Login from './Pages/Login';

function App() {
  const [items, setItems] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');

  useEffect(() => {
    axios.get('http://localhost:1234/api/items')
      .then(response => {
        setItems(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the items!', error);
      });
  }, []);

  return (
    <Router>
      <div className="App">
        <AppHeader isAuthenticated={isAuthenticated} setAuth={setIsAuthenticated} />
        <div className="SideMenuAndPageContent">
          <SideMenu />
          <div className="PageContent">
            <Routes>
              <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
              {isAuthenticated ? (
                <>
                  <Route path="/" element={<Dashboard items={items} />} />
                  <Route path="/inventory" element={<Inventory items={items} />} />
                  <Route path="/orders" element={<Orders items={items} />} />
                  <Route path="/stock" element={<Stock items={items} />} />
                  <Route path="/rfid" element={<RFID items={items} />} />
                  <Route path="/settings" element={<Settings items={items} />} />
                </>
              ) : (
                <Route path="*" element={<Login setAuth={setIsAuthenticated} />} />
              )}
            </Routes>
          </div>
        </div>
        <AppFooter />
      </div>
    </Router>
  );
}

export default App;

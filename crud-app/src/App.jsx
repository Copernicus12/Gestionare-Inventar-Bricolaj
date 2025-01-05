import React from 'react';
import './App.css';
import AppHeader from './Components/AppHeader';
import AppFooter from './Components/AppFooter';
import SideMenu from './Components/SideMenu';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Pages
import Dashboard from './Pages/Dashboard';
import Inventory from './Pages/Inventory';
import Orders from './Pages/Orders';
import Login from './Pages/Login';
import Stock from './Pages/Stock';
import RFID from './Pages/RFID';
import Settings from './Pages/Settings';

function App() {
  return (
      <Router>
          <div className="App">
              <Routes>
                  {/* Login Route */}
                  <Route path="/login" element={<Login />} />

                  {/* Main Routes (For authenticated users) */}
                  <Route
                      path="/*"
                      element={
                          <>
                              <AppHeader />
                              <div className="SideMenuAndPageContent">
                                  <SideMenu />
                                  <div className="PageContent">
                                      <Routes>
                                          <Route path="/" element={<Dashboard />} />
                                          <Route path="/inventory" element={<Inventory />} />
                                          <Route path="/orders" element={<Orders />} />
                                          <Route path="/stock" element={<Stock />} />
                                          <Route path="/rfid" element={<RFID />} />
                                          <Route path="/settings" element={<Settings />} />
                                      </Routes>
                                  </div>
                              </div>
                              <AppFooter />
                          </>
                      }
                  />
              </Routes>
          </div>
      </Router>
  );
}

export default App;

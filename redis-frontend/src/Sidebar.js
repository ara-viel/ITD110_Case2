import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {  FiHome, FiUsers, FiUser,  FiLogOut, FiAlertTriangle, FiFileText  } from "react-icons/fi";
import "./Sidebar.css"; // Add your CSS styles

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
      {/* Navigation Icon */}
      <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
        <img 
          src="/images/logo.jpg" alt="Brgy. Rogongon Logo" className="menu-logo" />

        
        <p className="menu-text">Brgy. Hindang</p>
      </div>


      {/* Navigation Links */}
      <nav>
        <ul>
          <li>
            <Link to="/dash">
              <FiHome /> {isOpen && "Dashboard"}
            </Link>
          </li>
          <li>
            <Link to="/dashboard">
              <FiUsers /> {isOpen && "Resident"}
            </Link>
          </li>
          
          <li>
              <Link to="/officials">
                <FiUser  /> {isOpen && "Officials"}
              </Link>
          </li>
          <li>
              <Link to="/disaster">
                <FiAlertTriangle  /> {isOpen && "Disaster Response"}
              </Link>
          </li>
          
          <li>
            <Link to="/certificate">
              <FiFileText /> {isOpen && "Certificates"}
            </Link>
          </li>


          
          <li className="logout">
            <button onClick={handleLogout}>
              <FiLogOut /> {isOpen && "Logout"}
            </button>
          </li>

          


        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

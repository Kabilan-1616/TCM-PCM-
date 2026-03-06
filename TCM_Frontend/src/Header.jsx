import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const USER_PLACEHOLDER = "https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff&rounded=true"; 


const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setShowProfileMenu(!showProfileMenu);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-top">
        
        {/* LEFT: BRAND */}
        <div className="navbar-brand" onClick={() => navigate("/MainDashboard")}>
          <div className="brand-icon">
            <span></span>
          </div>
          <span className="brand-text">AL TCMS</span>
        </div>

        {/* RIGHT: ACTIONS */}
        <div className="navbar-right">
          
          {/* 1. All Projects Link */}
          <span className="nav-link-blue" onClick={() => navigate("/projectlist")}>
            All Projects
          </span>

          {/* 2. Profile Section */}
          <div className="profile-section" ref={menuRef}>
            <img 
              src={user?.avatar || USER_PLACEHOLDER} 
              alt="Profile" 
              className="profile-img"
              onClick={toggleMenu}
            />
            
            {/* Dropdown */}
            {showProfileMenu && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-name">{user?.name || "Admin User"}</div>
                  <div className="dropdown-role">{user?.role || "Administrator"}</div>
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout" onClick={onLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* 3. Divider */}
          <div className="nav-divider"></div>

          {/* 4. Secondary Logo */}
          <div className="secondary-logo">

          </div>

        </div>
      </div>
    </nav>
  );
};

export default Header;

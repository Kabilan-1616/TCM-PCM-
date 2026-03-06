import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './Navigator.css'; 

const Navigator = ({ activeProject, onCreatePlanClick, searchQuery, onSearchChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isLocked = !activeProject;
  const isActive = (path) => location.pathname.startsWith(path);

  // Identify current page context
  const isTestPlanPage = location.pathname.startsWith("/TestPlanManagement");
  const isProjectListPage = location.pathname.startsWith("/projectlist");

  return (
    <div className="navigator-container">
      
      {/* LINE 1: Project Title */}
      <div className="nav-project-row">
        <span className="nav-folder-icon">📂</span> 
        <span className="nav-project-name">
          {activeProject ? activeProject.project_name : "Select Project"}
        </span>
      </div>

      {/* LINE 2: Navigation Links + Actions */}
      <div className="nav-links-row">
        
        {/* Left Side: Links */}
        <ul className="nav-links">
          <li>
            <Link 
              to={isLocked ? "#" : "/TestDesign"} 
              className={`nav-item ${isLocked ? 'disabled' : ''} ${isActive("/TestDesign") ? 'active' : ''}`}
              onClick={(e) => isLocked && e.preventDefault()}
            >
              Test Case
            </Link>
          </li>
          <li>
            <Link 
              to={isLocked ? "#" : `/TestPlanManagement/${activeProject?.id}`} 
              className={`nav-item ${isLocked ? 'disabled' : ''} ${isActive("/TestPlanManagement") ? 'active' : ''}`}
              onClick={(e) => isLocked && e.preventDefault()}
            >
              Test Plan
            </Link>
          </li>
          <li>
            <Link 
              to={isLocked ? "#" : "/execution"} 
              className={`nav-item ${isLocked ? 'disabled' : ''} ${isActive("/execution") ? 'active' : ''}`}
              onClick={(e) => isLocked && e.preventDefault()}
            >
              Execute
            </Link>
          </li>

          {/* --- NEW RTM LINK (Added Here) --- */}
          <li>
            <Link 
              to={isLocked ? "#" : `/reports/rtm/${activeProject?.id}`} 
              className={`nav-item ${isLocked ? 'disabled' : ''} ${isActive("/reports/rtm") ? 'active' : ''}`}
              onClick={(e) => isLocked && e.preventDefault()}
            >
              RTM
            </Link>
          </li>
          {/* ---------------------------------- */}

          <li>
            <Link 
              // Changed path to explicitly check for history report to avoid conflict if both start with /reports
              to={isLocked ? "#" : `/reports/history/${activeProject?.id}`} 
              className={`nav-item ${isLocked ? 'disabled' : ''} ${isActive("/reports/history") ? 'active' : ''}`}
              onClick={(e) => isLocked && e.preventDefault()}
            >
              Reports
            </Link>
          </li>
        </ul>

        {/* ================= RIGHT SIDE ACTIONS ================= */}
        <div className="nav-right-actions">
          
          {/* 1. SHARED SEARCH BAR */}
          {(isTestPlanPage || isProjectListPage) && (
            <input 
              type="text" 
              className="nav-search-input"
              placeholder={isProjectListPage ? "Search projects..." : "Search plans..."}
              value={searchQuery || ""} 
              onChange={(e) => onSearchChange(e.target.value)}
            />
          )}

          {/* 2. CREATE BUTTONS */}
          
          {/* Case A: Test Plan Page */}
          {isTestPlanPage && !isLocked && (
            <button className="nav-action-btn" onClick={onCreatePlanClick}>
              + Create Plan
            </button>
          )}

          {/* Case B: Project List Page */}
          {isProjectListPage && (
            <button className="nav-action-btn" onClick={() => navigate("/ProjectCreate")}>
              + Create Project
            </button>
          )}

        </div>

      </div>
    </div>
  );
};

export default Navigator;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MainDashboard.css";

const MainDashboard = ({ activeProject, projects, onProjectSelect }) => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('menu');

  // ✅ SORT APPLIED: Latest project (highest ID) appears first
  const activeProjectsList = projects 
    ? [...projects].filter(p => p.project_active).sort((a, b) => b.id - a.id) 
    : [];

  const selectAndNavigate = (project) => {
    onProjectSelect(project);
    navigate(`/TestDesign/${project.id}`); 
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-popup-overlay">
        
        <div className="dashboard-popup-card">
          <div className="popup-header">
            <h2>Welcome to AL TCMS</h2>
            <p>What would you like to do?</p>
            {activeProject && (
              <div className="active-badge">
                Current: <strong>{activeProject.project_name}</strong>
              </div>
            )}
          </div>

          <div className="popup-body">
            {currentView === 'menu' ? (
              <div className="popup-options">
                <button className="popup-btn primary" onClick={() => setCurrentView('select')}>
                  <span className="icon">🎯</span> Select a Project
                </button>
                <button className="popup-btn" onClick={() => navigate('/ProjectCreate')}>
                  <span className="icon">➕</span> Create a Project
                </button>
                <button className="popup-btn" onClick={() => navigate('/projectlist')}>
                  <span className="icon">📁</span> View Project List
                </button>
              </div>
            ) : (
              <div className="popup-project-select">
                <button className="popup-back-btn" onClick={() => setCurrentView('menu')}>
                  ← Back to Menu
                </button>
                
                <h3>Select Active Project</h3>
                
                <div className="project-grid-list">
                  {activeProjectsList.length > 0 ? (
                    activeProjectsList.map(proj => (
                      <button 
                        key={proj.id} 
                        className="project-choice-btn"
                        onClick={() => selectAndNavigate(proj)}
                      >
                        <span className="proj-icon">📁</span>
                        <span className="proj-name">{proj.project_name}</span>
                        <span className="proj-arrow">➜</span>
                      </button>
                    ))
                  ) : (
                    <p className="no-proj-msg">No active projects found. Please create one first.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MainDashboard;

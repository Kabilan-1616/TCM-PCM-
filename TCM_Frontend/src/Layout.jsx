// src/Layout.jsx
import React from "react";
import Navbar from "./Header";
import TestDesignSidebar from "./suites/TestDesignSidebar";
import Navigator from "./Navigator"; 
import "./App.css"; 

// ✅ 1. Accept 'onCreatePlanClick' as a prop
const Layout = ({ children, activeProject, sidebarProps, onCreatePlanClick }) => {
  return (
    // 1. App Container (Vertical Column)
    <div className="app-container">
      
      {/* A. Navbar */}
      <Navbar activeProject={activeProject} />

      {/* B. App Body (Horizontal Row) */}
      <div className="app-body">
        
        {/* Left: Sidebar */}
        <TestDesignSidebar activeProject={activeProject} {...sidebarProps} />

        {/* Right: Panel Wrapper */}
        <div className="right-panel-wrapper">
          
          {/* ✅ 2. Render Navigator and pass the props */}
          <Navigator 
            activeProject={activeProject} 
            onCreatePlanClick={onCreatePlanClick} 
          />

          {/* Bottom of Right: Content (Scrollable) */}
          <main className="app-content-scrollable">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
};

export default Layout;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TestDesignSidebar.css";

const TestDesignSidebar = ({
  activeProject,
  projects = [],
  onProjectSelect,
  suites = [],
  suiteTestCases = {}, // Object: { suiteId: [testcases...] }
  expandedSuites = {}, // Object: { suiteId: boolean }
  toggleSuite,
  selectedSuiteId,
  selectedTestCaseId,
  onAddSuite,      // Callback for "Create Suite"
  onAddTestCase    // Callback for "Create Test Case"
}) => {
  const navigate = useNavigate();
  const [isProjectExpanded, setIsProjectExpanded] = useState(true);

  // Filter for active projects only
  const activeProjectsOnly = projects.filter(proj => proj.project_active === true);

  const handleDropdownChange = (e) => {
    const newProjectId = parseInt(e.target.value);
    const newProject = projects.find(p => p.id === newProjectId);
    if (newProject && onProjectSelect) {
      onProjectSelect(newProject);
      // Navigate to TestDesign with the new project ID to sync URL and load data
      navigate(`/TestDesign/${newProject.id}`);
    }
  };

  return (
    <aside className="td-sidebar">
      
      {/* --- 1. DROPDOWN HEADER --- */}
      <div className="sidebar-header-section">
        <div className="custom-dropdown-wrapper">
          <select 
            className="custom-dropdown"
            value={activeProject?.id || ""}
            onChange={handleDropdownChange}
          >
            <option value="" disabled>Select Project</option>
            {activeProjectsOnly.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.project_name}
              </option>
            ))}
          </select>
          <span className="dropdown-arrow">▼</span>
        </div>
      </div>

      {/* --- 2. TREE CONTENT --- */}
      <div className="sidebar-content">
        {!activeProject && <div className="empty-msg">Please select a project.</div>}

        {activeProject && (
          <div className="tree-structure">
            
            {/* LEVEL 0: PROJECT ROOT */}
            <div className="project-group">
              <div 
                className={`tree-item project-item ${!selectedSuiteId && !selectedTestCaseId ? 'active' : ''}`}
                onClick={() => {
                   setIsProjectExpanded(!isProjectExpanded);
                   navigate(`/TestDesign/${activeProject.id}`);
                }}
              >
                <span className="arrow-icon">{isProjectExpanded ? "▲" : "▼"}</span>
                <span className="folder-icon icon-yellow">📂</span>
                <span className="item-text text-bold">{activeProject.project_name}</span>
                
                {/* (+) ADD SUITE BUTTON */}
                <button 
                  className="icon-btn-add" 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    onAddSuite(); 
                  }}
                  title="Create New Suite"
                >
                  +
                </button>
              </div>

              {/* LEVEL 1: SUITES */}
              {isProjectExpanded && (
                <div className="project-children">
                  {suites.length === 0 && <div className="empty-leaf">No suites created.</div>}
                  
                  {suites.map((suite) => {
                    const currentCases = suiteTestCases[suite.id] || [];
                    const isExpanded = expandedSuites[suite.id];
                    // Using parseInt to ensure safe comparison with URL params
                    const isSuiteActive = parseInt(selectedSuiteId) === suite.id && !selectedTestCaseId;

                    return (
                      <div key={suite.id} className="suite-group">
                        <div
                          className={`tree-item suite-item ${isSuiteActive ? "active" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSuite(suite.id);
                            navigate(`/TestDesign/${activeProject.id}/${suite.id}`);
                          }}
                        >
                          <span className="arrow-icon">{isExpanded ? "▲" : "▼"}</span>
                          <span className="folder-icon icon-blue">📂</span>
                          <span className="item-text">{suite.suite_name}</span>

                          {/* (+) ADD TEST CASE BUTTON (Newly Added) */}
                          <button 
                            className="icon-btn-add" 
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                onAddTestCase(suite); 
                            }}
                            title="Create Test Case"
                          >
                            +
                          </button>
                        </div>

                        {/* LEVEL 2: TEST CASES */}
                        {isExpanded && (
                          <div className="suite-children">
                            {/* Wrapper for the vertical line */}
                            <div className="tree-line-wrapper">
                              {currentCases.length === 0 ? (
                                <div className="empty-leaf">No test cases</div>
                              ) : (
                                currentCases.map((tc) => {
                                  const isTcActive = parseInt(selectedTestCaseId) === tc.id; 
                                  return (
                                    <div
                                      key={tc.id}
                                      className={`tree-item tc-item ${isTcActive ? "active" : ""}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/TestDesign/${activeProject.id}/${suite.id}/${tc.id}`);
                                      }}
                                    >
                                      {/* The Blue Dot on the line */}
                                      <span className="tree-dot"></span>
                                      <span className="item-text">{tc.testcase_name}</span>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default TestDesignSidebar;

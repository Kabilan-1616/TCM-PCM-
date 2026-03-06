import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import CreateSuite from "./CreateSuite";
import CreateTestCase from "./CreateTestCase";
import "./TestDesign.css";

function TestDesign({ activeProject, onSidebarRefresh }) {
  const notifySidebar = (sid) => {
    if (onSidebarRefresh) onSidebarRefresh(sid);
    else if (window.__refreshSidebar) window.__refreshSidebar(sid);
  };
  const navigate = useNavigate();
  const { projectId, suiteId, testcaseId } = useParams();

  // --- STATE ---
  const [mode, setMode] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [selectedSuite, setSelectedSuite] = useState(null);
  const [selectedTestcase, setSelectedTestcase] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [editSuiteData, setEditSuiteData] = useState({ suite_name: "", suite_description: "" });
  const [editTestcaseData, setEditTestcaseData] = useState({
    testcase_name: "",
    testcase_summary: "",
    testcase_precondition: "",
    task_id: "",
    testcase_status: "Draft",
    testcase_importance: "Medium",
    testcase_executiontype: "Manual",
    steps: []
  });

  // --- DATA FETCHING ---
  const refreshData = useCallback(async () => {
    if (!activeProject) return;
    setLoading(true);
    try {
      if (testcaseId) {
        const tcRes = await axios.get(`http://127.0.0.1:8001/testcases/${testcaseId}`);
        const sRes = await axios.get(`http://127.0.0.1:8001/suites/${suiteId}`);
        setSelectedTestcase(tcRes.data);
        setSelectedSuite(sRes.data);
        setMode("viewTestcase");
      } else if (suiteId) {
        const sRes = await axios.get(`http://127.0.0.1:8001/suites/${suiteId}`);
        setSelectedSuite(sRes.data);
        setSelectedTestcase(null);
        setMode((prev) => prev === "createTestcase" ? "createTestcase" : "viewSuite");
      } else {
        setSelectedSuite(null);
        setSelectedTestcase(null);
        setMode((prev) => prev === "createSuite" ? "createSuite" : "dashboard");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, [activeProject, suiteId, testcaseId]);

  useEffect(() => { refreshData(); }, [refreshData]);

  // --- HANDLERS ---
  const handleUpdateSuite = async () => {
    try {
      await axios.put(`http://127.0.0.1:8001/suites/${selectedSuite.id}`, editSuiteData);
      notifySidebar(null);
      refreshData();
    } catch (err) { alert("Update failed"); }
  };

  const handleDeleteSuite = async () => {
    if (!window.confirm("Delete this Suite?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8001/suites/${selectedSuite.id}`);
      notifySidebar(null);
      navigate(`/TestDesign/${activeProject.id}`);
    } catch (err) { alert("Delete failed"); }
  };

  const handleDeleteTestcase = async () => {
    if (!window.confirm("Delete this Test Case?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8001/testcases/${selectedTestcase.id}`);
      notifySidebar(selectedTestcase.suite_id || suiteId);
      navigate(`/TestDesign/${activeProject.id}/${selectedSuite.id}`);
    } catch (err) { alert("Delete failed"); }
  };

  // --- RENDER ---
  if (!activeProject) return <div className="tp-page empty-state">Please select a project.</div>;
  if (loading) return <div className="tp-page loading-state">Loading details...</div>;

  return (
    <div className="tp-page">
      
      {/* 1. DASHBOARD */}
      {mode === "dashboard" && (
        <div className="tp-center-card">
          <div className="tp-empty-placeholder">
            <h2>📁 {activeProject.project_name}</h2>
            <p>Select a suite or create a new one.</p>
            <button className="tp-btn-create" onClick={() => setMode("createSuite")}>+ Create New Suite</button>
          </div>
        </div>
      )}

      {/* 2. CREATE SUITE */}
      {mode === "createSuite" && (
        <div className="tp-form-wrapper">
          <CreateSuite project={activeProject} onCancel={() => setMode("dashboard")} onSuccess={() => { notifySidebar(null); refreshData(); }} />
        </div>
      )}

      {/* 3. VIEW SUITE */}
      {mode === "viewSuite" && selectedSuite && (
        <div className="tp-content-column">
          <div className="tp-header-row">
            <div className="tp-title-group">
               <span className="tp-icon-large">📂</span>
               <h3 className="tp-page-title">{selectedSuite.suite_name}</h3>
            </div>
            <div className="tp-header-actions">
              <button className="tp-btn-secondary" onClick={() => { setEditSuiteData(selectedSuite); setMode("editSuite"); }}>Edit</button>
              <button className="tp-btn-danger-ghost" onClick={handleDeleteSuite}>Delete</button>
            </div>
          </div>
          <div className="tp-info-box">
             <label>Description</label>
             <p>{selectedSuite.suite_description || "No description provided."}</p>
          </div>
          <div className="tp-sub-actions">
            <p className="tp-text-muted">Test Cases in this suite are listed in the sidebar.</p>
            <button className="tp-btn-create" onClick={() => setMode("createTestcase")}>+ Create Test Case</button>
          </div>
        </div>
      )}

      {/* 4. EDIT SUITE */}
      {mode === "editSuite" && (
        <div className="tp-content-column">
          <div className="tp-header-row"><h3 className="tp-page-title">Edit Suite</h3></div>
          <div className="tp-form-container">
            <div className="tp-form-group">
              <label>Suite Name</label>
              <input className="tp-input" value={editSuiteData.suite_name} onChange={e => setEditSuiteData({...editSuiteData, suite_name: e.target.value})} />
            </div>
            <div className="tp-form-group">
              <label>Description</label>
              <textarea className="tp-input-textarea" value={editSuiteData.suite_description} onChange={e => setEditSuiteData({...editSuiteData, suite_description: e.target.value})} />
            </div>
            <div className="tp-footer-actions">
              <button className="tp-btn-secondary" onClick={() => setMode("viewSuite")}>Cancel</button>
              <button className="tp-btn-primary" onClick={handleUpdateSuite}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* 5. CREATE TEST CASE */}
      {mode === "createTestcase" && selectedSuite && (
        <div className="tp-form-wrapper">
          <CreateTestCase suite={selectedSuite} editingTestcase={isEditMode ? selectedTestcase : null} onCancel={() => { setMode("viewTestcase"); setIsEditMode(false); }} onSuccess={() => { notifySidebar(selectedSuite?.id); refreshData(); setMode("viewTestcase"); setIsEditMode(false); }} />
        </div>
      )}

      {/* 6. VIEW TEST CASE */}
      {mode === "viewTestcase" && selectedTestcase && (
        <div className="tp-content-column">
          {/* Header */}
          <div className="tp-header-row">
            <div className="tp-title-group">
              <span className="tp-id-badge">#{selectedTestcase.id}</span>
              <h3 className="tp-page-title">{selectedTestcase.testcase_name}</h3>
            </div>
            <div className="tp-header-actions">
               <button className="tp-btn-primary" onClick={() => { setSelectedTestcase(null); setIsEditMode(false); setMode("createTestcase"); }}>+ New</button>
               <button className="tp-btn-secondary" onClick={() => { setIsEditMode(true); setMode("createTestcase"); }}>Edit</button>
               <button className="tp-btn-danger-ghost" onClick={handleDeleteTestcase}>Delete</button>
            </div>
          </div>

          {/* Meta Bar */}
          <div className="tp-meta-grid">
            <div className="tp-meta-item">
               <label>Task ID</label>
               <span>{selectedTestcase.task_id || "N/A"}</span>
            </div>
            <div className="tp-meta-item">
               <label>Status</label>
               <span className={`status-badge ${selectedTestcase.testcase_status?.toLowerCase()}`}>{selectedTestcase.testcase_status}</span>
            </div>
            <div className="tp-meta-item">
               <label>Importance</label>
               <span className={`importance-text ${selectedTestcase.testcase_importance?.toLowerCase()}`}>{selectedTestcase.testcase_importance}</span>
            </div>
            <div className="tp-meta-item">
               <label>Type</label>
               <span>{selectedTestcase.testcase_type}</span>
            </div>
          </div>

          {/* Summary/Precondition (Only if they exist) */}
          {(selectedTestcase.testcase_summary || selectedTestcase.testcase_precondition) && (
            <div className="tp-details-grid">
                {selectedTestcase.testcase_summary && (
                  <div className="tp-info-box compact">
                    <label>Summary</label>
                    <p>{selectedTestcase.testcase_summary}</p>
                  </div>
                )}
                {selectedTestcase.testcase_precondition && (
                  <div className="tp-info-box compact">
                    <label>Pre-conditions</label>
                    <p>{selectedTestcase.testcase_precondition}</p>
                  </div>
                )}
            </div>
          )}

          {/* Steps Table */}
          <div className="tp-table-header-label">TEST STEPS</div>
          <div className="tp-table-container view-mode">
            <div className="tp-table-scroll">
              <table className="tp-table tp-view-table">
                <thead>
                  <tr>
                    <th style={{width: '50px'}}>#</th>
                    <th style={{width: '40%'}}>Action</th>
                    <th style={{width: '40%'}}>Expected Result</th>
                    <th>Precondition</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedTestcase.steps || []).length === 0 ? (
                    <tr><td colSpan="4" className="tp-empty-cell">No steps defined</td></tr>
                  ) : (
                    selectedTestcase.steps.map(step => (
                      <tr key={step.step_no}>
                        <td className="tp-id-cell center-text">{step.step_no}</td>
                        <td className="tp-text-cell">{step.action}</td>
                        <td className="tp-text-cell">{step.expected_result}</td>
                        <td className="tp-text-muted-cell">{step.precondition}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}

export default TestDesign;

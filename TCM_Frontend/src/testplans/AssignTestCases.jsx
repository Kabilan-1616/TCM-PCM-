import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./AssignTestCases.css";

function AssignTestCases() {
  const navigate = useNavigate();
  const { planId } = useParams();

  const [planInfo, setPlanInfo] = useState(null);
  const [suites, setSuites] = useState([]);
  const [selectedSuiteId, setSelectedSuiteId] = useState(null);
  const [selectedTestcases, setSelectedTestcases] = useState([]);
  const [viewingTestcase, setViewingTestcase] = useState(null);

  /* ---------------- API CALLS ---------------- */
  const fetchPlanInfo = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8001/testplan/${planId}`);
      setPlanInfo(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchSuites = async (projectId) => {
    try {
      const res = await axios.get(`http://127.0.0.1:8001/projects/${projectId}/suites-with-testcases`);
      setSuites(res.data);
      if (res.data.length > 0) setSelectedSuiteId(res.data[0].id);
    } catch (e) { console.error(e); }
  };

  const fetchAssignedTestcases = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8001/testplans/${planId}/testcases`);
      setSelectedTestcases(res.data.map(tc => tc.id));
    } catch (e) { console.error(e); }
  };

  const handleSave = async () => {
    try {
      await axios.post(`http://127.0.0.1:8001/testplans/${planId}/testcases`, {
        testcase_ids: selectedTestcases
      });
      alert("Assignment Saved Successfully!");
      navigate(-1);
    } catch (err) { alert("Error saving assignment"); }
  };

  const handleToggleDetails = async (tcId) => {
    if (viewingTestcase?.id === tcId) {
      setViewingTestcase(null);
      return;
    }
    try {
      const res = await axios.get(`http://127.0.0.1:8001/testcases/${tcId}`);
      setViewingTestcase(res.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchPlanInfo();
    fetchAssignedTestcases();
  }, [planId]);

  useEffect(() => {
    if (planInfo?.project_id) fetchSuites(planInfo.project_id);
  }, [planInfo]);

  /* ---------------- SELECTION LOGIC (UPDATED) ---------------- */
  const currentSuite = suites.find(s => s.id === selectedSuiteId);
  const visibleCases = currentSuite?.testcases || [];

  // Filter only READY cases for bulk selection
  const selectableCases = visibleCases.filter(tc => (tc.testcase_status || "").toLowerCase() === "ready");
  
  // "Select All" state depends ONLY on selectable cases
  const isAllSelected = selectableCases.length > 0 && selectableCases.every(tc => selectedTestcases.includes(tc.id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      // Unselect only the visible selectable ones
      const visibleIds = selectableCases.map(tc => tc.id);
      setSelectedTestcases(prev => prev.filter(id => !visibleIds.includes(id)));
    } else {
      // Select all ready cases
      const visibleIds = selectableCases.map(tc => tc.id);
      setSelectedTestcases(prev => [...new Set([...prev, ...visibleIds])]);
    }
  };

  const toggleTestcase = (id) => {
    setSelectedTestcases(prev =>
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  return (
    <div className="at-page">
      
      {/* HEADER */}
      <div className="at-header">
        <div className="at-header-left">
          <h2 className="at-page-title">Assign Test Cases</h2>
          {planInfo && (
            <div className="at-context-badges">
              <span className="ctx-badge">Plan: {planInfo.testplan_name}</span>
              <span className="ctx-badge">ID: {planInfo.project_id}</span>
            </div>
          )}
        </div>
        
        <div className="at-header-right">
          <span className="selection-info">
            Selected: <b>{selectedTestcases.length}</b>
          </span>
          <button className="at-btn-cancel" onClick={() => navigate(-1)}>Cancel</button>
          <button className="at-btn-save" onClick={handleSave}>Save</button>
        </div>
      </div>

      {/* BODY CONTENT */}
      <div className="at-body-container">
        
        {/* SIDEBAR: SUITES */}
        <div className="at-sidebar-suites">
          <div className="sidebar-header">TEST SUITES</div>
          <div className="sidebar-scroll">
            {suites.map(s => (
              <div
                key={s.id}
                className={`suite-item ${selectedSuiteId === s.id ? "active" : ""}`}
                onClick={() => { setSelectedSuiteId(s.id); setViewingTestcase(null); }}
              >
                <span className="folder-icon">📁</span>
                <span className="suite-text">{s.suite_name}</span>
                <span className="count-badge">{s.testcases?.length || 0}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN: TEST CASES */}
        <div className="at-main-content">
          <div className="at-table-card">
            {!currentSuite ? (
              <div className="empty-placeholder">Select a suite to view test cases</div>
            ) : (
              <div className="table-scroll-area">
                <table className="at-table">
                  <colgroup>
                    <col style={{ width: "40px" }} />
                    <col style={{ width: "90px" }} />
                    <col style={{ width: "auto" }} />
                    <col style={{ width: "100px" }} />
                    <col style={{ width: "50px" }} />
                  </colgroup>

                  <thead>
                    <tr>
                      <th className="text-center">
                        <input 
                          type="checkbox" 
                          className="at-checkbox" 
                          checked={isAllSelected} 
                          onChange={handleSelectAll} 
                          disabled={selectableCases.length === 0} // Disable if no ready cases
                        />
                      </th>
                      <th>ID</th>
                      <th>Case Name</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleCases.length === 0 ? (
                      <tr><td colSpan="5" className="empty-row">No test cases found.</td></tr>
                    ) : (
                      visibleCases.map(tc => {
                        const isExpanded = viewingTestcase?.id === tc.id;
                        const isSelected = selectedTestcases.includes(tc.id);
                        const isDraft = (tc.testcase_status || "").toLowerCase() !== "ready";
                        
                        return (
                          <React.Fragment key={tc.id}>
                            <tr className={`at-row ${isSelected ? "selected" : ""} ${isExpanded ? "expanded" : ""} ${isDraft ? "row-draft" : ""}`}>
                              <td className="text-center">
                                <input 
                                  type="checkbox" 
                                  className="at-checkbox" 
                                  checked={isSelected} 
                                  onChange={() => toggleTestcase(tc.id)}
                                  disabled={isDraft} // ✅ DISABLED IF DRAFT
                                />
                              </td>
                              <td className="id-text">TC-{tc.id}</td>
                              <td className="name-text" onClick={() => handleToggleDetails(tc.id)}>
                                {tc.testcase_name}
                              </td>
                              <td>
                                <span className={`status-label ${isDraft ? 'draft' : 'ready'}`}>
                                  {tc.testcase_status || "Draft"}
                                </span>
                              </td>
                              <td className="text-center pointer" onClick={() => handleToggleDetails(tc.id)}>
                                {isExpanded ? "▼" : "▶"}
                              </td>
                            </tr>

                            {isExpanded && (
                              <tr className="detail-row-container">
                                <td colSpan="5" className="detail-cell-wrapper">
                                  <div className="detail-panel">
                                    <div className="info-grid">
                                      <div className="info-block">
                                        <label>Summary</label>
                                        <div className="info-value">{viewingTestcase.testcase_summary || "—"}</div>
                                      </div>
                                      <div className="info-block">
                                        <label>Preconditions</label>
                                        <div className="info-value">{viewingTestcase.testcase_precondition || "—"}</div>
                                      </div>
                                    </div>

                                    {viewingTestcase.steps && viewingTestcase.steps.length > 0 && (
                                      <div className="steps-wrapper">
                                        <label className="section-label">Test Steps</label>
                                        <table className="inner-steps-table">
                                          <thead>
                                            <tr>
                                              <th style={{width:'40px'}}>#</th>
                                              <th>Action</th>
                                              <th>Expected Result</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {viewingTestcase.steps.map(step => (
                                              <tr key={step.step_no}>
                                                <td>{step.step_no}</td>
                                                <td>{step.action}</td>
                                                <td>{step.expected_result}</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default AssignTestCases;

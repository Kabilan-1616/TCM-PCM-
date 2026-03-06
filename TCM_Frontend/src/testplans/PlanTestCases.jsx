import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PlanTestCases.css";

function PlanTestCases() {
  const { planId } = useParams();
  const navigate = useNavigate();

  const [testcases, setTestcases] = useState([]);
  const [planInfo, setPlanInfo] = useState(null);
  const [builds, setBuilds] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [planRes, buildRes, caseRes] = await Promise.all([
          axios.get(`http://127.0.0.1:8001/testplan/${planId}`),
          axios.get(`http://127.0.0.1:8001/testplans/${planId}/builds`),
          axios.get(`http://127.0.0.1:8001/testplans/${planId}/testcases`)
        ]);
        setPlanInfo(planRes.data);
        setBuilds(buildRes.data);
        setTestcases(caseRes.data);
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, [planId]);

  const toggleRow = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleBack = () => {
    navigate("/testplanmanagement", { 
      state: { selectedProjectId: planInfo?.project_id } 
    });
  };

  return (
    <div className="pt-page">
      
      {/* HEADER BAR */}
      <div className="pt-header">
        <div className="pt-header-info">
          <h2 className="pt-title">{planInfo?.testplan_name || "Loading..."}</h2>
          <div className="pt-meta-row">
            <span className="meta-badge">Cases: <b>{testcases.length}</b></span>
            <span className="meta-badge">Builds: <b>{builds.length}</b></span>
          </div>
        </div>
        
        <div className="pt-header-actions">
          <button className="pt-btn-secondary" onClick={handleBack}>← Back</button>
          <button className="pt-btn-primary" onClick={() => navigate(`/AssignTestCases/${planId}`)}>
            + Add / Assign
          </button>
        </div>
      </div>

      {/* CONTENT BODY */}
      <div className="pt-body">
        <div className="pt-card">
          
          {/* SUMMARY BLOCK */}
          {planInfo?.testcase_summary && (
            <div className="pt-summary-box">
              <label>Plan Summary</label>
              <p>{planInfo.testcase_summary}</p>
            </div>
          )}

          <div className="pt-table-wrapper">
            <table className="pt-table">
              <colgroup>
                <col style={{ width: "70px" }} />  {/* ID */}
                <col style={{ width: "auto" }} />  {/* Name */}
                <col style={{ width: "100px" }} /> {/* Status */}
                <col style={{ width: "100px" }} /> {/* Importance */}
                <col style={{ width: "40px" }} />  {/* Arrow */}
              </colgroup>

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Test Case Name</th>
                  <th>Status</th>
                  <th>Importance</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {testcases.length === 0 ? (
                  <tr><td colSpan="5" className="empty-row">No test cases assigned.</td></tr>
                ) : (
                  testcases.map(tc => {
                    const isExpanded = expandedId === tc.id;
                    return (
                      <React.Fragment key={tc.id}>
                        <tr 
                          className={`pt-row ${isExpanded ? "expanded" : ""}`} 
                          onClick={() => toggleRow(tc.id)}
                        >
                          <td className="id-cell">TC-{tc.id}</td>
                          <td className="name-cell">{tc.testcase_name}</td>
                          <td>
                            <span className={`status-badge ${tc.testcase_status?.toLowerCase() || 'not-run'}`}>
                              {tc.testcase_status || "Not Run"}
                            </span>
                          </td>
                          <td>
                            <span className={`importance-text ${tc.testcase_importance?.toLowerCase()}`}>
                              {tc.testcase_importance}
                            </span>
                          </td>
                          <td className="expand-cell">
                            {isExpanded ? "▼" : "▶"}
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr className="pt-detail-row">
                            <td colSpan="5">
                              <div className="pt-detail-panel">
                                
                                <div className="info-grid">
                                  <div className="info-grid">
                                    {/* Left Block: Summary */}
                                    <div className="info-block">
                                      <label>Summary</label>
                                      <div className="info-value">
                                        {tc.testcase_summary || "No summary provided."}
                                      </div>
                                    </div>

                                    {/* Right Block: Precondition */}
                                    <div className="info-block">
                                      <label>Precondition</label>
                                      <div className="info-value">
                                        {tc.testcase_precondition || "No specific preconditions."}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {tc.steps && tc.steps.length > 0 && (
                                  <div className="steps-container">
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
                                        {tc.steps.map(step => (
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
        </div>
      </div>
    </div>
  );
}

export default PlanTestCases;

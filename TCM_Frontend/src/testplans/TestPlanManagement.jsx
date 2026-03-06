import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, matchPath } from "react-router-dom";
import "./TestPlanManagement.css";
import axios from "axios";

// ✅ Updated Props: Accepts 'searchQuery' from App.js (passed via Navigator)
function TestPlanManagement({ activeProject, isPlanModalOpen, onClosePlanModal, searchQuery }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract projectId from URL as fallback
  const match = matchPath("/TestPlanManagement/:projectId", location.pathname);
  const urlProjectId = match?.params?.projectId ? parseInt(match.params.projectId) : null;
  
  // Use activeProject if available, otherwise try to extract from URL
  const currentProjectId = activeProject?.id || urlProjectId;

  // --- STATE ---
  const [testplans, setTestPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null); 
  const [builds, setBuilds] = useState([]); 
  
  // Cache for Accordion Builds
  const [buildsCache, setBuildsCache] = useState({});

  // UI State for Accordion & Dropdown
  const [expandedPlanId, setExpandedPlanId] = useState(null); 
  const [actionMenuOpenId, setActionMenuOpenId] = useState(null);

  // --- LOCAL MODALS (These remain local as they are specific to rows) ---
  const [showEditPlanModal, setShowEditPlanModal] = useState(false);
  const [showBuildModal, setShowBuildModal] = useState(false);
  const [showEditBuildModal, setShowEditBuildModal] = useState(false);

  // --- DATA HOLDERS ---
  const [selectedPlanForAction, setSelectedPlanForAction] = useState(null); 
  const [editPlanData, setEditPlanData] = useState({});
  const [editBuildData, setEditBuildData] = useState({});

  // --- FORM DATA ---
  const [newPlan, setNewPlan] = useState({
    testplan_name: "", plandesc_name:"", plandesc_pmtid: "",
    plandesc_tested: "", plandesc_nottested: "", plandesc_references: "", plandesc_esttime: "",
    plan_active: true
  });

  const [newBuild, setNewBuild] = useState({
    build_version: "", build_desc: "",
    build_releaseDate: new Date().toISOString().split('T')[0],
    build_active: true, build_open: true
  });

  const [activeBuildMenu, setActiveBuildMenu] = useState(null);
  
  // --- HELPER: DATE FORMATTER ---
  const formatDate = (isoString) => {
    if (!isoString) return "";
    const [year, month, day] = isoString.split('-');
    return `${day}/${month}/${year}`;
  };

  // CLOSE DROPDOWN ON CLICK OUTSIDE
  useEffect(() => {
    const handleClickOutside = () => {
      setActionMenuOpenId(null);   // Closes Plan Menu
      setActiveBuildMenu(null);    // Closes Build Menu
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // --- API CALLS ---
  const fetchPlans = async (pid) => {
    try {
      const res = await axios.get(`http://127.0.0.1:8001/projects/${pid}/testplans`);
      setTestPlans(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchBuilds = async (planId) => {
    try {
      const res = await axios.get(`http://127.0.0.1:8001/testplans/${planId}/builds`);
      setBuilds(res.data); 
      setBuildsCache(prev => ({ ...prev, [planId]: res.data })); 
    } catch (err) { console.error(err); }
  };

  // --- USE EFFECTS ---
  useEffect(() => {
    if (currentProjectId) {
      fetchPlans(currentProjectId);
      setSelectedPlan(null);
      setBuilds([]);
      setExpandedPlanId(null);
    } else {
      setTestPlans([]);
    }
  }, [currentProjectId]);

  useEffect(() => {
    if (selectedPlan) {
      fetchBuilds(selectedPlan.id);
    } else {
      setBuilds([]);
    }
  }, [selectedPlan]);

  // --- HANDLERS ---
  
  const toggleActionMenu = (e, planId) => {
    e.stopPropagation(); 
    if (actionMenuOpenId === planId) setActionMenuOpenId(null);
    else setActionMenuOpenId(planId);
  };

  const handleShowBuilds = (e, plan) => {
    e.stopPropagation();
    if (expandedPlanId === plan.id) {
      setExpandedPlanId(null);
    } else {
      setExpandedPlanId(plan.id);
      fetchBuilds(plan.id); 
    }
  };

  // Create Plan Handler
  const handleCreatePlan = async () => {
    if (!newPlan.testplan_name.trim()) return alert("Plan Name Required");
    try {
      await axios.post("http://127.0.0.1:8001/createtestplan", { ...newPlan, project_id: activeProject.id });
      
      alert("Test Plan Created!");
      onClosePlanModal();
      fetchPlans(activeProject.id);
      
      setNewPlan({
        testplan_name: "", plandesc_name: "", plandesc_pmtid: "",
        plandesc_tested: "", plandesc_nottested: "", plandesc_references: "",plandesc_esttime: "",
        plan_active: true
      });
    } catch (err) { alert("Failed to create plan"); }
  };

  const handleDeletePlan = async (e, planId) => {
    if(e) e.stopPropagation();
    if(!window.confirm("Delete this Test Plan AND all its Builds?")) return;
    try {
        await axios.delete(`http://127.0.0.1:8001/testplan/${planId}`);
        alert("Test Plan Deleted");
        if(selectedPlan?.id === planId) {
            setSelectedPlan(null);
            setBuilds([]);
        }
        fetchPlans(activeProject.id);
    } catch(err) { alert("Failed to delete plan"); }
  };

  const handleEditClick = (e, plan) => {
    if(e) e.stopPropagation();
    setEditPlanData(plan);
    setShowEditPlanModal(true);
    setActionMenuOpenId(null);
  };

  const handleUpdatePlan = async () => {
    try {
        await axios.put(`http://127.0.0.1:8001/testplan/${editPlanData.id}`, editPlanData);
        alert("Test Plan Updated!");
        setShowEditPlanModal(false);
        fetchPlans(activeProject.id);
        if(selectedPlan?.id === editPlanData.id) setSelectedPlan(editPlanData);
    } catch(err) { alert("Failed to update plan"); }
  };

  // --- HANDLERS: BUILDS ---
  const handleCreateBuild = async () => {
    if (!newBuild.build_version) return alert("Build Title Required");
    try {
      const targetPlanId = selectedPlanForAction ? selectedPlanForAction.id : selectedPlan.id;
      const payload = { ...newBuild, testplan_id: targetPlanId };
      await axios.post("http://127.0.0.1:8001/createbuild", payload);
      alert("Build Created!");
      setShowBuildModal(false);
      setNewBuild({
          build_version: "", build_desc: "",
          build_releaseDate: new Date().toISOString().split('T')[0],
          build_active: true, build_open: true
      });
      fetchBuilds(targetPlanId);
      if(selectedPlanForAction) setExpandedPlanId(targetPlanId); 
    } catch (err) { alert("Failed to create build"); }
  };

  const handleDeleteBuild = async (buildId, planId) => {
      if(!window.confirm("Delete this Build?")) return;
      try {
          await axios.delete(`http://127.0.0.1:8001/build/${buildId}`);
          alert("Build Deleted");
          fetchBuilds(planId || selectedPlan.id);
      } catch (err) { alert("Failed to delete build"); }
  };

  const handleEditBuildClick = (build) => {
      setEditBuildData(build);
      if(!selectedPlanForAction) setSelectedPlanForAction({id: build.testplan_id});
      setShowEditBuildModal(true);
  };

  const handleUpdateBuild = async () => {
      try {
          await axios.put(`http://127.0.0.1:8001/build/${editBuildData.id}`, editBuildData);
          alert("Build Updated!");
          setShowEditBuildModal(false);
          const pid = selectedPlanForAction ? selectedPlanForAction.id : selectedPlan.id;
          fetchBuilds(pid);
      } catch (err) { alert("Failed to update build"); }
  };

  // ✅ FILTER PLANS LOGIC (Added this)
  const filteredPlans = testplans.filter(p => {
    if (!searchQuery) return true; // If no search text, show all
    const lowerQ = searchQuery.toLowerCase();
    return (
      (p.testplan_name && p.testplan_name.toLowerCase().includes(lowerQ)) ||
      (p.plandesc_pmtid && p.plandesc_pmtid.toLowerCase().includes(lowerQ)) ||
      (p.plandesc_name && p.plandesc_name.toLowerCase().includes(lowerQ))
    );
  });

  if (!activeProject) {
    return (
      <div className="tp-page" style={{display:'flex', justifyContent:'center', alignItems:'center', height:'80vh', color:'#9ca3af'}}>
        <h2>Please select a project from the header to manage test plans.</h2>
      </div>
    );
  }

  return (
    <div className="tp-page">
      <div className="tp-content-area">
        <div className="tp-section">
          {/* ✅ UPDATED: Use filteredPlans.length instead of testplans.length */}
          {filteredPlans.length === 0 ? <p style={{padding:'20px'}}>No Plans found.</p> : (
            <table className="tp-table">
              <thead className="tp-table-title">
                <tr>
                  <th style={{width:'200px'}}>Plan Name</th>
                  <th>Desc. Name</th>
                  <th style={{width:'100px'}}>AL PMT ID</th>
                  <th>Features Tested</th>
                  <th>Features Not Tested</th>
                  <th>References</th>
                  <th>Estimated Time (hr)</th>
                  <th style={{width:'80px'}}>Active</th>
                  <th style={{width:'150px'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* ✅ UPDATED: Map over filteredPlans instead of testplans */}
                {filteredPlans.map(p => (
                  <React.Fragment key={p.id}>
                    {/* PLAN ROW */}
                    <tr 
                        className={`tp-plan-row ${selectedPlan?.id === p.id ? "tp-row-selected" : ""} ${expandedPlanId === p.id ? "active-plan" : ""}`}
                        onClick={() => setSelectedPlan(p)} 
                        style={{cursor: "pointer"}}
                    >
                      <td>{p.testplan_name}</td>
                      <td>{p.plandesc_name}</td>
                      <td>{p.plandesc_pmtid}</td>
                      <td>{p.plandesc_tested}</td>
                      <td>{p.plandesc_nottested}</td>
                      <td>{p.plandesc_references}</td>
                      <td>{p.plandesc_esttime}</td>
                      <td>{p.plan_active ? "Yes" : "No"}</td>
                      
                      {/* ACTION COLUMN */}
                      <td className="tp-action-cell">
                        <div className="tp-action-wrapper">
                          
                          <button 
                            className={`btn-builds ${expandedPlanId === p.id ? 'active' : ''}`}
                            onClick={(e) => handleShowBuilds(e, p)}
                          >
                            Builds {expandedPlanId === p.id ? '↑' : '↓'}
                          </button>

                          <button 
                            className="tp-dots-btn" 
                            onClick={(e) => toggleActionMenu(e, p.id)}
                          >
                            •••
                          </button>

                          {/* Popup Menu */}
                          {actionMenuOpenId === p.id && (
                            <div className="action-menu-dropdown" onClick={(e) => e.stopPropagation()}>
                              <div className="menu-item" onClick={(e) => handleEditClick(e, p)}>
                                <span className="icon">✏️</span> Edit
                              </div>
                              <div className="menu-item" onClick={() => { navigate(`/AssignTestCases/${p.id}`); setActionMenuOpenId(null); }}>
                                <span className="icon">👤</span> Assign Cases
                              </div>
                              <div className="menu-item" onClick={() => { navigate(`/plantestcases/${p.id}`); setActionMenuOpenId(null); }}>
                                <span className="icon">👁</span> View Cases
                              </div>
                              <div className="menu-divider"></div>
                              <div className="menu-item delete-item" onClick={(e) => handleDeletePlan(e, p.id)}>
                                <span className="icon">🗑</span> Delete
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* EXPANDED BUILDS ROW */}
                    {expandedPlanId === p.id && (
                      <tr className="tp-builds-row-container">
                        <td colSpan="9" className="tp-builds-wrapper">
                          <div className="tp-builds-inner">
                            
                            {/* Table always renders so the Header Button is always visible */}
                            <table className="builds-table">
                              <thead>
                                <tr>
                                  <th>Build Title</th>
                                  <th>Notes</th>
                                  <th>Release Date</th>
                                  <th>Active</th>
                                  <th>Open</th>
                                  
                                  {/* BUTTON MOVED HERE: Aligned to the right via CSS class */}
                                  <th className="build-header-btn-cell">
                                    <button 
                                      className="btn-add-build-solid" 
                                      onClick={() => { 
                                        setSelectedPlanForAction(p); 
                                        setShowBuildModal(true); 
                                      }}
                                    >
                                      + Add Build
                                    </button>
                                  </th>
                                </tr>
                              </thead>
                              
                              <tbody>
                                {(!buildsCache[p.id] || buildsCache[p.id].length === 0) ? (
                                  /* Empty State Row */
                                  <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px', fontStyle: 'italic', color: '#64748b' }}>
                                      No builds found. Add one to get started.
                                    </td>
                                  </tr>
                                ) : (
                                  /* Build Rows */
                                  buildsCache[p.id].map(b => (
                                    <tr key={b.id}>
                                      <td>{b.build_version}</td>
                                      <td>{b.build_desc}</td>
                                      <td>{formatDate(b.build_releaseDate)}</td>
                                      <td>{b.build_active ? "Yes" : "No"}</td>
                                      <td>{b.build_open ? "Yes" : "No"}</td>
                                      
                                      {/* ACTIONS COLUMN with DOTS & POPUP */}
                                      <td className="tp-action-cell">
                                        <div className="tp-action-wrapper">
                                          <button 
                                            className="tp-dots-btn" 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              // Toggle: If this row is open, close it; otherwise open it
                                              setActiveBuildMenu(activeBuildMenu === b.id ? null : b.id);
                                            }}
                                          >
                                            ...
                                          </button>

                                          {/* Popup Dropdown - Only renders if this row is active */}
                                          {activeBuildMenu === b.id && (
                                            <div className="action-menu-dropdown">
                                              <div 
                                                className="menu-item" 
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setEditBuildData(b);
                                                  setSelectedPlanForAction(p);
                                                  setShowEditBuildModal(true);
                                                  setActiveBuildMenu(null); // Close menu after click
                                                }}
                                              >
                                                Edit
                                              </div>
                                              
                                              <div className="menu-divider"></div>
                                              
                                              <div 
                                                className="menu-item delete" 
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleDeleteBuild(b.id, p.id);
                                                  setActiveBuildMenu(null); // Close menu after click
                                                }}
                                              >
                                                Delete
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>

                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ================= MODALS ================= */}

      {/* 1. CREATE PLAN MODAL */}
      {isPlanModalOpen && (
        <div className="tp-modal-overlay">
          <div className="tp-modal-box large-modal">
            <h3>Create Test Plan</h3>
            <div className="tp-modal-scroll-content">
                <div className="tp-form-row"> <label>Test Plan Name *</label> <input className="tp-input-text" type="text" value={newPlan.testplan_name} onChange={(e) => setNewPlan({...newPlan, testplan_name: e.target.value})} /> </div>
                <div className="tp-form-row"> <label>Description Name</label> <input className="tp-input-text" type="text" value={newPlan.plandesc_name} onChange={(e) => setNewPlan({...newPlan, plandesc_name: e.target.value})} /> </div>
                <div className="tp-form-row"> <label>PMT Reference ID</label> <input className="tp-input-text" value={newPlan.plandesc_pmtid} onChange={(e) => setNewPlan({...newPlan, plandesc_pmtid: e.target.value})} /> </div>
                <div className="tp-form-row"> <label>Features to be Tested</label> <textarea className="tp-input-textarea" value={newPlan.plandesc_tested} onChange={(e) => setNewPlan({...newPlan, plandesc_tested: e.target.value})} /> </div>
                <div className="tp-form-row"> <label>Features NOT to be Tested</label> <textarea className="tp-input-textarea" value={newPlan.plandesc_nottested} onChange={(e) => setNewPlan({...newPlan, plandesc_nottested: e.target.value})} /> </div>
                <div className="tp-form-row"> <label>References</label> <textarea className="tp-input-textarea" value={newPlan.plandesc_references} onChange={(e) => setNewPlan({...newPlan, plandesc_references: e.target.value})} /> </div>
                <div className="tp-form-row"> <label>Estimated Time (hr)</label> <input className="tp-input-text" type="text" value={newPlan.plandesc_esttime} onChange={(e) => setNewPlan({...newPlan, plandesc_esttime: e.target.value})} /> </div>
                <div className="tp-checkbox-group">
                    <label><input type="checkbox" checked={newPlan.plan_active} onChange={(e) => setNewPlan({...newPlan, plan_active: e.target.checked})} /> Active</label>
                </div>
            </div>
            <div className="tp-modal-actions">
              <button className="tp-btn-primary" onClick={handleCreatePlan}>Create</button>
              <button className="tp-btn-cancel" onClick={onClosePlanModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. EDIT PLAN MODAL */}
      {showEditPlanModal && (
        <div className="tp-modal-overlay">
          <div className="tp-modal-box large-modal">
            <h3>Edit Test Plan</h3>
            <div className="tp-modal-scroll-content">
                <div className="tp-form-row"> <label>Test Plan Name *</label> <input className="tp-input-text" type="text" value={editPlanData.testplan_name} onChange={(e) => setEditPlanData({...editPlanData, testplan_name: e.target.value})} /> </div>
                <div className="tp-form-row"> <label>Description Name</label> <input className="tp-input-text" type="text" value={editPlanData.plandesc_name} onChange={(e) => setEditPlanData({...editPlanData, plandesc_name: e.target.value})} /> </div>
                <div className="tp-form-row"> <label>PMT Reference ID</label> <input className="tp-input-text" value={editPlanData.plandesc_pmtid} onChange={(e) => setEditPlanData({...editPlanData, plandesc_pmtid: e.target.value})} /> </div>
                <div className="tp-form-row"> <label>Features to be Tested</label> <textarea className="tp-input-textarea" value={editPlanData.plandesc_tested} onChange={(e) => setEditPlanData({...editPlanData, plandesc_tested: e.target.value})} /> </div>
                <div className="tp-form-row"> <label>Features NOT to be Tested</label> <textarea className="tp-input-textarea" value={editPlanData.plandesc_nottested} onChange={(e) => setEditPlanData({...editPlanData, plandesc_nottested: e.target.value})} /> </div>
                <div className="tp-form-row"> <label>References</label> <textarea className="tp-input-textarea" value={editPlanData.plandesc_references} onChange={(e) => setEditPlanData({...editPlanData, plandesc_references: e.target.value})} /> </div>
                <div className="tp-form-row"> <label>Estimated Time (hr)</label> <input className="tp-input-text" value={editPlanData.plandesc_esttime} onChange={(e) => setEditPlanData({...editPlanData, plandesc_esttime: e.target.value})} /> </div>
                <div className="tp-checkbox-group">
                    <label><input type="checkbox" checked={editPlanData.plan_active} onChange={(e) => setEditPlanData({...editPlanData, plan_active: e.target.checked})} /> Active</label>
                </div>
            </div>
            <div className="tp-modal-actions">
              <button className="tp-btn-primary" onClick={handleUpdatePlan}>Save Changes</button>
              <button className="tp-btn-cancel" onClick={() => setShowEditPlanModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* 3. CREATE BUILD MODAL */}
      {showBuildModal && (
        <div className="tp-modal-overlay">
          <div className="tp-modal-box">
            <h3>Create Build</h3>
            <div className="tp-form-row">
                <label>Version *</label>
                <input className="tp-input-text" type="text" value={newBuild.build_version} onChange={(e) => setNewBuild({...newBuild, build_version: e.target.value})} />
            </div>
            <div className="tp-form-row">
                <label>Release Date</label>
                <input className="tp-input-text" type="date" value={newBuild.build_releaseDate} onChange={(e) => setNewBuild({...newBuild, build_releaseDate: e.target.value})} />
            </div>
            <div className="tp-form-row">
                <label>Notes</label>
                <textarea className="tp-input-textarea" value={newBuild.build_desc} onChange={(e) => setNewBuild({...newBuild, build_desc: e.target.value})} />
            </div>
            <div className="tp-checkbox-group">
                <label><input type="checkbox" checked={newBuild.build_active} onChange={(e) => setNewBuild({...newBuild, build_active: e.target.checked})} /> Active</label>
                <label><input type="checkbox" checked={newBuild.build_open} onChange={(e) => setNewBuild({...newBuild, build_open: e.target.checked})} /> Open</label>
            </div>
            <div className="tp-modal-actions">
              <button className="tp-btn-primary" onClick={handleCreateBuild}>Create</button>
              <button className="tp-btn-cancel" onClick={() => setShowBuildModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* 4. EDIT BUILD MODAL */}
      {showEditBuildModal && (
        <div className="tp-modal-overlay">
          <div className="tp-modal-box">
            <h3>Edit Build</h3>
            <div className="tp-form-row">
                <label>Version *</label>
                <input className="tp-input-text" type="text" value={editBuildData.build_version} onChange={(e) => setEditBuildData({...editBuildData, build_version: e.target.value})} />
            </div>
            <div className="tp-form-row">
                <label>Release Date</label>
                <input className="tp-input-text" type="date" value={editBuildData.build_releaseDate} onChange={(e) => setEditBuildData({...editBuildData, build_releaseDate: e.target.value})} />
            </div>
            <div className="tp-form-row">
                <label>Notes</label>
                <textarea className="tp-input-textarea" value={editBuildData.build_desc} onChange={(e) => setEditBuildData({...editBuildData, build_desc: e.target.value})} />
            </div>
            <div className="tp-checkbox-group">
                <label><input type="checkbox" checked={editBuildData.build_active} onChange={(e) => setEditBuildData({...editBuildData, build_active: e.target.checked})} /> Active</label>
                <label><input type="checkbox" checked={editBuildData.build_open} onChange={(e) => setEditBuildData({...editBuildData, build_open: e.target.checked})} /> Open</label>
            </div>
            <div className="tp-modal-actions">
              <button className="tp-btn-primary" onClick={handleUpdateBuild}>Save Changes</button>
              <button className="tp-btn-cancel" onClick={() => setShowEditBuildModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default TestPlanManagement;

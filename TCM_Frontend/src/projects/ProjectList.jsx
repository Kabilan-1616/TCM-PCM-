import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProjectList.css";

// ✅ Receive searchQuery from Props
function ProjectList({ onRefresh, searchQuery }) {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Action Menu State
  const [actionMenuOpenId, setActionMenuOpenId] = useState(null);

  // ================= FETCH PROJECTS =================
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("http://127.0.0.1:8001/allprojects");
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.response?.data?.details || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // CLOSE MENU ON CLICK OUTSIDE
  useEffect(() => {
    const handleClickOutside = () => setActionMenuOpenId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // ================= ACTIONS =================
  const toggleActionMenu = (e, id) => {
    e.stopPropagation();
    if (actionMenuOpenId === id) setActionMenuOpenId(null);
    else setActionMenuOpenId(id);
  };

  // ✅ EDIT: Navigates to the Create Page with Data
  const handleEditClick = (e, project) => {
    e.stopPropagation();
    // Navigate to ProjectCreate, passing the project data in 'state'
    navigate("/projectcreate", { state: { editProject: project } });
    setActionMenuOpenId(null);
  };

  const handleToggleActive = async (project) => {
    try {
      const updatedStatus = !project.project_active;
      await axios.put(`http://127.0.0.1:8001/project/${project.id}`, {
        ...project,
        project_active: updatedStatus,
      });
      setProjects(projects.map(p => p.id === project.id ? { ...p, project_active: updatedStatus } : p));
      if (onRefresh) onRefresh();
    } catch (err) { alert("Failed to toggle status"); }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8001/project/${id}`);
      setProjects(projects.filter((p) => p.id !== id));
      if (onRefresh) onRefresh();
      setActionMenuOpenId(null);
    } catch { alert("Failed to delete project"); }
  };

  // ================= SEARCH FILTER =================
  const filteredProjects = projects.filter((p) => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      (p.project_name || "").toLowerCase().includes(search) ||
      (p.prefix || "").toLowerCase().includes(search)
    );
  });

  return (
    <div className="tp-page">
      <div className="tp-content">
        {loading && <div className="info-msg">Loading projects...</div>}
        {error && <div className="error-msg">{error}</div>}

        {!loading && !error && (
          <div className="table-card">
            <div className="tp-table-scroll">
                <table className="tp-table">
                <thead>
                    <tr>
                        <th style={{width: '20%'}}>Project Name</th>
                        <th style={{width: '10%'}}>Prefix</th>
                        <th>Requirements</th>
                        <th>Priority</th>
                        <th>Automation</th>
                        <th>Inventory</th>
                        <th>Status</th>
                        <th style={{width:'80px', textAlign:'center'}}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProjects.map((p) => (
                    <tr key={p.id}>
                        <td style={{fontWeight: '600', color: '#163860'}}>{p.project_name}</td>
                        <td><code className="prefix-tag">{p.prefix}</code></td>
                        <td>{p.enable_requirements ? "● Enabled" : "○ Disabled"}</td>
                        <td>{p.enable_testing_priority ? "● Enabled" : "○ Disabled"}</td>
                        <td>{p.enable_test_automation ? "● Enabled" : "○ Disabled"}</td>
                        <td>{p.enable_inventory ? "● Enabled" : "○ Disabled"}</td>
                        <td>
                        <span 
                            className={`pill ${p.project_active ? "active" : "inactive"}`}
                            onClick={() => handleToggleActive(p)}
                            style={{ cursor: 'pointer' }}
                            title="Toggle Status"
                        >
                            {p.project_active ? "Active" : "Inactive"}
                        </span>
                        </td>
                        
                        {/* ACTION MENU */}
                        <td className="tp-action-cell">
                            <div className="tp-action-wrapper" style={{ justifyContent: 'center' }}>
                                <button 
                                    className="tp-dots-btn" 
                                    onClick={(e) => toggleActionMenu(e, p.id)}
                                >
                                    •••
                                </button>

                                {actionMenuOpenId === p.id && (
                                    <div className="action-menu-dropdown" onClick={(e) => e.stopPropagation()}>
                                        <div className="menu-item" onClick={(e) => handleEditClick(e, p)}>
                                            <span className="icon">✏️</span> Edit
                                        </div>
                                        <div className="menu-divider"></div>
                                        <div className="menu-item delete-item" onClick={(e) => handleDelete(e, p.id)}>
                                            <span className="icon">🗑</span> Delete
                                        </div>
                                    </div>
                                )}
                            </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
                {filteredProjects.length === 0 && <div className="info-msg" style={{padding:'20px'}}>No projects found.</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectList;

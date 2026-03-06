import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ProjectCreate.css";
import axios from "axios";

function ProjectCreate({ onRefresh }) {
  const navigate = useNavigate();
  const location = useLocation();
  const editModeData = location.state?.editProject;

  const [projectDetails, setProjectDetails] = useState({
    project_name: "",
    prefix: "",
    project_description: "",
    enable_requirements: false,
    enable_testing_priority: false,
    enable_test_automation: false,
    enable_inventory: false,
    project_active: true,
  });

  useEffect(() => {
    if (editModeData) setProjectDetails(editModeData);
  }, [editModeData]);

  const [errors, setErrors] = useState({});

  const handleProjectDetails = (e) => {
    const { name, value, type, checked } = e.target;
    setProjectDetails({
      ...projectDetails,
      [name]: type === "checkbox" ? checked : value,
    });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!projectDetails.project_name.trim()) newErrors.project_name = "Required";
    if (!projectDetails.prefix.trim()) newErrors.prefix = "Required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (editModeData) {
        await axios.put(`http://127.0.0.1:8001/project/${editModeData.id}`, projectDetails);
        alert("Project updated successfully");
      } else {
        await axios.post("http://127.0.0.1:8001/projectcreate", projectDetails);
        alert("Project created successfully");
      }
      // Call onRefresh to update projects list in sidebar
      if (onRefresh) {
        await onRefresh();
      }
      navigate("/projectlist");
    } catch (error) {
      alert(error.response?.data?.detail || "Error saving project");
    }
  };

  return (
    <div className="tp-page full-width-layout">
      
      <div className="tp-form-card wide-card">
        
        <div className="tp-card-header">
          <h2>{editModeData ? "Edit Project" : "Create New Project"}</h2>
        </div>

        <form onSubmit={handleSubmit} className="tp-form-body">
          
          {/* --- ROW 1: INPUTS (Name, Prefix, Description) --- */}
          <div className="form-row-linear">
            
            <div className="linear-group" style={{ flex: 2 }}>
              <label>Project Name <span className="req">*</span></label>
              <input
                type="text"
                name="project_name"
                placeholder="Project Name"
                value={projectDetails.project_name}
                onChange={handleProjectDetails}
                className={`tp-input sharp ${errors.project_name ? "input-error" : ""}`}
              />
              {errors.project_name && <span className="error-msg">{errors.project_name}</span>}
            </div>

            <div className="linear-group" style={{ flex: 1 }}>
              <label>Prefix <span className="req">*</span></label>
              <input
                type="text"
                name="prefix"
                placeholder="Prefix"
                value={projectDetails.prefix}
                onChange={handleProjectDetails}
                className={`tp-input sharp ${errors.prefix ? "input-error" : ""}`}
                maxLength={10}
              />
              {errors.prefix && <span className="error-msg">{errors.prefix}</span>}
            </div>

            <div className="linear-group" style={{ flex: 3 }}>
              <label>Description</label>
              <input 
                type="text"
                name="project_description"
                placeholder="Brief description..."
                value={projectDetails.project_description}
                onChange={handleProjectDetails}
                className="tp-input sharp"
              />
            </div>

          </div>

          <div className="form-divider"></div>

          {/* --- ROW 2: CHECKBOXES --- */}
          <div className="form-row-checks">
            <label className="section-label">Settings:</label>
            
            <div className="checks-container">
              {[
                ["enable_requirements", "Enable Requirements"],
                ["enable_testing_priority", "Testing Priority"],
                ["enable_test_automation", "Test Automation"],
                ["enable_inventory", "Enable Inventory"],

                ["project_active", "Active"],
              ].map(([key, label]) => (
                <label key={key} className="checkbox-pill">
                  <input 
                    type="checkbox" 
                    name={key} 
                    checked={projectDetails[key]} 
                    onChange={handleProjectDetails} 
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="tp-form-actions">
            <button type="button" className="btn-secondary sharp" onClick={() => navigate("/projectlist")}>
              Cancel
            </button>
            <button type="submit" className="primary-btn sharp">
              {editModeData ? "Save Update" : "Create Project"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default ProjectCreate;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import ProjectFooterActions from "../../components/ProjectFooterActions/ProjectFooterActions";
import { createProject } from "../../services/projectService";
import "./ProjectForm.css";

export default function Kanban() {
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [prefix, setPrefix] = useState("");
  const [settings, setSettings] = useState({
    enable_requirements: false,
    enable_testing_priority: false,
    enable_test_automation: false,
    enable_inventory: false,
    project_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createSlug = (name) =>
    name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const toggleSetting = (key) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleCreate = async () => {
    if (!projectName.trim()) { setError("Project name is required"); return; }
    if (!prefix.trim()) { setError("Prefix is required"); return; }

    setLoading(true);
    setError("");

    try {
      const project = await createProject({
        name: projectName,
        slug: createSlug(projectName),
        description: projectDesc,
        prefix: prefix.toUpperCase(),
        ...settings,
      });
      navigate(`/project/${project.slug}/backlog`);
    } catch (err) {
      setError(err.message || "Unable to create project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header variant="dashboard" />
      <main className="project-form">
        <h1>Kanban</h1>
        <p className="subtitle">Keep a constant workflow on independent tasks</p>

        <label>New project details</label>

        <input
          placeholder="Project Name (Required)"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          disabled={loading}
        />

        <input
          placeholder="Prefix e.g. PRJ (Required)"
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
          maxLength={10}
          disabled={loading}
          style={{ textTransform: "uppercase" }}
        />

        <textarea
          placeholder="Project Description"
          value={projectDesc}
          onChange={(e) => setProjectDesc(e.target.value)}
          disabled={loading}
        />

        <label style={{ marginTop: "16px" }}>TCM Settings</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", margin: "8px 0" }}>
          {[
            ["enable_requirements", "Requirements"],
            ["enable_testing_priority", "Testing Priority"],
            ["enable_test_automation", "Test Automation"],
            ["enable_inventory", "Inventory"],
            ["project_active", "Active"],
          ].map(([key, label]) => (
            <label key={key} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={settings[key]}
                onChange={() => toggleSetting(key)}
                disabled={loading}
              />
              {label}
            </label>
          ))}
        </div>

        {error && <div className="form-error">{error}</div>}

        <ProjectFooterActions
          onBack={() => navigate("/project/new")}
          onCreate={handleCreate}
          loading={loading}
        />
      </main>
    </>
  );
}
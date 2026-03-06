import Header from "../../components/Header/Header";
import ProjectVisibilityToggle from "../../components/ProjectVisibilityToggle/ProjectVisibilityToggle";
import ProjectFooterActions from "../../components/ProjectFooterActions/ProjectFooterActions";
import "./ProjectForm.css";

export default function Duplicate() {
  return (
    <>
      <Header variant="dashboard" />

      <main className="project-form">
        <h1>Duplicate Project</h1>
        <p className="subtitle">
          Start clean and keep your configuration
        </p>

        <select>
          <option>Choose an existing project to duplicate</option>
        </select>

        <label>New project details</label>
        <input placeholder="Project Name (Required)" />
        <textarea placeholder="Project Description (Required)" />

        <ProjectVisibilityToggle/>

        <ProjectFooterActions />
      </main>
    </>
  );
}
import Header from "../../components/Header/Header";
import "./ProjectForm.css";

export default function ImportProject() {
  return (
    <>
      <Header variant="dashboard" />

      <main className="project-form">
        <h1>Import Project</h1>
        <p className="subtitle">
          Import your project from multiple platforms into Taiga
        </p>

        <div className="import-card">
          <strong>Taiga</strong>
          <p>Import your Taiga project</p>
        </div>

        <button className="back-btn">BACK</button>
      </main>
    </>
  );
}
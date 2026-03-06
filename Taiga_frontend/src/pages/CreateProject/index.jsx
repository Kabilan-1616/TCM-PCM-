import Header from "../../components/Header/Header";
import TemplateOption from "../../components/TemplateOption/TemplateOption";
import { useNavigate } from "react-router-dom";
import "./CreateProject.css";

export default function CreateProject() {
  const navigate = useNavigate();

  return (
    <>
      <Header variant="dashboard" />

      <main className="create-project">
        <h1>Create Project</h1>
        <p className="subtitle">
          Which template fits your project better?
        </p>

        <div className="template-list">
          <TemplateOption
            title="SCRUM"
            description="Prioritize and solve your tasks in short time cycles."
            onClick={() => navigate("/project/new/scrum")}
          />

          <TemplateOption
            title="KANBAN"
            description="Keep a constant workflow on independent tasks"
            onClick={() => navigate("/project/new/kanban")}
          />

          <TemplateOption
            title="DUPLICATE PROJECT"
            description="Start clean and keep your configuration"
            onClick={() => navigate("/project/new/duplicate")}
          />

          <TemplateOption
            title="IMPORT PROJECT"
            description="Import your project from multiple platforms into Taiga"
            onClick={() => navigate("/project/new/import")}
          />
        </div>
      </main>
    </>
  );
}
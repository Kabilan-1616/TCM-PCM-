import "./ProjectFooterActions.css";

export default function ProjectFooterActions({
  onBack,
  onCreate,
}) {
  return (
    <div className="project-footer">
      <button
        className="back-btn"
        onClick={onBack}
        type="button"
      >
        BACK
      </button>

      <button
        className="create-btn"
        onClick={onCreate}
        type="button"
      >
        CREATE PROJECT
      </button>
    </div>
  );
}
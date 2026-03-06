import "./ProjectVisibilityToggle.css";

export default function ProjectVisibilityToggle() {
  return (
    <div className="visibility-toggle">
      <button className="visibility-toggle__btn active">
        🌍 PUBLIC PROJECT
      </button>
      <button className="visibility-toggle__btn">
        🔒 PRIVATE PROJECT
      </button>
    </div>
  );
}
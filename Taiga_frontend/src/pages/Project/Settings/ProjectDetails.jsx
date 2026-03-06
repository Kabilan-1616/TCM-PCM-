// src/pages/Settings/ProjectDetails.jsx
import "./ProjectDetails.css";

export default function ProjectDetails() {
  return (
    <div className="project-details">
      <h2 className="page-title">Project details</h2>

      <div className="project-details__layout">
        {/* LEFT */}
        <div className="project-details__logo">
          <div className="logo-box">
            <span>LOGO</span>
          </div>

          <button className="secondary-btn">CHANGE LOGO</button>
          <button className="link-btn">Use default image</button>
        </div>

        {/* RIGHT */}
        <div className="project-details__form">
          <div className="form-group">
            <label>Project name</label>
            <input type="text" value="Sample" readOnly />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea rows="4" defaultValue="Demo" />
          </div>

          <div className="form-group">
            <label>Tags</label>
            <button className="link-btn">Add tag +</button>
          </div>

          <hr />

          <div className="owner">
            <strong>Project owner</strong>
            <div className="owner-card">
              <div className="avatar">A</div>
              <div>
                <div className="name">admin</div>
              </div>
            </div>
          </div>

          <div className="toggle-row">
            <span>Is this project looking for people?</span>
            <input type="checkbox" />
          </div>

          <div className="toggle-row">
            <span>Receive feedback from Taiga users?</span>
            <input type="checkbox" defaultChecked />
          </div>

          <div className="visibility">
            <button className="primary-btn active">PUBLIC PROJECT</button>
            <button className="secondary-btn">PRIVATE PROJECT</button>
          </div>

          <button className="save-btn">SAVE</button>

          <button className="danger-link">Delete this project</button>
        </div>
      </div>
    </div>
  );
}

import "./Timeline.css";

export default function Timeline() {
  return (
    <div className="timeline">
      {/* Project header */}
      <div className="timeline__project">
        <div className="project-avatar">🌿</div>

        <div className="project-info">
          <h1>Sample</h1>
          <p>Demo Project</p>
        </div>

        <div className="project-actions">
          <button className="ghost-btn">❤️ Like</button>
          <button className="ghost-btn">👁 Watching</button>
          <button className="ghost-btn">✉️</button>
        </div>
      </div>

      <hr />

      {/* Activity feed */}
      <div className="timeline__feed">
        <div className="timeline-item">
          <div className="avatar">👤</div>
          <div className="content">
            <p>
              <strong>admin</strong> has created a new user story{" "}
              <span className="link">#1 Frontend</span> in{" "}
              <span className="link">Sample</span>
            </p>
            <span className="time">32 minutes ago</span>
          </div>
        </div>

        <div className="timeline-item">
          <div className="avatar">👤</div>
          <div className="content">
            <p>
              <strong>admin</strong> created the project{" "}
              <span className="link">Sample</span>
            </p>
            <p className="muted">Demo Project</p>
            <span className="time">20 hours ago</span>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <aside className="timeline__side">
        <h4>Team</h4>
        <div className="team-avatar">👤</div>
      </aside>
    </div>
  );
}
import "./Modules.css";

export default function Modules() {
  return (
    <div className="modules">
      <h2>Modules</h2>

      <Module
        icon="△"
        title="Epics"
        description="Visualize and manage the most strategic part of your project"
        enabled={false}
      />

      <Module
        icon="⟲"
        title="Scrum"
        description="Manage your user stories to maintain an organized view of upcoming and prioritized work."
        enabled
      >
        <div className="scrum-options">
          <div className="scrum-field">
            <label>Expected number of sprints</label>
            <input placeholder="0 for an undetermined number" />
          </div>
          <div className="scrum-field">
            <label>Expected total of story points</label>
            <input placeholder="0 for an undetermined number" />
          </div>
        </div>
      </Module>

      <Module
        icon="▦"
        title="Kanban"
        description="Organize your project in a lean way with this board."
        enabled={false}
      />

      <Module
        icon="⚑"
        title="Issues"
        description="Track the bugs, questions and enhancements related to your project. Don't miss anything!"
        enabled
      />

      <Module
        icon="▢"
        title="Wiki"
        description="Add, modify, or delete content in collaboration with others. This is the right place for your project's documentation."
        enabled
      />

      <Module
        icon="📹"
        title="Meet Up"
        description="Choose your videoconference system."
        enabled={false}
      />
    </div>
  );
}

/* ---------- MODULE ROW ---------- */

function Module({ icon, title, description, enabled, children }) {
  return (
    <div className="module-row">
      <div className="module-left">
        <div className="module-icon">{icon}</div>

        <div className="module-info">
          <div className="module-title">{title}</div>
          <div className="module-desc">{description}</div>

          {enabled && children}
        </div>
      </div>

      <label className="toggle">
        <input type="checkbox" defaultChecked={enabled} />
        <span />
      </label>
    </div>
  );
}

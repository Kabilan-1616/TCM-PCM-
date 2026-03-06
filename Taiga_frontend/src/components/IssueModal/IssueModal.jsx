import { useEffect, useState } from "react";
import "./IssueModal.css";

export default function IssueModal({ onClose, onCreate, tasks = [] }) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [assignedToMe, setAssignedToMe] = useState(false);

  const [type, setType] = useState("question");
  const [severity, setSeverity] = useState("normal");
  const [priority, setPriority] = useState("normal");
  const [taskId, setTaskId] = useState("");

  const [openMenu, setOpenMenu] = useState(null); // type | severity | priority

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!taskId && tasks.length > 0) {
      setTaskId(String(tasks[0].id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks]);

  const handleCreate = async () => {
    if (!subject.trim() || submitting) return;
    if (!taskId) {
      setError("Please select a task");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      await onCreate({
        taskId,
        title: subject,
        description,
        type,
        // UI-only (kept)
        severity,
        priority,
        assignedToMe,
      });
    } catch (err) {
      setError(err?.message || "Failed to create issue");
    } finally {
      setSubmitting(false);
    }
  };

  const closeMenu = () => setOpenMenu(null);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>

        <h2>New issue</h2>

        <div className="issue-grid">
          {/* ================= LEFT ================= */}
          <div className="issue-left">
            <input
              className="modal-input"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            <select
              className="modal-input"
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
            >
              <option value="">Select task</option>
              {tasks.map((t) => (
                <option key={t.id} value={t.id}>
                  #{t.id} {t.title}
                </option>
              ))}
            </select>

            <div className="tags">Add tag +</div>

            <textarea
              className="modal-textarea"
              placeholder="Please add descriptive text to help others better understand this issue"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* ATTACHMENTS */}
            <div className="issue-attachments">
              <div className="issue-attachments-header">
                <span>0 Attachments</span>
                <button>+</button>
              </div>
              <div className="issue-dropzone">
                Drop attachments here!
              </div>
            </div>

            {error && (
              <div style={{ color: "#c9302c", marginTop: 8, fontSize: 13 }}>
                {error}
              </div>
            )}

            <button className="create-btn" disabled={submitting} onClick={handleCreate}>
              {submitting ? "CREATING..." : "CREATE"}
            </button>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="issue-right">
            {/* ASSIGN */}
            <div className="issue-assign">
              <div className="issue-avatar">❄️</div>
              {assignedToMe ? (
                <span>
                  Assigned to <b>me</b>
                </span>
              ) : (
                <span onClick={() => setAssignedToMe(true)}>
                  Assign or <b>Assign to me</b>
                </span>
              )}
            </div>

            {/* META */}
            <div className="issue-meta">

              {/* TYPE */}
              <div className="issue-meta-row">
                <span>type</span>
                <div
                  className="meta-value clickable"
                  onClick={() => setOpenMenu(openMenu === "type" ? null : "type")}
                >
                  {type}
                  <span className={`dot ${type}`} />
                </div>

                {openMenu === "type" && (
                  <div className="meta-menu">
                    {["question", "enhancement"].map((v) => (
                      <div
                        key={v}
                        className="meta-option"
                        onClick={() => {
                          setType(v);
                          closeMenu();
                        }}
                      >
                        <span className={`dot ${v}`} />
                        {v}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SEVERITY */}
              <div className="issue-meta-row">
                <span>severity</span>
                <div
                  className="meta-value clickable"
                  onClick={() =>
                    setOpenMenu(openMenu === "severity" ? null : "severity")
                  }
                >
                  {severity}
                  <span className={`dot ${severity}`} />
                </div>

                {openMenu === "severity" && (
                  <div className="meta-menu">
                    {["wishlist", "minor", "normal", "important", "critical"].map(
                      (v) => (
                        <div
                          key={v}
                          className="meta-option"
                          onClick={() => {
                            setSeverity(v);
                            closeMenu();
                          }}
                        >
                          <span className={`dot ${v}`} />
                          {v}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* PRIORITY */}
              <div className="issue-meta-row">
                <span>priority</span>
                <div
                  className="meta-value clickable"
                  onClick={() =>
                    setOpenMenu(openMenu === "priority" ? null : "priority")
                  }
                >
                  {priority}
                  <span className={`dot prio-${priority}`} />
                </div>

                {openMenu === "priority" && (
                  <div className="meta-menu">
                    {["low", "normal", "high"].map((v) => (
                      <div
                        key={v}
                        className="meta-option"
                        onClick={() => {
                          setPriority(v);
                          closeMenu();
                        }}
                      >
                        <span className={`dot prio-${v}`} />
                        {v}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ICONS */}
              <div className="issue-icons">
                <button title="Due date">⏱</button>
                <button title="Blocked">🔒</button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// src/pages/Project/Issues.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authFetch } from "../../services/authFetch";
import IssueModal from "../../components/IssueModal/IssueModal";
import { getTasksByStory } from "../../services/taskService";
import { statusToLabel } from "../../services/statusMapping";
import "./Issues.css";

export default function Issues() {
  const [showModal, setShowModal] = useState(false);
  const [issues, setIssues]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [projectTasks, setProjectTasks] = useState([]);

  const navigate = useNavigate();
  const { slug }  = useParams();

  const onNewIssue  = () => setShowModal(true);
  const onCloseModal = () => setShowModal(false);

  const onCreateIssue = async (issue) => {
    try {
      if (!issue?.taskId) throw new Error("Task is required");
      const created = await authFetch("/issues/", {
        method: "POST",
        body: JSON.stringify({
          task:        Number(issue.taskId),
          type:        issue.type.charAt(0).toUpperCase() + issue.type.slice(1),
          title:       issue.title,
          description: issue.description || "",
        }),
      });
      setIssues((prev) => [...prev, created]);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // ── Single source of truth — Taiga backend reads shared 'issues' table ──
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await authFetch(`/issues/?project_slug=${slug}`);
        setIssues(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  // ── Load tasks for the create modal ──
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const stories = await authFetch(`/userstories/?project_slug=${slug}`);
        const lists   = await Promise.all(
          (stories || []).map((s) => getTasksByStory(s.id))
        );
        const flat = lists.flat();
        const map  = new Map();
        flat.forEach((t) => map.set(t.id, t));
        setProjectTasks([...map.values()]);
      } catch (err) {
        console.error(err);
        setProjectTasks([]);
      }
    };
    loadTasks();
  }, [slug]);

  return (
    <>
      <div className="issues">

        <div className="issues__header">
          <h1>Issues</h1>
          <div className="issues__actions">
            <button className="issues__new" onClick={onNewIssue}>+ NEW ISSUE</button>
          </div>
        </div>

        {loading ? (
          <div className="issues__empty"><p>Loading...</p></div>

        ) : issues.length === 0 ? (
          <div className="issues__empty">
            <div className="issues__illustration" />
            <p className="issues__empty-text">There are no issues to report :-)</p>
          </div>

        ) : (
          <div className="issues__list">
            {issues.map((issue) => (
              <div key={issue.id} className="issues__row">

                <span className={`dot ${issue.issue_type?.toLowerCase() || "bug"}`} />

                <span
                  className="issues__title link"
                  onClick={() => navigate(`/project/${slug}/issue/${issue.id}`)}
                >
                  #{issue.id} {issue.title}
                </span>

                {/* statusToLabel converts "IN_PROGRESS" → "In Progress" etc. */}
                <span className="issues__status">
                  {statusToLabel(issue.status)} ⌄
                </span>

                <span className="issues__modified">
                  {issue.created_at
                    ? new Date(issue.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit", month: "short", year: "numeric",
                      })
                    : ""}
                </span>

                <span style={{
                  fontSize: "11px",
                  background: issue.priority === "High" ? "#fde8e8" : "#f0f0f0",
                  color:      issue.priority === "High" ? "#d32f2f" : "#555",
                  padding: "2px 6px",
                  borderRadius: "8px",
                }}>
                  {issue.priority}
                </span>

                <span className="issues__assignee">❄️</span>
              </div>
            ))}
          </div>
        )}

      </div>

      {showModal && (
        <IssueModal
          onClose={onCloseModal}
          onCreate={onCreateIssue}
          tasks={projectTasks}
        />
      )}
    </>
  );
}
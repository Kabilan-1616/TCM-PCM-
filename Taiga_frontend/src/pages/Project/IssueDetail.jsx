// // src/pages/Project/IssueDetail.jsx
// import { useParams } from "react-router-dom";
// import "./IssueDetail.css";

// export default function IssueDetail() {
//   const { id } = useParams();

//   const issue = {
//     id,
//     subject: "Login",
//     description: "Need to complete login authentication",
//     type: "enhancement",
//     severity: "normal",
//     priority: "normal",
//     createdBy: "admin",
//     createdAt: "05 Feb 2026 11:58",
//   };

//   return (
//     <div className="issue-detail">
//       {/* HEADER */}
//       <div className="issue-detail__header">
//         <h1>
//           #{issue.id} {issue.subject}
//         </h1>

//         <div className="issue-detail__status">
//           <span className="status-text">OPEN</span>
//           <span className="status-pill">NEW ⌄</span>
//         </div>
//       </div>

//       <div className="issue-detail__layout">
//         {/* LEFT */}
//         <div className="issue-detail__left">
//           <span className="tag-link">Add tag +</span>

//           <p className="issue-description">{issue.description}</p>

//           {/* ATTACHMENTS */}
//           <div className="attachments">
//             <div className="attachments-header">
//               <span>0 Attachments</span>
//               <button className="icon-btn">+</button>
//             </div>
//             <div className="dropzone">Drop attachments here!</div>
//           </div>

//           {/* COMMENTS */}
//           <div className="comments">
//             <div className="comments-header">0 Comments</div>
//             <textarea placeholder="Type a new comment here" />
//           </div>
//         </div>

//         {/* RIGHT */}
//         <div className="issue-detail__right">
//           <div className="meta-row">
//             <span>type</span>
//             <span className="meta-value">
//               Enhancement <span className="dot enhancement" />
//             </span>
//           </div>

//           <div className="meta-row">
//             <span>severity</span>
//             <span className="meta-value">
//               Normal <span className="dot normal" />
//             </span>
//           </div>

//           <div className="meta-row">
//             <span>priority</span>
//             <span className="meta-value">
//               Normal <span className="dot prio-normal" />
//             </span>
//           </div>

//           <hr />

//           <div className="side-block">
//             <strong>ASSIGNED</strong>
//             <div className="side-actions">
//               <button>+ Add assigned</button>
//               <button className="link">Assign to me</button>
//             </div>
//           </div>

//           <div className="side-block">
//             <strong>WATCHERS</strong>
//             <div className="side-actions">
//               <button>+ Add watchers</button>
//               <button className="link">Watch</button>
//             </div>
//           </div>

//           <div className="issue-icons">
//             <button>⏱</button>
//             <button>📄</button>
//             <button>🔗</button>
//             <button>🔒</button>
//             <button>🗑</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authFetch } from "../../services/authFetch";

import "./IssueDetail.css";

const STATUS_OPTIONS = ["New", "In Progress", "Ready", "Closed"];

export default function IssueDetail() {
  const { slug, id } = useParams();
  const navigate = useNavigate();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD ISSUE ================= */

  useEffect(() => {
    const loadIssue = async () => {
      try {
        const issueData = await authFetch(`/issues/${id}/`);
        setIssue(issueData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadIssue();
  }, [id]);

  /* ================= UPDATE STATUS ================= */

  const updateStatus = async (status) => {
    try {
      const { updateIssue } = await import("../../services/issueService");
      const { stringToStatusNumber } = await import("../../services/statusMapping");
      
      const statusNumber = typeof status === 'string' ? stringToStatusNumber(status) : status;
      await updateIssue(id, { status: statusNumber });

      setIssue((prev) => ({ ...prev, status: statusNumber }));
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= DELETE ISSUE ================= */

  const deleteIssue = async () => {
    if (!window.confirm("Delete this issue?")) return;

    try {
      const { deleteIssue: deleteIssueService } = await import("../../services/issueService");
      await deleteIssueService(id);
      navigate(`/project/${slug}/issues`);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="issue-detail">Loading…</div>;
  if (!issue) return <div className="issue-detail">Issue not found</div>;

  return (
    <div className="issue-detail">
      {/* ===== HEADER ===== */}
      <div className="issue-detail__header">
        <h1>
          #{issue.id} {issue.title}
        </h1>

        <div className="issue-detail__status">
          <span className="status-text">OPEN</span>

          <select
            className="status-pill"
            value={issue.status || 1}
            onChange={(e) => updateStatus(parseInt(e.target.value))}
          >
            <option value={1}>New</option>
            <option value={2}>In Progress</option>
            <option value={3}>Ready For Test</option>
            <option value={4}>Done</option>
          </select>
        </div>
      </div>

      <div className="issue-detail__layout">
        {/* ===== LEFT ===== */}
        <div className="issue-detail__left">
          <span className="tag-link">Add tag +</span>

          <p className="issue-description">
            {issue.description || "No description"}
          </p>

          {/* COMMENTS (future) */}
          <div className="comments">
            <div className="comments-header">0 Comments</div>
            <textarea placeholder="Type a new comment here" />
          </div>
        </div>

        {/* ===== RIGHT ===== */}
        <div className="issue-detail__right">
          <div className="meta-row">
            <span>type</span>
            <span className="meta-value">
              {issue.type || "Question"}{" "}
              <span
                className={`dot ${String(issue.type || "question").toLowerCase()}`}
              />
            </span>
          </div>

          <hr />

          <div className="side-block">
            <strong>CREATED BY</strong>
            <div>{issue.created_by_username || issue.created_by || "-"}</div>
          </div>

          <div className="side-block">
            <strong>ASSIGNED</strong>
            <div>{issue.assigned_to_username || "Unassigned"}</div>
          </div>

          <div className="issue-icons">
            <button title="Delete issue" onClick={deleteIssue}>
              🗑
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

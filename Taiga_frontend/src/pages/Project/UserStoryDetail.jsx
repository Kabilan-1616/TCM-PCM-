
// import { useEffect, useState } from "react";
// import { useNavigate,useParams } from "react-router-dom";
// // import { authFetch } from "../../services/authFetch";
// import "./UserStoryDetail.css";
// import {
//   getStory,
//   updateStory,
//   deleteStory
// } from "../../services/userStoryService";
// import {
//   getTasksByStory,
//   createTask
// } from "../../services/taskService";



// const STATUS_OPTIONS = ["New", "Ready", "In Progress", "Done", "Archived"];

// export default function UserStoryDetail() {
//   const { id } = useParams();

//   const [story, setStory] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Editable fields
//   const [subject, setSubject] = useState("");
//   const [description, setDescription] = useState("");
//   const [status, setStatus] = useState("New");

//   const [saving, setSaving] = useState(false);
//   const [dirty, setDirty] = useState(false);
//   const [tasks, setTasks] = useState([]);
//   const [showTaskModal, setShowTaskModal] = useState(false);


//   const navigate = useNavigate();


//   useEffect(() => {
//     loadStory();
//   }, [id]);

//   const loadStory = async () => {
//     try {
//       const data = await getStory(id);
//       setStory(data);
//       setSubject(data.subject || "");
//       setDescription(data.description || "");
//       setStatus(data.status);
//       const taskData = await getTasksByStory(id);
//       setTasks(taskData);

//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= DELETE ================= */

//   const deleteStorydetail = async () => {
//         const confirmed = window.confirm(
//           "Are you sure you want to delete this user story?"
//         );

//         if (!confirmed) return;

//         try {
//           await deleteStory(id);

          

//           // Redirect to backlog
//           navigate(-1); // go back to backlog
//         } catch (err) {
//           console.error(err);
//           alert("Failed to delete user story");
//         }
//       };


//   /* ================= SAVE ================= */

//   const saveChanges = async () => {
//     try {
//       setSaving(true);

//       const updated = await updateStory(id, {
//         subject,
//         description,
//         status,
//       });

//       setStory(updated);
//       setDirty(false);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setSaving(false);
//     }
//   };


//   if (loading) return <div className="us-detail">Loading…</div>;
//   if (!story) return <div className="us-detail">Not found</div>;

//   return (
//     <div className="us-detail">
//       {/* HEADER */}
//       <div className="us-header">
//         <h1>
//           #{story.ref}
//           <input
//             className="us-subject-input"
//             value={subject}
//             onChange={(e) => {
//               setSubject(e.target.value);
//               setDirty(true);
//             }}
//           />
//         </h1>

//         <div className="us-status">
//           OPEN{" "}
//           <select
//             className="pill"
//             value={status}
//             onChange={(e) => {
//               setStatus(e.target.value);
//               setDirty(true);
//             }}
//           >
//             {STATUS_OPTIONS.map((s) => (
//               <option key={s}>{s}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <span className="us-type">USER STORY</span>

//       <div className="us-created">
//         Created at{" "}
//         <span>{new Date(story.created_at).toLocaleString()}</span>
//       </div>

//       {/* SAVE BAR */}
//       {dirty && (
//         <div className="us-save-bar">
//           <button
//             className="save-btn"
//             disabled={saving}
//             onClick={saveChanges}
//           >
//             {saving ? "Saving…" : "Save changes"}
//           </button>
//         </div>
//       )}

//       <div className="us-layout">
//         {/* LEFT */}
//         <div className="us-left">
//           <div className="tags">Add tag +</div>

//           <textarea
//             className="us-desc-input"
//             value={description}
//             placeholder="Add a description"
//             onChange={(e) => {
//               setDescription(e.target.value);
//               setDirty(true);
//             }}
//           />

//           {/* ATTACHMENTS */}
//           <div className="attachments">
//             <div className="attachments-header">
//               <span>0 Attachments</span>
//               <button>+</button>
//             </div>
//             <div className="dropzone">Drop attachments here!</div>
//           </div>

//           {/* COMMENTS */}
//           <div className="comments">
//             <h4>0 Comments</h4>
//             <textarea placeholder="Type a new comment here" />
//           </div>
//         </div>

//         {/* RIGHT (unchanged UI) */}
//         <div className="us-right">
//           <div className="points">
//             <h4>POINTS</h4>
//             <div>UX <span>?</span></div>
//             <div>Design <span>?</span></div>
//             <div>Front <span>?</span></div>
//             <div>Back <span>?</span></div>
//             <div className="total">total points <span>?</span></div>
//           </div>

//           <div className="assigned">
//             <h4>ASSIGNED</h4>
//             <div className="assignee">Unassigned</div>
//             <button>+ Add assigned</button>
//           </div>

//           <div className="watchers">
//             <h4>WATCHERS</h4>
//             <button>+ Add watchers</button>
//             <button className="link">Watch</button>
//           </div>

//           <div className="us-icons">
//             <button>⏱</button>
//             <button>👥</button>
//             <button>📁</button>
//             <button>🔒</button>
//             <button
//               className="danger"
//               title="Delete user story"
//               onClick={deleteStorydetail}
//             >
//               🗑
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TaskCreateModal from "../../components/TaskCreateModal/TaskCreateModal";
import { authFetch } from "../../services/authFetch";

import {
  getStory,
  updateStory,
  deleteStory
} from "../../services/userStoryService";

import {
  getTasksByStory,
  updateTask,
  deleteTask
} from "../../services/taskService";

import {
  getProjectMembers
} from "../../services/membershipService";

import "./UserStoryDetail.css";

const STATUS_OPTIONS = ["New", "Ready", "In Progress", "Done", "Archived"];

export default function UserStoryDetail() {
  const { id, slug } = useParams();
  const navigate = useNavigate();

  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("New");

  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  
  const [projectId, setProjectId] = useState(null);
  const [assigningTaskId, setAssigningTaskId] = useState(null);
  const [members, setMembers] = useState([]);
  const [assigningUsers, setAssigningUsers] = useState(new Set());

  useEffect(() => {
    loadStory();
  }, [id]);

  // Load project ID from slug
  useEffect(() => {
    const loadProject = async () => {
      if (!slug) return;
      try {
        const data = await authFetch(`/projects/?slug=${slug}`);
        if (Array.isArray(data) && data.length > 0) {
          setProjectId(data[0].id);
        }
      } catch (err) {
        console.error("Failed to load project", err);
      }
    };
    loadProject();
  }, [slug]);

  // Load members when project ID is available
  useEffect(() => {
    const loadMembers = async () => {
      if (!projectId) return;
      try {
        const data = await getProjectMembers(projectId);
        setMembers(data);
      } catch (err) {
        console.error("Failed to load members", err);
      }
    };
    loadMembers();
  }, [projectId]);

  const loadStory = async () => {
    try {
      setLoading(true);

      const data = await getStory(id);
      setStory(data);

      setSubject(data.title || "");
      setDescription(data.description || "");
      setStatus(data.status || 1);

      const taskData = await getTasksByStory(id);
      setTasks(taskData);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */

  const deleteStoryDetail = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user story?"
    );

    if (!confirmed) return;

    try {
      await deleteStory(id);
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("Failed to delete user story");
    }
  };

  /* ================= SAVE ================= */

  const saveChanges = async () => {
    try {
      setSaving(true);

      const { stringToStatusNumber, createSlug } = await import("../../services/statusMapping");
      
      const updated = await updateStory(id, {
        title: subject,
        slug: createSlug(subject),
        description,
        status: typeof status === 'string' ? stringToStatusNumber(status) : status,
      });

      setStory(updated);
      setDirty(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  /* ================= ASSIGN TASK ================= */

  const handleAssignTask = async (taskId, userId) => {
    setAssigningUsers((prev) => new Set(prev).add(userId));
    
    try {
      await updateTask(taskId, { assignee: userId });
      
      // Update task immediately with assignee info
      const assignedMember = members.find(m => m.user.id === userId);
      setTasks((prev) => 
        prev.map((task) => 
          task.id === taskId 
            ? { ...task, assignee: userId, assignee_username: assignedMember?.user.username }
            : task
        )
      );
      
      // Reload tasks to get updated assignee info from server
      const taskData = await getTasksByStory(id);
      setTasks(taskData);
      
      setAssigningTaskId(null);
    } catch (err) {
      console.error("Failed to assign task", err);
      alert("Failed to assign task. Please try again.");
    } finally {
      setAssigningUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  /* ================= DELETE TASK ================= */

  const handleDeleteTask = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      await deleteTask(taskId);
      
      // Remove task from the list
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error("Failed to delete task", err);
      alert("Failed to delete task. Please try again.");
    }
  };

  /* ================= GET ASSIGNEE NAME ================= */

  const getAssigneeName = (task) => {
    // If assignee_username is available, use it
    if (task.assignee_username) {
      return task.assignee_username;
    }
    
    // If assignee (user ID) is available, find the username from members
    if (task.assignee) {
      const member = members.find(m => m.user.id === task.assignee);
      if (member) {
        return member.user.username;
      }
      // If member not found, return the user ID
      return `User ID: ${task.assignee}`;
    }
    
    return null;
  };

  if (loading) return <div className="us-detail">Loading…</div>;
  if (!story) return <div className="us-detail">Not found</div>;

  return (
    <>
      <div className="us-detail">
        {/* HEADER */}
        <div className="us-header">
          <h1>
            #{story.id}
            <input
              className="us-subject-input"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setDirty(true);
              }}
            />
          </h1>

          <div className="us-status">
            OPEN{" "}
            <select
              className="pill"
              value={status}
              onChange={(e) => {
                setStatus(parseInt(e.target.value));
                setDirty(true);
              }}
            >
              <option value={1}>New</option>
              <option value={2}>In Progress</option>
              <option value={3}>Ready For Test</option>
              <option value={4}>Done</option>
            </select>
          </div>
        </div>

        <span className="us-type">USER STORY</span>

        <div className="us-created">
          Created at{" "}
          <span>{new Date(story.created_at).toLocaleString()}</span>
        </div>

        {/* SAVE BAR */}
        {dirty && (
          <div className="us-save-bar">
            <button
              className="save-btn"
              disabled={saving}
              onClick={saveChanges}
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        )}

        <div className="us-layout">
          {/* LEFT */}
          <div className="us-left">

            <div className="tags">Add tag +</div>

            <textarea
              className="us-desc-input"
              value={description}
              placeholder="Add a description"
              onChange={(e) => {
                setDescription(e.target.value);
                setDirty(true);
              }}
            />

            {/* ✅ TASK SECTION */}
            <div className="us-tasks">
              <h4>Tasks</h4>

              {tasks.length === 0 ? (
                <div className="us-task-empty">
                  No tasks yet.
                </div>
              ) : (
                tasks.map((task) => {
                  const assigneeName = getAssigneeName(task);
                  return (
                  <div key={task.id} className="us-task-row">
                    <div className="us-task-info">
                      <span className="us-task-id">#{task.id}</span>
                      <span className="us-task-title">{task.title}</span>
                      {assigneeName && (
                        <span className="us-task-assignee">
                          Assigned to: {assigneeName}
                        </span>
                      )}
                    </div>
                    <div className="us-task-actions">
                      <button
                        className="us-assign-btn"
                        onClick={() => setAssigningTaskId(task.id)}
                        title="Assign to"
                      >
                        Assign to
                      </button>
                      <button
                        className="us-delete-btn"
                        onClick={() => handleDeleteTask(task.id)}
                        title="Delete task"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  );
                })
              )}

              <button
                className="link"
                onClick={() => setShowTaskModal(true)}
              >
                + Add Task
              </button>
            </div>

            {/* ATTACHMENTS */}
            <div className="attachments">
              <div className="attachments-header">
                <span>0 Attachments</span>
                <button>+</button>
              </div>
              <div className="dropzone">
                Drop attachments here!
              </div>
            </div>

            {/* COMMENTS */}
            <div className="comments">
              <h4>0 Comments</h4>
              <textarea placeholder="Type a new comment here" />
            </div>

          </div>

          {/* RIGHT */}
          <div className="us-right">

            <div className="points">
              <h4>POINTS</h4>
              <div>UX <span>?</span></div>
              <div>Design <span>?</span></div>
              <div>Front <span>?</span></div>
              <div>Back <span>?</span></div>
              <div className="total">total points <span>?</span></div>
            </div>

            <div className="assigned">
              <h4>ASSIGNED</h4>
              <div className="assignee">Unassigned</div>
              <button>+ Add assigned</button>
            </div>

            <div className="watchers">
              <h4>WATCHERS</h4>
              <button>+ Add watchers</button>
              <button className="link">Watch</button>
            </div>

            <div className="us-icons">
              <button>⏱</button>
              <button>👥</button>
              <button>📁</button>
              <button>🔒</button>
              <button
                className="danger"
                title="Delete user story"
                onClick={deleteStoryDetail}
              >
                🗑
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ✅ TASK MODAL */}
      {showTaskModal && (
        <TaskCreateModal
          projectSlug={story.project_slug}
          userstoryId={story.id}
          onClose={() => setShowTaskModal(false)}
          onCreated={(task) =>
            setTasks((prev) => [...prev, task])
          }
        />
      )}

      {/* ✅ ASSIGN MEMBER MODAL */}
      {assigningTaskId && (
        <div 
          className="assign-overlay" 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setAssigningTaskId(null);
            }
          }}
        >
          <div className="assign-modal">
            <button 
              className="assign-close" 
              onClick={() => setAssigningTaskId(null)}
              aria-label="Close"
            >
              ✕
            </button>

            <h2>Assign Task #{assigningTaskId}</h2>
            <p className="assign-subtitle">Select a member to assign this task to:</p>

            {members.length === 0 ? (
              <div className="assign-empty">No members available.</div>
            ) : (
              <div className="member-list">
                {members.map((membership) => (
                  <div key={membership.id} className="member-item">
                    <div className="member-item__avatar">
                      {membership.user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="member-item__info">
                      <div className="member-item__name">{membership.user.username}</div>
                      <div className="member-item__email">{membership.user.email}</div>
                      {membership.user.role && (
                        <div className="member-item__role">{membership.user.role}</div>
                      )}
                    </div>
                    <button
                      className="member-item__assign-btn"
                      onClick={() => handleAssignTask(assigningTaskId, membership.user.id)}
                      disabled={assigningUsers.has(membership.user.id)}
                      title="Assign to this member"
                    >
                      {assigningUsers.has(membership.user.id) ? (
                        <span className="assign-btn-spinner">⏳</span>
                      ) : (
                        "+"
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

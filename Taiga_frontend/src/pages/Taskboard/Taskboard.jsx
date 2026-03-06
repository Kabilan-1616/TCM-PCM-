

// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { authFetch } from "../../services/api";
// import "./Taskboard.css";

// const STATUS_COLUMNS = [
//   { key: "New", label: "NEW" },
//   { key: "In Progress", label: "IN PROGRESS" },
//   { key: "Ready for Test", label: "READY FOR TEST" },
//   { key: "Done", label: "CLOSED" },
// ];

// export default function Taskboard() {
//   const { slug, sprintId } = useParams();
//   const navigate = useNavigate();

//   const [stories, setStories] = useState([]);
//   const [sprint, setSprint] = useState(null);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const [storiesRes, sprintRes] = await Promise.all([
//           authFetch(`/userstories/?project__slug=${slug}&sprint=${sprintId}`),
//           authFetch(`/sprints/${sprintId}/`),
//         ]);

//         if (storiesRes.ok) setStories(await storiesRes.json());
//         if (sprintRes.ok) setSprint(await sprintRes.json());
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     loadData();
//   }, [slug, sprintId]);

//   const updateStatus = async (storyId, status) => {
//     await authFetch(`/userstories/${storyId}/`, {
//       method: "PATCH",
//       body: JSON.stringify({ status }),
//     });

//     setStories((prev) =>
//       prev.map((s) => (s.id === storyId ? { ...s, status } : s))
//     );
//   };

//   const deleteSprint = async () => {
//     const confirmed = window.confirm(
//       "Are you sure you want to delete this sprint?\nAll stories will move back to backlog."
//     );

//     if (!confirmed) return;

//     try {
//       await authFetch(`/sprints/${sprintId}/`, {
//         method: "DELETE",
//       });

//       navigate(`/project/${slug}/backlog`);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <>
//       {/* ===== SPRINT HEADER ===== */}
//       <div className="taskboard-header">
//         <div>
//           <h2>{sprint?.name || "Sprint"}</h2>
//           <span className="dates">
//             {sprint?.start_date} → {sprint?.end_date}
//           </span>
//         </div>

//         <button className="danger-btn" onClick={deleteSprint}>
//           Delete Sprint
//         </button>
//       </div>

//       {/* ===== TASKBOARD ===== */}
//       <div className="taskboard">
//         {STATUS_COLUMNS.map((column) => (
//           <div key={column.key} className="taskboard-column">
//             <div className="column-header">
//               <h4>{column.label}</h4>
//               <span className="count">
//                 {stories.filter((s) => s.status === column.key).length}
//               </span>
//             </div>

//             <div className="column-body">
//               {stories
//                 .filter((s) => s.status === column.key)
//                 .map((story) => (
//                   <div key={story.id} className="task-card">
//                     <span className="ref">#{story.ref}</span>
//                     <div className="task-title">{story.subject}</div>

//                     <select
//                       value={story.status}
//                       onChange={(e) =>
//                         updateStatus(story.id, e.target.value)
//                       }
//                     >
//                       {STATUS_COLUMNS.map((c) => (
//                         <option key={c.key} value={c.key}>
//                           {c.label}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// }


import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  getSprintStories
} from "../../services/userStoryService";

import {
  getTasksByStory
} from "../../services/taskService";

import {
  deleteSprint,
  getSprint
} from "../../services/sprintService";


import TaskCreateModal from "../../components/TaskCreateModal/TaskCreateModal";
import "./Taskboard.css";

const STATUS_COLUMNS = [
  { key: 1, label: "NEW" },
  { key: 2, label: "IN PROGRESS" },
  { key: 3, label: "READY FOR TEST" },
  { key: 4, label: "DONE" },
];

const STATUS_LABELS = {
  1: "NEW",
  2: "IN PROGRESS",
  3: "READY FOR TEST",
  4: "DONE",
};


export default function Taskboard() {
  const { slug, sprintId } = useParams();
  const navigate = useNavigate();

  const [stories, setStories] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [sprint, setSprint] = useState(null);

  const [activeStory, setActiveStory] = useState(null);
  const [collapsedStories, setCollapsedStories] = useState(() => new Set());

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const storiesData = await getSprintStories(slug, sprintId);
        setStories(storiesData);

        const sprintData = await getSprint(sprintId);
        setSprint(sprintData);

        const taskLists = await Promise.all(
          storiesData.map((s) => getTasksByStory(s.id))
        );

        setTasks(taskLists.flat());
      } catch (err) {
        console.error(err);
      }
    };


    loadData();
  }, [slug, sprintId]);

  /* ================= TASK STATUS UPDATE ================= */
  const updateTaskStatus = async (taskId, status) => {
    const { updateTask } = await import("../../services/taskService");
    
    const statusNumber = typeof status === 'string' ? parseInt(status) : status;
    await updateTask(taskId, { 
      status: statusNumber
    });

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: statusNumber } : t))
    );
  };

  const toggleStoryCollapsed = (storyId) => {
    setCollapsedStories((prev) => {
      const next = new Set(prev);
      if (next.has(storyId)) next.delete(storyId);
      else next.add(storyId);
      return next;
    });
  };

  const tasksForCell = (storyId, statusKey) => {
    return tasks.filter(
      (t) => t.user_story === storyId && t.status === statusKey
    );
  };

  /* ================= DELETE SPRINT ================= */
  const handleDeleteSprint = async () => {
    if (!window.confirm("Delete this sprint?")) return;

    try {
      await deleteSprint(sprintId);
      navigate(`/project/${slug}/backlog`);
    } catch (err) {
      console.error("Failed to delete sprint", err);
    }
  };

  return (
    <>
      {/* ===== HEADER ===== */}
      <div className="taskboard-header">
        <div>
          <h2>{sprint?.name || "Sprint"}</h2>
          <span className="dates">
            {sprint?.start_date} → {sprint?.end_date}
          </span>
        </div>

        <button className="danger-btn" onClick={handleDeleteSprint}>
          Delete Sprint
        </button>
      </div>

      {/* ===== BOARD ===== */}
      <div className="taskboard-grid">
        {/* ===== GRID HEADER ===== */}
        <div className="taskboard-grid__cell taskboard-grid__header taskboard-grid__cell--story">
          USER STORY
        </div>
        {STATUS_COLUMNS.map((c) => (
          <div
            key={c.key}
            className={`taskboard-grid__cell taskboard-grid__header taskboard-grid__cell--status taskboard-grid__cell--status-${c.key}`}
          >
            {c.label}
          </div>
        ))}

        {/* ===== STORY ROWS ===== */}
        {stories.map((story) => {
          const isCollapsed = collapsedStories.has(story.id);

          return (
            <div key={story.id} className="taskboard-grid__row">
              <div className="taskboard-grid__cell taskboard-grid__cell--story">
                <div className="story-cell">
                  <button
                    className="story-toggle"
                    onClick={() => toggleStoryCollapsed(story.id)}
                    title={isCollapsed ? "Expand" : "Collapse"}
                  >
                    {isCollapsed ? "▸" : "▾"}
                  </button>

                  <div className="story-main">
                    <div
                      className="story-title"
                      onClick={() => navigate(`/project/${slug}/us/${story.id}`)}
                      title={story.title}
                    >
                      <span className="story-ref">#{story.id}</span> {story.title}
                    </div>
                  </div>

                  <div className="story-actions">
                    <button
                      className="story-action-btn"
                      title="Add task"
                      onClick={() => setActiveStory(story)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {STATUS_COLUMNS.map((col) => (
                <div
                  key={col.key}
                  className={`taskboard-grid__cell taskboard-grid__cell--status taskboard-grid__cell--status-${col.key}`}
                >
                  {!isCollapsed && (
                    <div className="task-cell">
                      {tasksForCell(story.id, col.key).map((task) => (
                        <div key={task.id} className="task-card">
                          <div className="task-card__top">
                            <span className="ref">#{task.id}</span>

                            <select
                              className="task-status"
                              value={task.status}
                              onChange={(e) =>
                                updateTaskStatus(task.id, parseInt(e.target.value))
                              }
                              title="Change status"
                            >
                              {STATUS_COLUMNS.map((c) => (
                                <option key={c.key} value={c.key}>
                                  {STATUS_LABELS[c.key]}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="task-title">{task.title}</div>
                          <div className="task-meta">Not assigned</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })}

        {/* ===== STORYLESS TASKS ROW (visual parity) ===== */}
        <div className="taskboard-grid__row taskboard-grid__row--storyless">
          <div className="taskboard-grid__cell taskboard-grid__cell--story">
            <div className="storyless">
              <span className="storyless__label">Storyless tasks</span>
            </div>
          </div>
          {STATUS_COLUMNS.map((col) => (
            <div
              key={col.key}
              className={`taskboard-grid__cell taskboard-grid__cell--status taskboard-grid__cell--status-${col.key}`}
            />
          ))}
        </div>
      </div>

      {/* ===== TASK MODAL ===== */}
      {activeStory && (
        <TaskCreateModal
          projectSlug={slug}
          userstoryId={activeStory.id}
          onClose={() => setActiveStory(null)}
          onCreated={(task) =>
            setTasks((prev) => [...prev, task])
          }
        />
      )}
    </>
  );
}

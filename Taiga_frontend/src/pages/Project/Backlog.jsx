

// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import UserStoryModal from "../../components/UserStoryModal/UserStoryModal";
// import SprintModal from "../../components/SprintModal/SprintModal";
// import {
//   getBacklogStories,
//   getSprintStories,
//   createStory,
//   updateStory
// } from "../../services/userStoryService";

// import {
//   getTasksByStory,
//   createTask
// } from "../../services/taskService";

// import { createSprint } from "../../services/sprintService";


// import "./Backlog.css";

// const STATUS_OPTIONS = ["New", "Ready", "In Progress", "Done"];
// const POINT_OPTIONS = ["?", 1, 2, 3, 5, 8];

// export default function Backlog() {
//   const [showModal, setShowModal] = useState(false);
//   const [stories, setStories] = useState([]); // backlog stories
//   const [sprints, setSprints] = useState([]);
//   const [sprintStories, setSprintStories] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [showSprintModal, setShowSprintModal] = useState(false);
//   const [storyTasks, setStoryTasks] = useState({});
//   const [activeStory, setActiveStory] = useState(null);

//   const navigate = useNavigate();
//   const { slug } = useParams();

//   /* ================= FETCH BACKLOG STORIES ================= */

//   // const loadStories = async () => {
//   //   try {
//   //     setLoading(true);
//   //     const res = await authFetch(
//   //       `/userstories/?project__slug=${slug}&sprint__isnull=true`
//   //     );
//   //     if (!res.ok) throw new Error("Failed to load backlog stories");
//   //     setStories(await res.json());
//   //   } catch (err) {
//   //     console.error(err);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//     // const loadBacklogStories = async () => {
//     //     try {
//     //       setLoading(true);

//     //       const res = await authFetch(
//     //         `/userstories/?project__slug=${slug}&sprint__isnull=true`
//     //       );

//     //       if (!res.ok) throw new Error("Failed to load backlog stories");

//     //       setStories(await res.json());
//     //     } catch (err) {
//     //       console.error(err);
//     //     } finally {
//     //       setLoading(false);
//     //     }
//     //   };
//     const loadBacklogStories = async () => {
//       try {
//         setLoading(true);
//         const data = await getBacklogStories(slug);
//         setStories(data);

//         // Load tasks for each story
//         const taskLists = await Promise.all(
//           data.map((story) => getTasksByStory(story.id))
//         );

//         const taskMap = {};
//         data.forEach((story, index) => {
//           taskMap[story.id] = taskLists[index];
//         });

//         setStoryTasks(taskMap);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };


//   /* ================= FETCH SPRINTS ================= */

//   const loadSprints = async () => {
//     try {
//       const res = await authFetch(`/sprints/?project_slug=${slug}`);
//       if (!res.ok) throw new Error("Failed to load sprints");
//       const sprintList = await res.json();
//       setSprints(sprintList);

//       // fetch stories per sprint
//       const map = {};
//       for (const sprint of sprintList) {
//         const r = await authFetch(
//           `/userstories/?project__slug=${slug}&sprint=${sprint.id}`
//         );
//         map[sprint.id] = r.ok ? await r.json() : [];
//       }
//       setSprintStories(map);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     loadBacklogStories();
//     loadSprints();
//   }, [slug]);

//   /* ================= MOVE STORY ================= */

//   const moveStoryToSprint = async (storyId, sprintId) => {
//       try {
//         await authFetch(`/userstories/${storyId}/`, {
//           method: "PATCH",
//           body: JSON.stringify({
//             sprint: sprintId,
//           }),
//         });
//         await loadBacklogStories();
//         await loadSprints();
//         //   if (!res.ok) throw new Error("Failed to move story");

//         //   const updatedStory = await res.json();

//         // // Remove from backlog UI immediately
//         // setStories((prev) => prev.filter((s) => s.id !== storyId));
//         // setSprintStories((prev) => ({
//         //   ...prev,
//         //   [sprintId]: [...(prev[sprintId] || []), updatedStory],
//         // }));

//       } catch (err) {
//         console.error(err);
//       }
//     };

//   const removeFromSprint = async (storyId,sprintId) => {
//     try {
//        await authFetch(`/userstories/${storyId}/`, {
//         method: "PATCH",
//         body: JSON.stringify({ sprint: null }),
//       });
//       //  if (!res.ok) throw new Error("Failed to remove from sprint");

//       //   const updatedStory = await res.json();

//       // // Remove from sprint UI
//       //   setSprintStories((prev) => ({
//       //     ...prev,
//       //     [sprintId]: prev[sprintId].filter((s) => s.id !== storyId),
//       //   }));

//       //   // Add back to backlog
//       //   setStories((prev) => [...prev, updatedStory]);
//       await loadBacklogStories();
//       await loadSprints();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   /* ================= CREATE STORY ================= */

//   const onCreateStory = async (story) => {
//     try {
//       const res = await authFetch("/userstories/", {
//         method: "POST",
//         body: JSON.stringify({
//           subject: story.subject,
//           description: story.description,
//           status: story.status,
//           project_slug: slug,
//         }),
//       });
//       if (!res.ok) throw new Error("Failed to create story");
//       const created = await res.json();
//       setStories((prev) => [...prev, created]);
//       setShowModal(false);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   /* ================= CREATE SPRINT ================= */

//   const createSprint = async (sprint) => {
//     try {
//       const res = await authFetch("/sprints/", {
//         method: "POST",
//         body: JSON.stringify({
//           ...sprint,
//           project_slug: slug,
//           is_active: true,
//         }),
//       });
//       if (!res.ok) throw new Error("Failed to create sprint");
//       const created = await res.json();
//       setSprints((prev) => [...prev, created]);
//       setShowSprintModal(false);
//     } catch (err) {
//       console.error(err);
//     }
//   };
//   const updateStatus = (id, status) => {
//       setStories((prev) =>
//         prev.map((s) => (s.id === id ? { ...s, status } : s))
//       );
//     };
//     const updatePoints = (id, points) => {
//       setStories((prev) =>
//         prev.map((s) => (s.id === id ? { ...s, points } : s))
//       );
//     };

//   return (
//     <>
//       <div className="backlog">
//         {/* ===== HEADER ===== */}
//         <div className="backlog__header">
//           <h2>Scrum</h2>
//           <div className="backlog__stats">
//             <div className="progress-box" />
//             <div className="stats-text">
//               <span className="percent">0%</span>
//               <span>0 defined points</span>
//               <span>0 closed points</span>
//               <span>0 points / sprint</span>
//             </div>
//           </div>
//         </div>

//         {/* ===== GRAPH + SPRINTS ===== */}
//         <div className="backlog__top">
//           <div className="graph-hint">
//             <div className="bars" />
//             <div>
//               <strong>CUSTOMIZE YOUR BACKLOG GRAPH</strong>
//               <p>
//                 To have a nice graph that helps you follow the evolution of the
//                 project you have to set up the points and sprints through the{" "}
//                 <span className="link">Admin</span>
//               </p>
//             </div>
//           </div>

//           <div className="sprints">
//             <h4>SPRINTS</h4>

//             {sprints.map((sprint) => (
//               <div key={sprint.id} className="sprint-card">
//                 <strong>{sprint.name}</strong>
//                 <div className="sprint-dates">
//                   {sprint.start_date} → {sprint.end_date}
//                 </div>

//                 {(sprintStories[sprint.id] || []).map((story) => (
//                   <div key={story.id} className="story-row">
//                     <span>#{story.ref} {story.subject}</span>
//                     <button
//                       className="link"
//                       onClick={() => removeFromSprint(story.id,sprint.id)}
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 ))}

//                 <button
//                   className="link"
//                   onClick={() =>
//                     navigate(`/project/${slug}/taskboard/${sprint.id}`)
//                   }
//                 >
//                   Sprint Taskboard
//                 </button>
//               </div>
//             ))}

//             <button className="link-btn" onClick={() => setShowSprintModal(true)}>
//               Add a sprint +
//             </button>
//           </div>
//         </div>

//         {/* ===== BACKLOG LIST ===== */}
//         <div className="backlog__list">
//           <div className="list-header">
//             <h3>
//               Backlog <span className="muted">{stories.length} user stories</span>
//             </h3>
//             <button className="primary-btn" onClick={() => setShowModal(true)}>
//               + USER STORY
//             </button>
//           </div>

//           {loading ? (
//             <div className="empty-state">Loading…</div>
//           ) : stories.length === 0 ? (
//             <div className="empty-state">The backlog is empty!</div>
//           ) : (
//             // <div className="story-list">
//             //   {stories.map((story) => (
//             //     <div key={story.id} className="story-row">
//             //       <span>
//             //         #{story.ref} {story.subject}
//             //       </span>

//             //       <select
//             //         onChange={(e) =>
//             //           moveStoryToSprint(story.id, e.target.value)
//             //         }
//             //         defaultValue=""
//             //       >
//             //         <option value="" disabled>
//             //           Move to sprint
//             //         </option>
//             //         {sprints.map((s) => (
//             //           <option key={s.id} value={s.id}>
//             //             {s.name}
//             //           </option>
//             //         ))}
//             //       </select>
//             //     </div>
//             //   ))}
//             // </div>
//             <div className="story-list">
//                 {stories.map((story) => (
//                   <div
//                     key={story.id}
//                     className="story-row"
//                     onClick={() => navigate(`/project/${slug}/us/${story.id}`)}
//                   >
//                     {/* LEFT */}
//                     <div className="story-left">
//                       <span className="story-id">#{story.ref}</span>
//                       <span className="story-title">{story.subject}</span>
//                     </div>

//                     {/* RIGHT */}
//                     <div
//                       className="story-right"
//                       onClick={(e) => e.stopPropagation()}
//                     >
//                       {/* Status */}
//                       <select
//                         className="story-status"
//                         value={story.status || "New"}
//                         onChange={(e) =>
//                           updateStatus(story.id, e.target.value)
//                         }
//                       >
//                         {STATUS_OPTIONS.map((s) => (
//                           <option key={s}>{s}</option>
//                         ))}
//                       </select>

//                       {/* Points */}
//                       <select
//                         className="story-points"
//                         value={story.points || "?"}
//                         onChange={(e) =>
//                           updatePoints(story.id, e.target.value)
//                         }
//                       >
//                         {POINT_OPTIONS.map((p) => (
//                           <option key={p}>{p}</option>
//                         ))}
//                       </select>

//                       {/* Move to Sprint */}
//                       <select
//                         className="story-sprint"
//                         defaultValue=""
//                         onChange={(e) =>
//                           moveStoryToSprint(story.id, e.target.value)
//                         }
//                       >
//                         <option value="" disabled>
//                           Move to sprint
//                         </option>
//                         {sprints.map((s) => (
//                           <option key={s.id} value={s.id}>
//                             {s.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//           )}
//         </div>
//       </div>

//       {showModal && (
//         <UserStoryModal onClose={() => setShowModal(false)} onCreate={onCreateStory} />
//       )}

//       {showSprintModal && (
//         <SprintModal onClose={() => setShowSprintModal(false)} onSave={createSprint} />
//       )}
//       {activeStory && (
//         <TaskCreateModal
//           projectSlug={slug}
//           userstoryId={activeStory.id}
//           onClose={() => setActiveStory(null)}
//           onCreated={(task) =>
//             setStoryTasks((prev) => ({
//               ...prev,
//               [activeStory.id]: [...(prev[activeStory.id] || []), task],
//             }))
//           }
//         />
//       )}

//     </>
//   );
// }

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserStoryModal from "../../components/UserStoryModal/UserStoryModal";
import SprintModal from "../../components/SprintModal/SprintModal";
import TaskCreateModal from "../../components/TaskCreateModal/TaskCreateModal";

import {
  getBacklogStories,
  createStory,
  updateStory
} from "../../services/userStoryService";

import {
  getTasksByStory
} from "../../services/taskService";

import { getSprints, createSprint } from "../../services/sprintService";
import { getSprintStories } from "../../services/userStoryService";


import "./Backlog.css";

const STATUS_OPTIONS = ["New", "Ready", "In Progress", "Done"];
const POINT_OPTIONS = ["?", 1, 2, 3, 5, 8];

export default function Backlog() {
  const [showModal, setShowModal] = useState(false);
  const [stories, setStories] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [sprintStories, setSprintStories] = useState({});
  const [loading, setLoading] = useState(true);
  const [showSprintModal, setShowSprintModal] = useState(false);

  const [storyTasks, setStoryTasks] = useState({});
  const [activeStory, setActiveStory] = useState(null);

  const navigate = useNavigate();
  const { slug } = useParams();

  /* ================= LOAD BACKLOG ================= */

  const loadBacklogStories = async () => {
    try {
      setLoading(true);

      const data = await getBacklogStories(slug);
      setStories(data);

      // Load tasks per story
      const taskLists = await Promise.all(
        data.map((story) => getTasksByStory(story.id))
      );

      const taskMap = {};
      data.forEach((story, index) => {
        taskMap[story.id] = taskLists[index];
      });

      setStoryTasks(taskMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD SPRINTS ================= */

  // const loadSprints = async () => {
  //   try {
  //     const sprintList = await getSprints(slug);
  //     setSprints(sprintList);

  //     const map = {};

  //     for (const sprint of sprintList) {
  //       map[sprint.id] = await getBacklogStories(slug);
  //     }

  //     setSprintStories(map);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
    const loadSprints = async () => {
      try {
        const sprintList = await getSprints(slug);
        setSprints(sprintList);

        const map = {};

        for (const sprint of sprintList) {
          const stories = await getSprintStories(slug, sprint.id);
          map[sprint.id] = stories;
        }

        setSprintStories(map);
      } catch (err) {
        console.error(err);
      }
    };


  useEffect(() => {
    loadBacklogStories();
    loadSprints();
  }, [slug]);

  /* ================= MOVE STORY ================= */

  const moveStoryToSprint = async (storyId, sprintId) => {
    try {
      await updateStory(storyId, { sprint: sprintId });
      await loadBacklogStories();
      await loadSprints();
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromSprint = async (storyId) => {
    try {
      await updateStory(storyId, { sprint: null });
      await loadBacklogStories();
      await loadSprints();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= CREATE STORY ================= */

  const onCreateStory = async (story) => {
    try {
      const created = await createStory({
        title: story.title,
        slug: story.slug,
        description: story.description,
        priority: story.priority || 1,
        project_slug: slug,
      });

      setStories((prev) => [...prev, created]);
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= CREATE SPRINT ================= */

  const handleCreateSprint = async (sprint) => {
    try {
      const created = await createSprint({
        name: sprint.name,
        slug: sprint.name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        project_slug: slug,
        start_date: sprint.start_date,
        end_date: sprint.end_date,
      });

      setSprints((prev) => [...prev, created]);
      setShowSprintModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await updateStory(id, { status });
      setStories((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status } : s))
      );
    } catch (err) {
      console.error("Failed to update story status", err);
    }
  };

  const updatePoints = (id, points) => {
    setStories((prev) =>
      prev.map((s) => (s.id === id ? { ...s, points } : s))
    );
  };

  return (
    <>
      <div className="backlog">
        <div className="backlog__header">
          <h2>Scrum</h2>
          <div className="backlog__stats">
            <div className="progress-box" />
            <div className="stats-text">
              <span className="percent">0%</span>
              <span>0 defined points</span>
              <span>0 closed points</span>
              <span>0 points / sprint</span>
            </div>
          </div>
        </div>

        {/* ===== SPRINTS SECTION ===== */}
        <div className="backlog__sprints">
          <h3>SPRINTS</h3>
          
          {sprints.length === 0 ? (
            <div className="sprints-empty">
              <p className="empty-text">There are no sprints yet</p>
              <button className="link-btn" onClick={() => setShowSprintModal(true)}>
                Add a sprint +
              </button>
            </div>
          ) : (
            <>
              {sprints.map((sprint) => (
                <div key={sprint.id} className="sprint-item">
                  <div className="sprint-header">
                    <h4>{sprint.name}</h4>
                    <span className="sprint-dates">
                      {sprint.start_date} → {sprint.end_date}
                    </span>
                  </div>

                  <div className="sprint-stories">
                    {(sprintStories[sprint.id] || []).length === 0 ? (
                      <p className="sprint-empty-text">No stories in this sprint</p>
                    ) : (
                      (sprintStories[sprint.id] || []).map((story) => (
                        <div key={story.id} className="sprint-story-row">
                          <span
                            className="sprint-story-link"
                            onClick={() => navigate(`/project/${slug}/us/${story.id}`)}
                          >
                            #{story.id} {story.title}
                          </span>
                          <button
                            className="remove-btn"
                            onClick={() => removeFromSprint(story.id)}
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <button
                    className="sprint-taskboard-btn"
                    onClick={() =>
                      navigate(`/project/${slug}/taskboard/${sprint.id}`)
                    }
                  >
                    Sprint Taskboard
                  </button>
                </div>
              ))}

              <button className="link-btn" onClick={() => setShowSprintModal(true)}>
                Add a sprint +
              </button>
            </>
          )}
        </div>

        {/* ===== BACKLOG LIST ===== */}
        <div className="backlog__list">
          <div className="list-header">
            <h3>
              Backlog <span className="muted">{stories.length} user stories</span>
            </h3>
            <button className="primary-btn" onClick={() => setShowModal(true)}>
              + USER STORY
            </button>
          </div>

          {loading ? (
            <div className="empty-state">Loading…</div>
          ) : stories.length === 0 ? (
            <div className="empty-state">The backlog is empty!</div>
          ) : (
            <div className="story-list">
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="story-row"
                  onClick={() => navigate(`/project/${slug}/us/${story.id}`)}
                >
                  <div className="story-left">
                    <span className="story-id">#{story.id}</span>
                    <span className="story-title">{story.title}</span>
                  </div>

                  <div
                    className="story-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <select
                      className="story-status"
                      value={story.status || 1}
                      onChange={(e) =>
                        updateStatus(story.id, parseInt(e.target.value))
                      }
                    >
                      <option value={1}>New</option>
                      <option value={2}>In Progress</option>
                      <option value={3}>Ready For Test</option>
                      <option value={4}>Done</option>
                    </select>

                    <select
                      className="story-points"
                      value={story.points || "?"}
                      onChange={(e) =>
                        updatePoints(story.id, e.target.value)
                      }
                    >
                      {POINT_OPTIONS.map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>

                    <select
                      className="story-sprint"
                      defaultValue=""
                      onChange={(e) =>
                        moveStoryToSprint(story.id, e.target.value)
                      }
                    >
                      <option value="" disabled>
                        Move to sprint
                      </option>
                      {sprints.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>

                    {/* ✅ ADD TASK BUTTON */}
                    <button
                      className="link"
                      onClick={() => setActiveStory(story)}
                    >
                      + Task
                    </button>
                  </div>

                  {/* ✅ SHOW TASKS UNDER STORY */}
                  {(storyTasks[story.id] || []).map((task) => (
                    <div key={task.id} className="task-inline">
                      #{task.id} {task.title}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <UserStoryModal
          onClose={() => setShowModal(false)}
          onCreate={onCreateStory}
        />
      )}

      {showSprintModal && (
        <SprintModal
          onClose={() => setShowSprintModal(false)}
          onSave={handleCreateSprint}
        />
      )}

      {activeStory && (
        <TaskCreateModal
          projectSlug={slug}
          userstoryId={activeStory.id}
          onClose={() => setActiveStory(null)}
          onCreated={(task) =>
            setStoryTasks((prev) => ({
              ...prev,
              [activeStory.id]: [
                ...(prev[activeStory.id] || []),
                task,
              ],
            }))
          }
        />
      )}
    </>
  );
}

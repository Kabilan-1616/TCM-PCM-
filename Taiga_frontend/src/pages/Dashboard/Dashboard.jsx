// // import Header from "../../components/Header/Header";
// // import Tabs from "../../components/Tabs/Tabs";
// // import EmptyCard from "../../components/EmptyCard/EmptyCard";
// // import SkeletonItem from "../../components/SkeletonItem/SkeletonItem";
// // import { useNavigate } from "react-router-dom";
// // import { fetchProjects } from "../../services/projects";
// // import "./Dashboard.css";

// // export default function Dashboard() {
// //   const navigate = useNavigate();

// //   return (
// //     <>
// //       <Header variant="dashboard" />

// //       <main className="dashboard">
// //         <h1 className="dashboard__title">Projects Dashboard</h1>

// //         <Tabs tabs={["Working on", "Watching"]} active="Working on" />

// //         <div className="dashboard__content">
// //           {/* Working on */}
// //           <section>
// //             <p className="dashboard__hint">
// //               It feels empty, doesn’t it? Start working with Taiga and
// //               you’ll see here the stories, tasks and issues you are
// //               working on.
// //             </p>

// //             <SkeletonItem />
// //             <SkeletonItem />
// //           </section>

// //           {/* Watching */}
// //           <section>
// //             <p className="dashboard__hint">
// //               Follow user stories, tasks, issues in your projects and
// //               be notified about their changes :)
// //             </p>

// //             <SkeletonItem />
// //             <SkeletonItem />
// //           </section>

// //           {/* New Project */}
// //           <EmptyCard
// //             onNewProject={() => navigate("/project/new")}
// //           />
// //         </div>
// //       </main>
// //     </>
// //   );
// // }

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import Header from "../../components/Header/Header";
// import Tabs from "../../components/Tabs/Tabs";
// import EmptyCard from "../../components/EmptyCard/EmptyCard";
// import SkeletonItem from "../../components/SkeletonItem/SkeletonItem";

// import { fetchProjects } from "../../services/projects";

// import "./Dashboard.css";

// export default function Dashboard() {
//   const navigate = useNavigate();

//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchProjects()
//       .then((data) => setProjects(data))
//       .catch(() => setError("Failed to load projects"))
//       .finally(() => setLoading(false));
//   }, []);

//   return (
//     <>
//       <Header variant="dashboard" />

//       <main className="dashboard">
//         <div className="dashboard__header">
//           <h1 className="dashboard__title">Projects Dashboard</h1>

//           <button
//             className="dashboard__new-project"
//             onClick={() => navigate("/project/new")}
//           >
//             + New project
//           </button>
//         </div>


//         <Tabs tabs={["Working on", "Watching"]} active="Working on" />

//         <div className="dashboard__content">
//           {/* ================= WORKING ON ================= */}
//           <section>
//             <p className="dashboard__hint">
//               It feels empty, doesn’t it? Start working with Taiga and
//               you’ll see here the stories, tasks and issues you are
//               working on.
//             </p>

//             {loading && (
//               <>
//                 <SkeletonItem />
//                 <SkeletonItem />
//               </>
//             )}

//             {!loading && projects.length > 0 && (
//               <div className="dashboard__projects">
//                 {projects.map((project) => (
//                   <div
//                     key={project.id}
//                     className="project-card"
//                     onClick={() =>
//                       navigate(`/project/${project.slug}/backlog`)
//                     }
//                   >
//                     <div className="project-card__name">
//                       {project.name}
//                     </div>
//                     <div className="project-card__slug">
//                       {project.slug}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </section>

//           {/* ================= WATCHING ================= */}
//           <section>
//             <p className="dashboard__hint">
//               Follow user stories, tasks, issues in your projects and
//               be notified about their changes :)
//             </p>

//             <SkeletonItem />
//             <SkeletonItem />
//           </section>

//           {/* ================= NEW PROJECT ================= */}
//           {!loading && projects.length === 0 && (
//             <EmptyCard
//               onNewProject={() => navigate("/project/new")}
//             />
//           )}

//           {error && (
//             <div className="form-error">
//               {error}
//             </div>
//           )}
//         </div>
//       </main>
//     </>
//   );
// }

import Header from "../../components/Header/Header";
import Tabs from "../../components/Tabs/Tabs";
import SkeletonItem from "../../components/SkeletonItem/SkeletonItem";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// import { fetchProjects } from "../../services/projects";
import { getProjects } from "../../services/projectService";
import { getMyTasks } from "../../services/taskService";

import "./Dashboard.css";

const STATUS_LABELS = {
  1: "NEW",
  2: "IN PROGRESS",
  3: "READY FOR TEST",
  4: "DONE",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    getMyTasks()
      .then(setTasks)
      .catch((err) => {
        console.error("Failed to load tasks", err);
        setTasks([]);
      })
      .finally(() => setTasksLoading(false));
  }, []);

  return (
    <>
      <Header variant="dashboard" />

      <main className="dashboard">
        <div className="dashboard__header">
          <h1 className="dashboard__title">Projects Dashboard</h1>

          <button
            className="dashboard__new-project"
            onClick={() => navigate("/project/new")}
          >
            + New project
          </button>
        </div>

        <Tabs tabs={["Working on", "Watching"]} active="Working on" />

        <div className="dashboard__content">
          {/* WORKING ON */}
          <section className="dashboard__section">
            <p className="dashboard__hint">
              It feels empty, doesn’t it? Start working with Taiga and
              you’ll see here the stories, tasks and issues you are
              working on.
            </p>

            {loading && (
              <>
                <SkeletonItem />
                <SkeletonItem />
              </>
            )}

            {!loading && projects.length === 0 && (
              <p className="dashboard__empty">
                You don’t have any projects yet.
              </p>
            )}

            {!loading &&
              projects.map((project) => (
                <div
                  key={project.id}
                  className="project-row"
                  onClick={() =>
                    navigate(`/project/${project.slug}/backlog`)
                  }
                >
                  <div className="project-row__avatar">
                    {project.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="project-row__info">
                    <div className="project-row__name">
                      {project.name}
                    </div>
                    {project.description && (
                      <div className="project-row__desc">
                        {project.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </section>

          {/* WATCHING */}
          <section className="dashboard__section dashboard__section--watching">
            <p className="dashboard__hint">
              Follow user stories, tasks, issues in your projects and
              be notified about their changes :)
            </p>

            {tasksLoading && (
              <>
                <SkeletonItem />
                <SkeletonItem />
              </>
            )}

            {!tasksLoading && tasks.length === 0 && (
              <p className="dashboard__empty">
                You don't have any tasks assigned to you.
              </p>
            )}

            {!tasksLoading &&
              tasks.map((task) => (
                <div key={task.id} className="task-row">
                  <div className="task-row__info">
                    <div className="task-row__header">
                      <span className="task-row__ref">#{task.id}</span>
                      <span className={`task-row__status task-row__status--${task.status}`}>
                        {STATUS_LABELS[task.status] || `Status ${task.status}`}
                      </span>
                    </div>
                    <div className="task-row__title">{task.title}</div>
                    {task.description && (
                      <div className="task-row__desc">{task.description}</div>
                    )}
                  </div>
                </div>
              ))}
          </section>
        </div>
      </main>
    </>
  );
}

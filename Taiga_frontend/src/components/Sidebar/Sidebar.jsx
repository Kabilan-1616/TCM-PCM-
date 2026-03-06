import { useState,useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authFetch } from "../../services/authFetch";

import "./Sidebar.css";

export default function Sidebar() {
  const [scrumOpen, setScrumOpen] = useState(false);
  const navigate = useNavigate();
  const { slug } = useParams();
  const [sprints, setSprints] = useState([]);
  const [project, setProject] = useState(null);

  const goToBacklog = () => navigate(`/project/${slug}/backlog`);
  const goToTimeline = () => navigate(`/project/${slug}/timeline`);
  const goToIssues = () => navigate(`/project/${slug}/issues`);

  // placeholders
  const goToSearch = () => {};
  const goToWiki = () => {};
  const goToTeam = () => navigate(`/project/${slug}/team`);
  const goToSettings = () =>  navigate(`/project/${slug}/admin/project-profile/details`);
  useEffect(() => {
      if (!scrumOpen) return;

      const loadSprints = async () => {
        try {
          const sprintsData = await authFetch(`/sprints/?project_slug=${slug}`);
          setSprints(sprintsData);
        } catch (err) {
          console.error(err);
        }
      };

      loadSprints();
    }, [scrumOpen, slug]);

    

  // useEffect(() => {
  //       const loadProject = async () => {
  //         try {
  //           const res = await authFetch(`/projects/?slug=${slug}`);
  //           if (!res.ok) throw new Error("Failed to load project");

  //           const data = await res.json();
  //           setProject(data[0]); 
  //         } catch (err) {
  //           console.error(err);
  //         }
  //       };

  //       loadProject();
  //     }, [slug]);
  useEffect(() => {
      const loadProject = async () => {
        try {
          const data = await authFetch(`/projects/?slug=${slug}`);
          if (Array.isArray(data)) {
            const bySlug = data.find((p) => p.slug === slug);
            setProject(bySlug || data[0] || null);
          } else {
            setProject(data || null);
          }

        } catch (err) {
          console.error(err);
        }
      };

      loadProject();
    }, [slug]);


  return (
    <aside className="sidebar">
      <div className="sidebar__project">
        <span className="sidebar__project-name">{project ? project.name : "Loading…"}</span>
      </div>

      {/* SCRUM */}
      <div
        className="sidebar__item"
        onClick={() => setScrumOpen(!scrumOpen)}
      >
        Scrum <span>{scrumOpen ? "▾" : "▸"}</span>
      </div>

      {scrumOpen && (
        <>
          <div className="sidebar__subitem" onClick={goToBacklog}>
            Backlog
          </div>

          <div className="sidebar__subitem">Dashboard</div>

          {sprints.map((sprint) => (
            <div
              key={sprint.id}
              className="sidebar__subsubitem"
              onClick={() =>
                navigate(`/project/${slug}/taskboard/${sprint.id}`)
              }
            >
              {sprint.name}
            </div>
          ))}

          <div className="sidebar__subitem" onClick={goToTimeline}>
            Timeline
          </div>
        </>
      )}
      {/* ISSUES */}
      <div className="sidebar__item" onClick={goToIssues}>
        Issues
      </div>

      <div className="sidebar__divider" />

      {/* FUTURE */}
      <div className="sidebar__item" onClick={goToSearch}>Search</div>
      <div className="sidebar__item" onClick={goToWiki}>Wiki</div>
      <div className="sidebar__item" onClick={goToTeam}>Team</div>
      <div className="sidebar__item" onClick={goToSettings}>Settings</div>
    </aside>
  );
}
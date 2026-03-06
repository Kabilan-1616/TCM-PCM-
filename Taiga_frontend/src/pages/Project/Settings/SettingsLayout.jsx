// // // src/pages/Settings/SettingsLayout.jsx
// // import { NavLink, Outlet, useParams } from "react-router-dom";
// // import "./SettingsLayout.css";

// // export default function SettingsLayout() {
// //   const { slug } = useParams();

// //   return (
// //     <div className="settings">
// //       {/* LEFT SIDEBAR */}
// //       <aside className="settings__sidebar">
// //         {/* PROJECT */}
// //         <div className="settings__section">
// //           <h4>PROJECT</h4>
// //           <NavLink to={`/project/${slug}/admin/project-profile/details`}>
// //             Project details
// //           </NavLink>
// //           <NavLink to={`/project/${slug}/admin/project-profile/presets`}>
// //             Presets
// //           </NavLink>
// //           <NavLink to={`/project/${slug}/admin/project-profile/modules`}>
// //             Modules
// //           </NavLink>
// //           <NavLink to={`/project/${slug}/admin/project-profile/export`}>
// //             Export
// //           </NavLink>
// //           <NavLink to={`/project/${slug}/admin/project-profile/reports`}>
// //             Reports
// //           </NavLink>
// //         </div>

// //         {/* ATTRIBUTES */}
// //         <div className="settings__section">
// //           <h4>ATTRIBUTES</h4>
// //           <NavLink to={`/project/${slug}/admin/project-values/status`}>
// //             Statuses
// //           </NavLink>
// //           <NavLink to={`/project/${slug}/admin/project-values/points`}>
// //             Points
// //           </NavLink>
// //           <NavLink to={`/project/${slug}/admin/project-values/priorities`}>
// //             Priorities
// //           </NavLink>
// //           <NavLink to={`/project/${slug}/admin/project-values/severities`}>
// //             Severities
// //           </NavLink>
// //           <NavLink to={`/project/${slug}/admin/project-values/types`}>
// //             Types
// //           </NavLink>
// //           <NavLink to={`/project/${slug}/admin/project-values/custom-fields`}>
// //             Custom fields
// //           </NavLink>
// //           <NavLink to={`/project/${slug}/admin/project-values/tags`}>
// //             Tags
// //           </NavLink>
// //           <NavLink to={`/project/${slug}/admin/project-values/due-dates`}>
// //             Due dates
// //           </NavLink>
// //         </div>

// //         {/* MEMBERS */}
// //         <div className="settings__section">
// //           <h4>MEMBERS</h4>
// //           <NavLink to={`/project/${slug}/admin/memberships`}>
// //             Members
// //           </NavLink>
// //         </div>

// //         {/* PERMISSIONS */}
// //         <div className="settings__section">
// //           <h4>PERMISSIONS</h4>
// //           <NavLink to={`/project/${slug}/admin/roles/ux`}>UX</NavLink>
// //           <NavLink to={`/project/${slug}/admin/roles/design`}>Design</NavLink>
// //           <NavLink to={`/project/${slug}/admin/roles/front`}>Front</NavLink>
// //           <NavLink to={`/project/${slug}/admin/roles/back`}>Back</NavLink>
// //           <NavLink to={`/project/${slug}/admin/roles/product-owner`}>
// //             Product owner
// //           </NavLink>
// //           <NavLink to={`/project/${slug}/admin/roles/stakeholder`}>
// //             Stakeholder
// //           </NavLink>
// //           <NavLink to={`/project/${slug}/admin/roles/external-user`}>
// //             External user
// //           </NavLink>
// //         </div>

// //         {/* INTEGRATIONS */}
// //         <div className="settings__section">
// //           <h4>INTEGRATIONS</h4>
// //           <NavLink to={`/project/${slug}/admin/third-parties/webhooks`}>
// //             Webhooks
// //           </NavLink>
// //           <NavLink to={`/project/${slug}/admin/third-parties/github`}>
// //             GitHub
// //           </NavLink>
// //           <NavLink to={`/project/${slug}/admin/third-parties/gitlab`}>
// //             GitLab
// //           </NavLink>
// //           <NavLink to={`/project/${slug}/admin/third-parties/bitbucket`}>
// //             Bitbucket
// //           </NavLink>
// //           <NavLink to={`/project/${slug}/admin/third-parties/gogs`}>
// //             Gogs
// //           </NavLink>
// //         </div>
// //       </aside>

// //       {/* RIGHT CONTENT */}
// //       <main className="settings__content">
// //         <Outlet />
// //       </main>
// //     </div>
// //   );
// // }


// import { NavLink, Outlet, useParams } from "react-router-dom";
// import "./SettingsLayout.css";

// export default function SettingsLayout() {
//   const { slug } = useParams();

//   return (
//     <div className="settings">
//       {/* LEFT: SETTINGS NAV */}
//       <aside className="settings__nav">
//         {/* GROUPS */}
//         <div className="settings__groups">
//           <div className="group active">PROJECT</div>
//           <div className="group">ATTRIBUTES</div>
//           <div className="group">MEMBERS</div>
//           <div className="group">PERMISSIONS</div>
//           <div className="group">INTEGRATIONS</div>
//         </div>

//         {/* ITEMS */}
//         <div className="settings__items">
//           <NavLink to={`/project/${slug}/admin/project-profile/details`}>
//             Project details
//           </NavLink>
//           <NavLink to={`/project/${slug}/admin/project-profile/presets`}>
//             Presets
//           </NavLink>
//           <NavLink to={`/project/${slug}/admin/project-profile/modules`}>
//             Modules
//           </NavLink>
//           <NavLink to={`/project/${slug}/admin/project-profile/export`}>
//             Export
//           </NavLink>
//           <NavLink to={`/project/${slug}/admin/project-profile/reports`}>
//             Reports
//           </NavLink>
//         </div>
//       </aside>

//       {/* RIGHT: CONTENT */}
//       <main className="settings__content">
//         <Outlet />
//       </main>
//     </div>
//   );
// }


import { NavLink, Outlet, useParams } from "react-router-dom";
import { useState } from "react";
import "./SettingsLayout.css";

/* ===== SETTINGS NAV CONFIG ===== */
const SETTINGS_GROUPS = {
  PROJECT: [
    { label: "Project details", path: "project-profile/details" },
    { label: "Presets", path: "project-profile/presets" },
    { label: "Modules", path: "project-profile/modules" },
    { label: "Export", path: "project-profile/export" },
    { label: "Reports", path: "project-profile/reports" },
  ],

  ATTRIBUTES: [
    { label: "Statuses", path: "project-values/status" },
    { label: "Points", path: "project-values/points" },
    { label: "Priorities", path: "project-values/priorities" },
    { label: "Severities", path: "project-values/severities" },
    { label: "Types", path: "project-values/types" },
    { label: "Custom fields", path: "project-values/custom-fields" },
    { label: "Tags", path: "project-values/tags" },
    { label: "Due dates", path: "project-values/due-dates" },
  ],

  MEMBERS: [
    { label: "Members", path: "memberships" },
  ],

  PERMISSIONS: [
    { label: "UX", path: "roles/ux" },
    { label: "Design", path: "roles/design" },
    { label: "Front", path: "roles/front" },
    { label: "Back", path: "roles/back" },
    { label: "Product owner", path: "roles/product-owner" },
    { label: "Stakeholder", path: "roles/stakeholder" },
    { label: "External user", path: "roles/external-user" },
  ],

  INTEGRATIONS: [
    { label: "Webhooks", path: "third-parties/webhooks" },
    { label: "GitHub", path: "third-parties/github" },
    { label: "GitLab", path: "third-parties/gitlab" },
    { label: "Bitbucket", path: "third-parties/bitbucket" },
    { label: "Gogs", path: "third-parties/gogs" },
  ],
};

export default function SettingsLayout() {
  const { slug } = useParams();
  const [activeGroup, setActiveGroup] = useState("PROJECT");

  const items = SETTINGS_GROUPS[activeGroup];

  return (
    <div className="settings">
      {/* ================= LEFT NAV ================= */}
      <aside className="settings__nav">
        {/* GROUP SELECTOR */}
        <div className="settings__groups">
        {Object.keys(SETTINGS_GROUPS).map((group) => (
            <div
            key={group}
            className={`settings__group ${
                activeGroup === group ? "active" : ""
            }`}
            onClick={() => setActiveGroup(group)}
            >
            {group}
            </div>
        ))}
        </div>

        {/* GROUP ITEMS */}
        <div className="settings__items">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={`/project/${slug}/admin/${item.path}`}
              className={({ isActive }) =>
                `settings__item ${isActive ? "active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </aside>

      {/* ================= RIGHT CONTENT ================= */}
      <main className="settings__content">
        <Outlet />
      </main>
    </div>
  );
}

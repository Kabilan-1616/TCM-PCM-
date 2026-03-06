// // import React from 'react'

// // function Permissions() {
// //   return (
// //     <div>Permissions</div>
// //   )
// // }

// // export default Permissions


// import { useParams } from "react-router-dom";
// import "./Permissions.css";

// export default function Permissions() {
//   const { role } = useParams(); // ux | design | front | back | ...

//   const roleTitleMap = {
//     ux: "UX",
//     design: "Design",
//     front: "Front",
//     back: "Back",
//     "product-owner": "Product owner",
//     stakeholder: "Stakeholder",
//     "external-user": "External user",
//   };

//   const title = roleTitleMap[role] || "Permissions";

//   return (
//     <div className="permissions">
//       <header className="permissions__header">
//         <h2>Permissions</h2>
//         <button className="danger-btn">DELETE</button>
//       </header>

//       <h3>{title}</h3>

//       {/* Toggle */}
//       <div className="permissions__toggle">
//         <span>
//           This role is part of the roles involved in estimating user story points.
//         </span>
//         <input type="checkbox" defaultChecked />
//       </div>

//       {/* Permissions table */}
//       <div className="permissions__list">
//         {[
//           { label: "Epics", count: "5/5" },
//           { label: "Sprints", count: "4/4" },
//           { label: "User Stories", count: "5/5" },
//           { label: "Tasks", count: "5/5" },
//           { label: "Issues", count: "5/5" },
//           { label: "Wiki", count: "7/7" },
//         ].map((item) => (
//           <div key={item.label} className="permissions__row">
//             <span>{item.label}</span>
//             <span>{item.count}</span>
//             <span className="arrow">›</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import { useParams } from "react-router-dom";
import { useState } from "react";
import "./Permissions.css";

const PERMISSIONS = [
  {
    key: "epics",
    label: "Epics",
    count: "5/5",
    actions: [
      "View epics",
      "Add epics",
      "Modify epics",
      "Comment epics",
      "Delete epics",
    ],
  },
  {
    key: "sprints",
    label: "Sprints",
    count: "4/4",
    actions: [
      "View sprints",
      "Add sprints",
      "Modify sprints",
      "Delete sprints",
    ],
  },
  {
    key: "user-stories",
    label: "User Stories",
    count: "5/5",
    actions: [
      "View user stories",
      "Add user stories",
      "Modify user stories",
      "Delete user stories",
      "Comment user stories",
    ],
  },
  {
    key: "tasks",
    label: "Tasks",
    count: "5/5",
    actions: [
      "View tasks",
      "Add tasks",
      "Modify tasks",
      "Delete tasks",
      "Comment tasks",
    ],
  },
  {
    key: "issues",
    label: "Issues",
    count: "5/5",
    actions: [
      "View issues",
      "Add issues",
      "Modify issues",
      "Delete issues",
      "Comment issues",
    ],
  },
  {
    key: "wiki",
    label: "Wiki",
    count: "7/7",
    actions: [
      "View wiki",
      "Add wiki pages",
      "Modify wiki pages",
      "Delete wiki pages",
      "Add wiki links",
      "Delete wiki links",
      "View wiki links"
    ],
  },
];

export default function Permissions() {
  const { role } = useParams();
  const [open, setOpen] = useState("epics");

  return (
    <div className="permissions">
      {/* HEADER */}
      <div className="permissions__header">
        <h2>Permissions</h2>
        <button className="danger-btn">DELETE</button>
      </div>

      <h3>{role.replace("-", " ").toUpperCase()}</h3>

      {/* TOGGLE */}
      <div className="permissions__toggle">
        <span>
          This role is part of the roles involved in estimating user story
          points.
        </span>
        <input type="checkbox" defaultChecked />
      </div>

      {/* LIST */}
      <div className="permissions__list">
        {PERMISSIONS.map((section) => (
          <div key={section.key}>
            {/* SECTION HEADER */}
            <div
              className="permissions__row"
              onClick={() =>
                setOpen(open === section.key ? null : section.key)
              }
            >
              <span>{section.label}</span>
              <span>{section.count}</span>
              <span className="arrow">
                {open === section.key ? "▾" : "▸"}
              </span>
            </div>

            {/* EXPANDED */}
            {open === section.key && (
              <div className="permissions__expanded">
                {section.actions.map((action) => (
                  <div key={action} className="permissions__action">
                    <span>{action}</span>
                    <input type="checkbox" defaultChecked />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

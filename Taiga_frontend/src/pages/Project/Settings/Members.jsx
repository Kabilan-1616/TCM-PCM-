// // // // // src/pages/Settings/Members/Members.jsx
// // // // import { useState } from "react";
// // // // import InviteMemberModal from "./InviteMemberModal";
// // // // import "./Members.css";

// // // // export default function Members() {
// // // //   const [showInvite, setShowInvite] = useState(false);
// // // //   const [members, setMembers] = useState([
// // // //     {
// // // //       id: 1,
// // // //       name: "admin",
// // // //       email: "admin@localhost",
// // // //       role: "Product Owner",
// // // //       status: "Active",
// // // //       admin: true,
// // // //     },
// // // //   ]);

// // // //   const addMember = (email, role) => {
// // // //     setMembers((prev) => [
// // // //       ...prev,
// // // //       {
// // // //         id: Date.now(),
// // // //         name: email.split("@")[0],
// // // //         email,
// // // //         role,
// // // //         status: "Pending",
// // // //         admin: false,
// // // //       },
// // // //     ]);
// // // //   };

// // // //   return (
// // // //     <div className="members">
// // // //       <header className="members__header">
// // // //         <h2>Manage members</h2>
// // // //         <button className="primary-btn" onClick={() => setShowInvite(true)}>
// // // //           + NEW MEMBER
// // // //         </button>
// // // //       </header>

// // // //       <div className="members__table">
// // // //         <div className="members__row header">
// // // //           <span>Member</span>
// // // //           <span>Admin</span>
// // // //           <span>Role</span>
// // // //           <span>Status</span>
// // // //           <span />
// // // //         </div>

// // // //         {members.map((m) => (
// // // //           <div className="members__row" key={m.id}>
// // // //             <div className="member">
// // // //               <div className="avatar">{m.name[0].toUpperCase()}</div>
// // // //               <div>
// // // //                 <strong>{m.name}</strong>
// // // //                 <div className="email">{m.email}</div>
// // // //               </div>
// // // //             </div>

// // // //             <input type="checkbox" checked={m.admin} readOnly />

// // // //             <select value={m.role} readOnly>
// // // //               <option>{m.role}</option>
// // // //             </select>

// // // //             <div className={`status ${m.status.toLowerCase()}`}>
// // // //               {m.status}
// // // //             </div>

// // // //             {m.status === "Pending" && (
// // // //               <button className="link-btn">Resend</button>
// // // //             )}
// // // //           </div>
// // // //         ))}
// // // //       </div>

// // // //       {showInvite && (
// // // //         <InviteMemberModal
// // // //           onClose={() => setShowInvite(false)}
// // // //           onInvite={addMember}
// // // //         />
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }

// // // // src/pages/Settings/Members/Members.jsx
// // // import { useEffect, useState } from "react";
// // // import { useParams } from "react-router-dom";
// // // import { authFetch } from "../../../services/api";
// // // import InviteMemberModal from "./InviteMemberModal";
// // // import "./Members.css";

// // // export default function Members() {
// // //   const { projectId } = useParams(); // route must provide project id or slug
// // //   const [members, setMembers] = useState([]);
// // //   const [showInvite, setShowInvite] = useState(false);
// // //   const [loading, setLoading] = useState(true);

// // //   // 🔹 Fetch members from backend
// // //   const fetchMembers = async () => {
// // //     setLoading(true);
// // //     try {
// // //       const res = await authFetch(`/memberships/?project=${projectId}`);
// // //       const data = await res.json();
// // //       setMembers(data);
// // //     } catch (err) {
// // //       console.error("Failed to fetch members", err);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     fetchMembers();
// // //   }, [projectId]);

// // //   return (
// // //     <div className="members">
// // //       <header className="members__header">
// // //         <h2>Manage members</h2>
// // //         <button className="primary-btn" onClick={() => setShowInvite(true)}>
// // //           + NEW MEMBER
// // //         </button>
// // //       </header>

// // //       <div className="members__table">
// // //         <div className="members__row header">
// // //           <span>Member</span>
// // //           <span>Admin</span>
// // //           <span>Role</span>
// // //           <span>Status</span>
// // //           <span />
// // //         </div>

// // //         {loading && <div className="members__empty">Loading members…</div>}

// // //         {!loading &&
// // //           members.map((m) => (
// // //             <div className="members__row" key={m.id}>
// // //               <div className="member">
// // //                 <div className="avatar">
// // //                   {m.user.username[0].toUpperCase()}
// // //                 </div>
// // //                 <div>
// // //                   <strong>{m.user.username}</strong>
// // //                   <div className="email">{m.user.email}</div>
// // //                 </div>
// // //               </div>

// // //               <input
// // //                 type="checkbox"
// // //                 checked={m.role === "owner"}
// // //                 readOnly
// // //               />

// // //               <select value={m.role} disabled>
// // //                 <option value="owner">Product Owner</option>
// // //                 <option value="member">Member</option>
// // //               </select>

// // //               <div className="status active">Active</div>
// // //             </div>
// // //           ))}
// // //       </div>

// // //       {showInvite && (
// // //         <InviteMemberModal
// // //           projectId={projectId}
// // //           onClose={() => setShowInvite(false)}
// // //           onSuccess={() => {
// // //             setShowInvite(false);
// // //             fetchMembers(); // 🔄 refresh list after invite
// // //           }}
// // //         />
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // src/pages/Settings/Members/Members.jsx
// // import { useEffect, useState } from "react";
// // import { useParams } from "react-router-dom";
// // import { authFetch } from "../../../services/api";
// // import InviteMemberModal from "../../../components/InviteMemberModal/InviteMemberModal";
// // import "./Members.css";

// // export default function Members() {
// //   const { projectSlug } = useParams();

// //   const [projectId, setProjectId] = useState(null);
// //   const [members, setMembers] = useState([]);
// //   const [showInvite, setShowInvite] = useState(false);

// //   // 1️⃣ Load project → get ID
// //   useEffect(() => {
// //     async function loadProject() {
// //       const res = await authFetch(`/projects/?slug=${projectSlug}`);
// //       const data = await res.json();
// //       setProjectId(data[0].id);
// //     }
// //     loadProject();
// //   }, [projectSlug]);

// //   // 2️⃣ Load memberships ONLY for this project
// //   useEffect(() => {
// //     if (!projectId) return;

// //     async function loadMembers() {
// //       const res = await authFetch(
// //         `/memberships/?project=${projectId}`
// //       );
// //       const data = await res.json();

// //       const mapped = data.map((m) => ({
// //         id: m.id,
// //         name: m.user.username,
// //         email: m.user.email,
// //         role: m.role,
// //         admin: m.role === "owner",
// //         status: "Active",
// //       }));

// //       setMembers(mapped);
// //     }

// //     loadMembers();
// //   }, [projectId]);

// //   return (
// //     <div className="members">
// //       <header className="members__header">
// //         <h2>Manage members</h2>
// //         <button
// //           className="primary-btn"
// //           onClick={() => setShowInvite(true)}
// //         >
// //           + NEW MEMBER
// //         </button>
// //       </header>

// //       <div className="members__table">
// //         <div className="members__row header">
// //           <span>Member</span>
// //           <span>Admin</span>
// //           <span>Role</span>
// //           <span>Status</span>
// //         </div>

// //         {members.map((m) => (
// //           <div className="members__row" key={m.id}>
// //             <div className="member">
// //               <div className="avatar">
// //                 {m.name[0].toUpperCase()}
// //               </div>
// //               <div>
// //                 <strong>{m.name}</strong>
// //                 <div className="email">{m.email}</div>
// //               </div>
// //             </div>

// //             <input type="checkbox" checked={m.admin} readOnly />

// //             <select value={m.role} disabled>
// //               <option value="owner">Owner</option>
// //               <option value="member">Member</option>
// //             </select>

// //             <div className="status active">Active</div>
// //           </div>
// //         ))}
// //       </div>

// //       {showInvite && (
// //         <InviteMemberModal
// //           projectId={projectId}
// //           onClose={() => setShowInvite(false)}
// //           onSuccess={() => {
// //             setShowInvite(false);
// //             // reload members
// //             authFetch(`/memberships/?project=${projectId}`)
// //               .then((r) => r.json())
// //               .then((data) =>
// //                 setMembers(
// //                   data.map((m) => ({
// //                     id: m.id,
// //                     name: m.user.username,
// //                     email: m.user.email,
// //                     role: m.role,
// //                     admin: m.role === "owner",
// //                     status: "Active",
// //                   }))
// //                 )
// //               );
// //           }}
// //         />
// //       )}
// //     </div>
// //   );
// // }

// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { authFetch } from "../../../services/api";
// import InviteMemberModal from "../../../components/InviteMemberModal/InviteMemberModal";
// import "./Members.css";

// export default function Members() {
//   const { slug } = useParams(); // ✅ FIXED

//   const [projectId, setProjectId] = useState(null);
//   const [members, setMembers] = useState([]);
//   const [showInvite, setShowInvite] = useState(false);

//   // 1️⃣ Load project → get ID
//   useEffect(() => {
//     async function loadProject() {
//       const res = await authFetch(`/projects/?slug=${slug}`);
//       const data = await res.json();

//       if (data.length > 0) {
//         setProjectId(data[0].id);
//       }
//     }

//     loadProject();
//   }, [slug]);

//   // 2️⃣ Load memberships ONLY for this project
//   useEffect(() => {
//     if (!projectId) return;

//     async function loadMembers() {
//       const res = await authFetch(`/memberships/?project=${projectId}`);
//       const data = await res.json();

//       setMembers(
//         data.map((m) => ({
//           id: m.id,
//           name: m.user.username,
//           email: m.user.email,
//           role: m.role,
//           admin: m.role === "owner",
//           status: "Active",
//         }))
//       );
//     }

//     loadMembers();
//   }, [projectId]);

//   return (
//     <div className="members">
//       <header className="members__header">
//         <h2>Manage members</h2>
//         <button className="primary-btn" onClick={() => setShowInvite(true)}>
//           + NEW MEMBER
//         </button>
//       </header>

//       <div className="members__table">
//         <div className="members__row header">
//           <span>Member</span>
//           <span>Admin</span>
//           <span>Role</span>
//           <span>Status</span>
//         </div>

//         {members.map((m) => (
//           <div className="members__row" key={m.id}>
//             <div className="member">
//               <div className="avatar">{m.name[0].toUpperCase()}</div>
//               <div>
//                 <strong>{m.name}</strong>
//                 <div className="email">{m.email}</div>
//               </div>
//             </div>

//             <input type="checkbox" checked={m.admin} readOnly />

//             <select value={m.role} disabled>
//               <option value="owner">Owner</option>
//               <option value="member">Member</option>
//             </select>

//             <div className="status active">Active</div>
//           </div>
//         ))}
//       </div>

//       {showInvite && (
//         <InviteMemberModal
//           projectId={projectId}
//           onClose={() => setShowInvite(false)}
//           onSuccess={() => {
//             setShowInvite(false);
//             // reload members
//             authFetch(`/memberships/?project=${projectId}`)
//               .then((r) => r.json())
//               .then((data) =>
//                 setMembers(
//                   data.map((m) => ({
//                     id: m.id,
//                     name: m.user.username,
//                     email: m.user.email,
//                     role: m.role,
//                     admin: m.role === "owner",
//                     status: "Active",
//                   }))
//                 )
//               );
//           }}
//         />
//       )}
//     </div>
//   );
// }


// src/pages/Settings/Members/Members.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { authFetch } from "../../../services/authFetch";
import { getProjectMembers, removeMember } from "../../../services/membershipService";

import InviteMemberModal from "../../../components/InviteMemberModal/InviteMemberModal";
import "./Members.css";

export default function Members() {
  const { slug } = useParams();

  const [projectId, setProjectId] = useState(null);
  const [members, setMembers] = useState([]);
  const [showInvite, setShowInvite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deletingMembers, setDeletingMembers] = useState(new Set());

  // 1️⃣ Load project → get ID
  useEffect(() => {
    async function loadProject() {
      if (!slug) return;

      try {
        const data = await authFetch(`/projects/?slug=${slug}`);
        if (Array.isArray(data) && data.length > 0) {
          setProjectId(data[0].id);
        }
      } catch (err) {
        console.error("Failed to load project", err);
      }
    }

    loadProject();
  }, [slug]);

  // 2️⃣ Load memberships for this project ONLY
  useEffect(() => {
    if (!projectId) return;

    async function loadMembers() {
      setLoading(true);
      try {
        const data = await getProjectMembers(projectId);
        setMembers(
          data.map((m) => ({
            id: m.id,
            name: m.user.username,
            email: m.user.email,
            role: m.user.role || "Member",
            admin: false,
            status: "Active",
          }))
        );
      } catch (err) {
        console.error("Failed to load members", err);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    }

    loadMembers();
  }, [projectId]);

  const handleDeleteMember = async (membershipId) => {
    if (!window.confirm("Are you sure you want to remove this member from the project?")) {
      return;
    }

    setDeletingMembers((prev) => new Set(prev).add(membershipId));

    try {
      await removeMember(membershipId);
      // Reload members after successful deletion
      const data = await getProjectMembers(projectId);
      setMembers(
        data.map((m) => ({
          id: m.id,
          name: m.user.username,
          email: m.user.email,
          role: m.user.role || "Member",
          admin: false,
          status: "Active",
        }))
      );
    } catch (err) {
      console.error("Failed to delete member", err);
      alert("Failed to remove member. Please try again.");
    } finally {
      setDeletingMembers((prev) => {
        const next = new Set(prev);
        next.delete(membershipId);
        return next;
      });
    }
  };

  return (
    <div className="members">
      <header className="members__header">
        <h2>Manage members</h2>
        <button className="primary-btn" onClick={() => setShowInvite(true)}>
          + NEW MEMBER
        </button>
      </header>

      <div className="members__table">
        <div className="members__row header">
          <span>Member</span>
          <span>Admin</span>
          <span>Role</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {loading && (
          <div className="members__empty">Loading members…</div>
        )}

        {!loading && members.length === 0 && (
          <div className="members__empty">No members yet.</div>
        )}

        {!loading &&
          members.map((m) => (
            <div className="members__row" key={m.id}>
              <div className="member">
                <div className="avatar">{m.name[0].toUpperCase()}</div>
                <div>
                  <strong>{m.name}</strong>
                  <div className="email">{m.email}</div>
                </div>
              </div>

              <input type="checkbox" checked={m.admin} readOnly />

              <span className="member-role">{m.role}</span>

              <div className="status active">Active</div>

              <button
                className="member-delete-btn"
                onClick={() => handleDeleteMember(m.id)}
                disabled={deletingMembers.has(m.id)}
                title="Remove member from project"
              >
                {deletingMembers.has(m.id) ? (
                  <span className="delete-spinner"></span>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          ))}
      </div>

      {showInvite && (
        <InviteMemberModal
          projectId={projectId}
          onClose={() => setShowInvite(false)}
          onSuccess={() => {
            setShowInvite(false);
            // Reload members
            getProjectMembers(projectId)
              .then((data) =>
                setMembers(
                  data.map((m) => ({
                    id: m.id,
                    name: m.user.username,
                    email: m.user.email,
                    role: m.user.role || "Member",
                    admin: false,
                    status: "Active",
                  }))
                )
              )
              .catch((err) => console.error("Failed to reload members", err));
          }}
        />
      )}
    </div>
  );
}

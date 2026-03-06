// // import { useState } from "react";
// // import "./UserStoryModal.css";

// // export default function UserStoryModal({ onClose }) {
// //   const [assignedToMe, setAssignedToMe] = useState(false);
// //   const [location, setLocation] = useState("bottom");

// //   return (
// //     <div className="modal-overlay">
// //       <div className="modal">
// //         <button className="modal-close" onClick={onClose}>✕</button>

// //         <h2>New user story</h2>

// //         {/* SUBJECT */}
// //         <div className="form-group">
// //           <input placeholder="Subject" />
// //           <select>
// //             <option>New</option>
// //             <option>Ready</option>
// //             <option>In Progress</option>
// //             <option>Ready for test</option>
// //             <option>Done</option>
// //             <option>Archived</option>
// //           </select>
// //         </div>

// //         {/* MAIN GRID */}
// //         <div className="modal-grid">
// //           {/* LEFT COLUMN */}
// //           <div className="left-panel">
// //             <div className="tags">Add tag +</div>

// //             <textarea
// //               placeholder="Please add descriptive text to help others better understand this user story"
// //             />

// //             {/* ATTACHMENTS */}
// //             <div className="attachments">
// //               <div className="attachments-header">
// //                 <span>0 Attachments</span>
// //                 <button>+</button>
// //               </div>
// //               <div className="dropzone">Drop attachments here!</div>
// //             </div>

// //             {/* CREATE */}
// //             <button className="create-btn">CREATE</button>
// //           </div>

// //           {/* RIGHT COLUMN */}
// //           <div className="side-panel">
// //             {/* LOCATION */}
// //             <div className="location">
// //               <p className="section-title">LOCATION</p>
// //               <label>
// //                 <input
// //                   type="radio"
// //                   checked={location === "bottom"}
// //                   onChange={() => setLocation("bottom")}
// //                 />
// //                 at the bottom
// //               </label>
// //               <label>
// //                 <input
// //                   type="radio"
// //                   checked={location === "top"}
// //                   onChange={() => setLocation("top")}
// //                 />
// //                 on top
// //               </label>
// //             </div>

// //             {/* ASSIGN */}
// //             <div className="assign-box">
// //               <div className="taiga-avatar">❄️</div>
// //               {assignedToMe ? (
// //                 <p className="assigned">
// //                   Assigned to <strong>me</strong>
// //                 </p>
// //               ) : (
// //                 <p>
// //                   <span className="assign-link">Assign</span> or{" "}
// //                   <span
// //                     className="assign-link"
// //                     onClick={() => setAssignedToMe(true)}
// //                   >
// //                     Assign to me
// //                   </span>
// //                 </p>
// //               )}
// //             </div>

// //             {/* POINTS */}
// //             <div className="points-table">
// //               <p className="section-title">POINTS</p>
// //               <table>
// //                 <tbody>
// //                   <tr><td>UX</td><td>?</td></tr>
// //                   <tr><td>Design</td><td>?</td></tr>
// //                   <tr><td>Front</td><td>?</td></tr>
// //                   <tr><td>Back</td><td>?</td></tr>
// //                   <tr className="total">
// //                     <td>total points</td><td>?</td>
// //                   </tr>
// //                 </tbody>
// //               </table>
// //             </div>

// //             {/* ICONS */}
// //             <div className="side-icons">
// //               <button>⏱</button>
// //               <button>👥</button>
// //               <button>📁</button>
// //               <button>🔒</button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// import { useState } from "react";
// import "./UserStoryModal.css";

// export default function UserStoryModal({ onClose, onCreate }) {
//   const [subject, setSubject] = useState("");
//   const [description, setDescription] = useState("");
//   const [assignedToMe, setAssignedToMe] = useState(false);
//   const [location, setLocation] = useState("bottom");

//   const handleCreate = () => {
//     if (!subject.trim()) return; // Taiga-style validation

//     onCreate({
//       subject,
//       description,
//       assignedToMe,
//       location,
//     });
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal">
//         <button className="modal-close" onClick={onClose}>✕</button>

//         <h2>New user story</h2>

//         {/* SUBJECT */}
//         <div className="form-group">
//           <input
//             placeholder="Subject"
//             value={subject}
//             onChange={(e) => setSubject(e.target.value)}
//           />
//           <select>
//             <option>New</option>
//             <option>Ready</option>
//             <option>In Progress</option>
//             <option>Ready for test</option>
//             <option>Done</option>
//             <option>Archived</option>
//           </select>
//         </div>

//         {/* MAIN GRID */}
//         <div className="modal-grid">
//           {/* LEFT COLUMN */}
//           <div className="left-panel">
//             <div className="tags">Add tag +</div>

//             <textarea
//               placeholder="Please add descriptive text to help others better understand this user story"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />

//             {/* ATTACHMENTS */}
//             <div className="attachments">
//               <div className="attachments-header">
//                 <span>0 Attachments</span>
//                 <button>+</button>
//               </div>
//               <div className="dropzone">Drop attachments here!</div>
//             </div>

//             {/* CREATE */}
//             <button className="create-btn" onClick={handleCreate}>
//               CREATE
//             </button>
//           </div>

//           {/* RIGHT COLUMN */}
//           <div className="side-panel">
//             {/* LOCATION */}
//             <div className="location">
//               <p className="section-title">LOCATION</p>
//               <label>
//                 <input
//                   type="radio"
//                   checked={location === "bottom"}
//                   onChange={() => setLocation("bottom")}
//                 />
//                 at the bottom
//               </label>
//               <label>
//                 <input
//                   type="radio"
//                   checked={location === "top"}
//                   onChange={() => setLocation("top")}
//                 />
//                 on top
//               </label>
//             </div>

//             {/* ASSIGN */}
//             <div className="assign-box">
//               <div className="taiga-avatar">❄️</div>
//               {assignedToMe ? (
//                 <p className="assigned">
//                   Assigned to <strong>me</strong>
//                 </p>
//               ) : (
//                 <p>
//                   <span className="assign-link">Assign</span> or{" "}
//                   <span
//                     className="assign-link"
//                     onClick={() => setAssignedToMe(true)}
//                   >
//                     Assign to me
//                   </span>
//                 </p>
//               )}
//             </div>

//             {/* POINTS */}
//             <div className="points-table">
//               <p className="section-title">POINTS</p>
//               <table>
//                 <tbody>
//                   <tr><td>UX</td><td>?</td></tr>
//                   <tr><td>Design</td><td>?</td></tr>
//                   <tr><td>Front</td><td>?</td></tr>
//                   <tr><td>Back</td><td>?</td></tr>
//                   <tr className="total">
//                     <td>total points</td><td>?</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>

//             {/* ICONS */}
//             <div className="side-icons">
//               <button>⏱</button>
//               <button>👥</button>
//               <button>📁</button>
//               <button>🔒</button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import "./UserStoryModal.css";
import { stringToStatusNumber, createSlug } from "../../services/statusMapping";

export default function UserStoryModal({ onClose, onCreate }) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("New");

  // UI-only (kept for Taiga look & future use)
  const [assignedToMe, setAssignedToMe] = useState(false);
  const [location, setLocation] = useState("bottom");

  const handleCreate = () => {
    if (!subject.trim()) return; // Taiga-style validation

    // ✅ Only send backend-relevant fields
    onCreate({
      title: subject,
      slug: createSlug(subject),
      description,
      priority: 1, // Default priority
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>

        <h2>New user story</h2>

        {/* SUBJECT + STATUS */}
        <div className="form-group">
          <input
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>New</option>
            <option>Ready</option>
            <option>In Progress</option>
            <option>Ready for test</option>
            <option>Done</option>
            <option>Archived</option>
          </select>
        </div>

        {/* MAIN GRID */}
        <div className="modal-grid">
          {/* LEFT COLUMN */}
          <div className="left-panel">
            <div className="tags">Add tag +</div>

            <textarea
              placeholder="Please add descriptive text to help others better understand this user story"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* ATTACHMENTS */}
            <div className="attachments">
              <div className="attachments-header">
                <span>0 Attachments</span>
                <button>+</button>
              </div>
              <div className="dropzone">Drop attachments here!</div>
            </div>

            {/* CREATE */}
            <button className="create-btn" onClick={handleCreate}>
              CREATE
            </button>
          </div>

          {/* RIGHT COLUMN (UNCHANGED UI) */}
          <div className="side-panel">
            {/* LOCATION */}
            <div className="location">
              <p className="section-title">LOCATION</p>
              <label>
                <input
                  type="radio"
                  checked={location === "bottom"}
                  onChange={() => setLocation("bottom")}
                />
                at the bottom
              </label>
              <label>
                <input
                  type="radio"
                  checked={location === "top"}
                  onChange={() => setLocation("top")}
                />
                on top
              </label>
            </div>

            {/* ASSIGN */}
            <div className="assign-box">
              <div className="taiga-avatar">❄️</div>
              {assignedToMe ? (
                <p className="assigned">
                  Assigned to <strong>me</strong>
                </p>
              ) : (
                <p>
                  <span className="assign-link">Assign</span> or{" "}
                  <span
                    className="assign-link"
                    onClick={() => setAssignedToMe(true)}
                  >
                    Assign to me
                  </span>
                </p>
              )}
            </div>

            {/* POINTS (UI ONLY – FUTURE BACKEND) */}
            <div className="points-table">
              <p className="section-title">POINTS</p>
              <table>
                <tbody>
                  <tr><td>UX</td><td>?</td></tr>
                  <tr><td>Design</td><td>?</td></tr>
                  <tr><td>Front</td><td>?</td></tr>
                  <tr><td>Back</td><td>?</td></tr>
                  <tr className="total">
                    <td>total points</td><td>?</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ICONS */}
            <div className="side-icons">
              <button>⏱</button>
              <button>👥</button>
              <button>📁</button>
              <button>🔒</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

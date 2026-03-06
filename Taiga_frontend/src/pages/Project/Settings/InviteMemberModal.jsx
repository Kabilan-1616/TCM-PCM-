// src/pages/Settings/Members/InviteMemberModal.jsx
import { useState } from "react";
import "./InviteMemberModal.css";

export default function InviteMemberModal({ onClose, onInvite }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("UX");
  const [message, setMessage] = useState("");

  return (
    <div className="invite-overlay">
      <div className="invite-modal">
        <button className="close" onClick={onClose}>✕</button>

        <h2>New Member</h2>

        <input
          placeholder="Filter users or write an email to invite"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {email && (
          <>
            <div className="invite-row">
              <span>{email}</span>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option>UX</option>
                <option>Design</option>
                <option>Front</option>
                <option>Back</option>
                <option>Product Owner</option>
              </select>
            </div>

            <textarea
              placeholder="(Optional) Add a personalized text to the invitation..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button
              className="invite-btn"
              onClick={() => {
                onInvite(email, role);
                onClose();
              }}
            >
              INVITE
            </button>
          </>
        )}
      </div>
    </div>
  );
}

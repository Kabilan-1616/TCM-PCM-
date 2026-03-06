// src/components/InviteMemberModal/InviteMemberModal.jsx
import { useState, useEffect } from "react";
import { getUsers } from "../../services/userService";
import { addMember } from "../../services/membershipService";

import "./InviteMemberModal.css";

export default function InviteMemberModal({
  projectId,
  onClose,
  onSuccess,
}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invitingUsers, setInvitingUsers] = useState(new Set());
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        console.error("Failed to load users", err);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleInvite = async (user) => {
    if (!projectId) {
      setError("Project ID is required");
      return;
    }

    setInvitingUsers((prev) => new Set(prev).add(user.id));
    setError("");

    try {
      const response = await addMember({
        project: projectId,
        user_email: user.email,
      });

      // Successfully added member
      if (onSuccess) {
        onSuccess(response);
      }
      onClose();
    } catch (err) {
      setError(err.message || "Failed to add member");
      setInvitingUsers((prev) => {
        const next = new Set(prev);
        next.delete(user.id);
        return next;
      });
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="invite-overlay" onClick={handleOverlayClick}>
      <div className="invite-modal">
        <button className="invite-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <h2>New Member</h2>

        {error && (
          <div className="invite-error">{error}</div>
        )}

        {loading ? (
          <div className="invite-loading">
            <div className="invite-spinner"></div>
            <span>Loading users…</span>
          </div>
        ) : (
          <div className="user-list">
            {users.length === 0 ? (
              <div className="invite-empty">No users available.</div>
            ) : (
              users.map((user) => (
                <div key={user.id} className="user-item">
                  <div className="user-item__avatar">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-item__info">
                    <div className="user-item__name">{user.username}</div>
                    <div className="user-item__email">{user.email}</div>
                    {user.role && (
                      <div className="user-item__role">{user.role}</div>
                    )}
                  </div>
                  <button
                    className="user-item__invite-btn"
                    onClick={() => handleInvite(user)}
                    disabled={invitingUsers.has(user.id)}
                    title="Add to project"
                  >
                    {invitingUsers.has(user.id) ? (
                      <span className="invite-btn-spinner"></span>
                    ) : (
                      "+"
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

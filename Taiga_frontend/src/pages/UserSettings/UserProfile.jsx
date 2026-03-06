import { useAuth } from "../../context/AuthContext";

export default function UserProfile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      <h2>User Settings</h2>

      <label>Username</label>
      <input value={user.username} disabled />

      <label>Email</label>
      <input value={user.email} disabled />

      <label>Full name</label>
      <input placeholder="Set your full name" />

      <button>SAVE</button>
    </>
  );
}

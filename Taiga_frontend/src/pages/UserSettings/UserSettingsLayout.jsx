import { Outlet, NavLink } from "react-router-dom";
import "./UserSettingsLayout.css";

export default function UserSettingsLayout() {
  return (
    <div className="user-settings">
      <aside className="user-settings__sidebar">
        <NavLink to="user-profile">User profile</NavLink>
        <NavLink to="account">Account settings</NavLink>
        <NavLink to="notifications">Notifications</NavLink>
      </aside>

      <main className="user-settings__content">
        <Outlet />
      </main>
    </div>
  );
}

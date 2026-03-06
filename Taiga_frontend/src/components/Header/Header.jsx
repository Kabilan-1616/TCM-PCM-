
// // // import taigaLogo from "../../assets/icons/taiga_logo_gray.svg";
// // // import "./Header.css";

// // // export default function Header() {
// // //   return (
// // //     <header className="header">
// // //       <div className="header__logo">
// // //         <img src={taigaLogo} alt="Taiga" />
// // //       </div>
// // //       <div className="header__login">Login</div>
// // //     </header>
// // //   );
// // // }

// // import taigaLogo from "../../assets/icons/taiga_logo_gray.svg";
// // import "./Header.css";

// // export default function Header({ variant = "public" }) {
// //   if (variant === "dashboard") {
// //     return (
// //       <header className="header header--dashboard">
// //         <div className="header__left">
// //           <img src={taigaLogo} alt="Taiga" />
// //           <span className="header__projects">Projects</span>
// //         </div>

// //         <div className="header__right">
// //           <span className="header__icon">✏️</span>
// //           <span className="header__icon">❓</span>
// //           <span className="header__icon">🔔</span>
// //           <span className="header__avatar">👤</span>
// //         </div>
// //       </header>
// //     );
// //   }

// //   // PUBLIC HEADER (Discover / Login)
// //   return (
// //     <header className="header header--public">
// //       <div className="header__logo">
// //         <img src={taigaLogo} alt="Taiga" />
// //       </div>
// //       <div className="header__login">Login</div>
// //     </header>
// //   );
// // }

// import { useNavigate } from "react-router-dom";
// import taigaLogo from "../../assets/icons/taiga_logo_gray.svg";
// import "./Header.css";

// export default function Header({ variant = "public" }) {
//   const navigate = useNavigate();

//   if (variant === "dashboard") {
//     return (
//       <header className="header header--dashboard">
//         <div className="header__left">
//           <img src={taigaLogo} alt="Taiga" />
//           <span className="header__projects">Projects</span>
//         </div>

//         <div className="header__right">
//           <span className="header__icon">✏️</span>
//           <span className="header__icon">❓</span>
//           <span className="header__icon">🔔</span>
//           <span className="header__avatar">👤</span>
//         </div>
//       </header>
//     );
//   }

//   // PUBLIC HEADER
//   return (
//     <header className="header header--public">
//       <div className="header__logo">
//         <img src={taigaLogo} alt="Taiga" />
//       </div>

//       <div
//         className="header__login"
//         onClick={() => navigate("/login")}
//         style={{ cursor: "pointer" }}
//       >
//         Login
//       </div>
//     </header>
//   );
// }


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

export default function Header({ variant = "public" }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (variant === "dashboard") {
    return (
      <header className="header header--dashboard">
        <div className="header__left">
          <span
            className="header__logo"
            onClick={() => navigate("/dashboard")}
            style={{ cursor: "pointer" }}
          >
            Projects
          </span>
        </div>

        <div className="header__right">
        <div
          className="header__avatar"
          onClick={() => setOpen(!open)}
        >
          {user?.username?.[0]?.toUpperCase()}
        </div>

        {open && (
          <div className="header__user-menu">
            <div className="header__user-info">
              <div className="header__user-name">{user.username}</div>
              <div className="header__user-email">{user.email}</div>
            </div>

            <div className="header__menu-divider" />

            <button onClick={() => navigate("/user-settings/user-profile")}>
              Edit profile
            </button>
            <button onClick={() => navigate("/user-settings/account")}>
              Account settings
            </button>

            <div className="header__menu-divider" />

            <button className="logout" onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </div>

      </header>
    );
  }

  // public header
  return (
    <header className="header header--public">
      <span onClick={() => navigate("/login")}>Login</span>
    </header>
  );
}

// // import taigaLogo from "../../assets/icons/taiga_logo_captioned.svg";
// // import "./Login.css";

// // export default function Login() {
// //   return (
// //     <div className="login">
// //       <div className="login__container">
// //         <img
// //           src={taigaLogo}
// //           alt="Taiga"
// //           className="login__logo"
// //         />

// //         <div className="login__tagline">
// //           LOVE YOUR PROJECT
// //         </div>

// //         <form className="login__form">
// //           <input
// //             type="text"
// //             placeholder="Username or email (case sensitive)"
// //           />

// //           <div className="login__password">
// //             <input
// //               type="password"
// //               placeholder="Password (case sensitive)"
// //             />
// //             <span className="login__forgot">Forgot it?</span>
// //           </div>

// //           <button type="button" className="login__button">
// //             LOGIN
// //           </button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }


// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import taigaLogo from "../../assets/icons/taiga_logo_captioned.svg";
// import "./Login.css";

// export default function Login() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const handleLogin = async () => {
//     setError("");

//     try {
//       const res = await fetch("http://127.0.0.1:8000/api/token/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ username, password }),
//       });

//       if (!res.ok) {
//         throw new Error("Invalid credentials");
//       }

//       const data = await res.json();
//       login(data.access);

//       // Taiga behavior → go to create project
//       navigate("/dashboard");

//     } catch (err) {
//       setError("Invalid username or password");
//     }
//   };

//   return (
//     <div className="login">
//       <div className="login__container">
//         <img src={taigaLogo} alt="Taiga" className="login__logo" />

//         <div className="login__tagline">LOVE YOUR PROJECT</div>

//         <form
//           className="login__form"
//           onSubmit={(e) => {
//             e.preventDefault();
//             handleLogin();
//           }}
//         >
//           <input
//             type="text"
//             placeholder="Username or email"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />

//           <div className="login__password">
//             <input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <span className="login__forgot">Forgot it?</span>
//           </div>

//           {error && <div className="login__error">{error}</div>}

//           <button className="login__button">
//             LOGIN
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { login as loginAPI } from "../../services/authService";
import taigaLogo from "../../assets/icons/taiga_logo_captioned.svg";
import ashokLogo from "../../assets/icons/Ashok_Leyland.svg"
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginAPI(username, password);

      // Store both tokens
      login(data.access, data.refresh);

      navigate("/dashboard");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login">
      <div className="login__container">
        <img src={ashokLogo} alt="Taiga" className="login__logo" />

        <div className="login__tagline">PROJECT MANAGEMENT TOOL</div>

        <form className="login__form" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username or email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <div className="login__password">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="login__forgot">Forgot it?</span>
          </div>

          {error && <div className="login__error">{error}</div>}

          <button className="login__button">
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
}

// // import { createContext, useContext, useState } from "react";

// // const AuthContext = createContext(null);

// // export function AuthProvider({ children }) {
// //   const [token, setToken] = useState(
// //     localStorage.getItem("token")
// //   );

// //   const login = (accessToken) => {
// //     localStorage.setItem("token", accessToken);
// //     setToken(accessToken);
// //   };

// //   const logout = () => {
// //     localStorage.removeItem("token");
// //     setToken(null);
// //   };

// //   const isAuthenticated = !!token;

// //   return (
// //     <AuthContext.Provider
// //       value={{ token, login, logout, isAuthenticated }}
// //     >
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // }

// // export function useAuth() {
// //   return useContext(AuthContext);
// // }


// import { createContext, useContext, useEffect, useState } from "react";
// import { authFetch } from "../services/api";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [token, setToken] = useState(
//     localStorage.getItem("token")
//   );
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const isAuthenticated = !!token;

//   // 🔐 LOGIN
//   const login = (accessToken) => {
//     localStorage.setItem("token", accessToken);
//     setToken(accessToken);
//   };

//   // 🚪 LOGOUT
//   const logout = () => {
//     localStorage.removeItem("token");
//     setToken(null);
//     setUser(null);
//   };

//   // 👤 FETCH CURRENT USER
//   const fetchUser = async () => {
//     try {
//       const res = await authFetch("/users/me/");

//       if (!res.ok) {
//         throw new Error("Failed to fetch user");
//       }

//       const data = await res.json();
//       setUser(data);
//     } catch (err) {
//       console.error("Auth error:", err);
//       logout();
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔁 Auto-fetch user on app load / refresh
//   useEffect(() => {
//     if (token) {
//       fetchUser();
//     } else {
//       setLoading(false);
//     }
//   }, [token]);

//   return (
//     <AuthContext.Provider
//       value={{
//         token,
//         user,
//         isAuthenticated,
//         login,
//         logout,
//         loading,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }

import { createContext, useContext, useEffect, useState } from "react";
import { authFetch } from "../services/authFetch";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    localStorage.getItem("access")
  );
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token;

  const login = (accessToken, refreshToken) => {
    localStorage.setItem("access", accessToken);
    localStorage.setItem("refresh", refreshToken);
    setToken(accessToken);
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setToken(null);
    setUser(null);
  };

  const fetchUser = async () => {
    try {
      const data = await authFetch("/users/me/");
      setUser(data);
    } catch (err) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

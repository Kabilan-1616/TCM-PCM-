import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "./Login.css";
import axios from 'axios';

function Login({ onLoginSuccess }) {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    identifier: '',
    password: ''
  });

  const handleCredentials = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!credentials.identifier || !credentials.password) {
      alert("Please enter credentials");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8001/login",
        credentials
      );

      const userData = {
        username: res.data.user_name,
        user_id: res.data.user_id,
        role: res.data.role
      };

      alert("Welcome " + userData.username);

      if (onLoginSuccess) {
        onLoginSuccess(userData);
      }

      // Clear any old activeProject from localStorage on fresh login
      localStorage.removeItem("activeProject");
      localStorage.setItem("user_id", userData.user_id);
      localStorage.setItem("role", userData.role);

      navigate('/MainDashboard');
    } catch (err) {
      alert(err.response?.data?.detail || "Login Failed");
    }
  };

  return (
    <div className="auth-page">

      {/* ===== Top Row Navbar (Unique to Login) ===== */}
      <div className="auth-topbar">
        <div
          className="auth-brand"
          onClick={() => navigate("/")}
        >
          <div className="auth-logo-box"></div>
          <span className="auth-brand-text">TCM</span>
        </div>
      </div>

      {/* ===== Login Center Section ===== */}
      <div className="auth-login-wrapper">
        <div className="auth-login-card">
          <h2 className="auth-title">Login</h2>

          <form onSubmit={handleLogin}>
            <input
              name="identifier"
              type="text"
              placeholder="Email or EmployeeID"
              onChange={handleCredentials}
              className="auth-input"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleCredentials}
              className="auth-input"
            />

            <button type="submit" className="auth-button">
              Login
            </button>

            <p className="auth-link">
              Reset Password?
            </p>

            <p
              className="auth-link"
              onClick={() => navigate("/Register")}
            >
              New User? Register
            </p>
          </form>
        </div>
      </div>

    </div>
  );
}

export default Login;

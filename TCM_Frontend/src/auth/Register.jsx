import React, { useState } from "react";
import "./Register.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formdata, setFormData] = useState({
    email: "",
    employeeID: "",
    employeeName: "",
    password: "",
    confirmpassword: ""
  });

  const [passStrength, setPassStrength] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const checkStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[^0-9a-zA-Z]/.test(password)) score++;

    const levels = ["Very Weak", "Weak", "Good", "Strong", "Very Strong"];
    setPassStrength(levels[score - 1] || "Very Weak");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formdata, [name]: value });
    if (name === "password") checkStrength(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (
      !formdata.email ||
      !formdata.employeeID ||
      !formdata.employeeName ||
      !formdata.password ||
      !formdata.confirmpassword
    ) {
      setErrorMessage("All fields are required");
      return;
    }

    if (formdata.password !== formdata.confirmpassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    const payload = {
      email: formdata.email,
      employee_id: Number(formdata.employeeID),
      name: formdata.employeeName,
      password: formdata.password
    };

    try {
      await axios.post("http://localhost:8001/register", payload);
      alert("Registered successfully. Await admin approval.");
      navigate("/Login");
    } catch (err) {
      setErrorMessage(err.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <>
      <header className="app-header">
        <div className="logo" onClick={() => navigate("/")}>
          <i>testlink</i>
        </div>
        <h1 className="header-title">Project Management</h1>
      </header>

      <div className="register-container">
        <div className="register-card">
          <h2 className="register-name">Register</h2>

          <form onSubmit={handleSubmit}>
            <input name="email" placeholder="Email" onChange={handleChange} />
            <input name="employeeID" placeholder="Employee ID" onChange={handleChange} />
            <input name="employeeName" placeholder="Full Name" onChange={handleChange} />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />

            {formdata.password && (
              <p style={{ fontSize: "12px", color: "blue", textAlign: "left" }}>
                Strength: {passStrength}
              </p>
            )}

            <input
              type={showPassword ? "text" : "password"}
              name="confirmpassword"
              placeholder="Confirm Password"
              onChange={handleChange}
            />

            <div className="checkbox-container">
              <input
                type="checkbox"
                className="checkbox-input"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label className="checkbox-label">Show Password</label>
            </div>

            {errorMessage && <p className="error-text">{errorMessage}</p>}

            <button className="btn-reg" type="submit">
              REGISTER
            </button>

            <p className="loginlink" onClick={() => navigate("/Login")}>
              Already a User? Login
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;

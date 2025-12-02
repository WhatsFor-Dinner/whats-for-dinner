import React from "react";
import { NavLink, useLocation } from "react-router";
import { useAuth } from "../Auth/Auth.jsx";
import "./navbar.css";
import logo from "../logo/Wfd-empty-plate.png";

export function Navbar() {
  const { token, logout } = useAuth();
  const location = useLocation();

  return (
    <nav>
      <NavLink to="/" className="logo-link">
        <img src={logo} alt="What's For Dinner Logo" className="logo-image" />
      </NavLink>

      <NavLink to="/" className="nav-title">
        <h1>What's For Dinner?</h1>
      </NavLink>

      <div className="nav-links">
        <NavLink to="/">
          <button
            className={`nav-button ${
              location.pathname === "/" ? "active" : ""
            }`}
          >
            Home
          </button>
        </NavLink>
        <NavLink to="/profilepage">
          <button
            className={`nav-button ${
              location.pathname === "/profilepage" ? "active" : ""
            }`}
          >
            My Kitchen
          </button>
        </NavLink>
        {!token ? (
          <>
            <NavLink to="/register">
              <button
                className={`nav-button ${
                  location.pathname === "/register" ? "active" : ""
                }`}
              >
                Register
              </button>
            </NavLink>
            <NavLink to="/login">
              <button
                className={`nav-button ${
                  location.pathname === "/login" ? "active" : ""
                }`}
              >
                Login
              </button>
            </NavLink>
          </>
        ) : (
          <button className="nav-button" onClick={logout}>
            Sign Out
          </button>
        )}
      </div>
    </nav>
  );
}

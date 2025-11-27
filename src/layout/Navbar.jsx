import React from "react";
import { NavLink } from "react-router";
import { useAuth } from "../Auth/Auth.jsx";
import "./navbar.css";

export function Navbar() {
  const { token, logout } = useAuth();

  return (
    <nav>
      <NavLink to="/" className="logo-link">
        <div className="logo">LOGOPLACEHOLDER</div>
      </NavLink>
      <div className="nav-links">
        <NavLink to="/">
          <button className="nav-button">Home</button>
        </NavLink>
        <NavLink to="/profilepage">
          <button className="nav-button">My Kitchen</button>
        </NavLink>
        {!token ? (
          <>
            <NavLink to="/register">
              <button className="nav-button">Register</button>
            </NavLink>
            <NavLink to="/login">
              <button className="nav-button">Login</button>
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

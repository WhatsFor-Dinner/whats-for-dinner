import React from "react";
import { NavLink } from "react-router-dom";
import "./navbar.css";

export function Navbar({ searchTerm = '', onSearchChange = () => {} }) {
  return (
    <>
      <nav>
        <NavLink to="/" className="logo-link">
          <div className="logo">LOGOPLACEHOLDER</div>
        </NavLink>
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="nav-links">
          <NavLink to="/">
            <button className="nav-button">Home</button>
          </NavLink>
          <NavLink to="/profilepage">
            <button className="nav-button">My Kitchen</button>
          </NavLink>
          <NavLink to="/register">
            <button className="nav-button">Register</button>
          </NavLink>
          <NavLink to="/login">
            <button className="nav-button">Login</button>
          </NavLink>
        </div>
      </nav>
    </>
  );
}

import React from "react";
import { NavLink } from "react-router-dom";
import "./navbar.css";

export function Navbar({ searchTerm = '', onSearchChange = () => {} }) {
  return (
    <>
      <nav>
        <NavLink to="/">
          <div className="logo">LOGO PLACEHOLDER</div>
        </NavLink>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
        </div>
        <NavLink to="/">
          <button>Home</button>{" "}
        </NavLink>
        <NavLink to="/profilepage">
          <button> My Kitchen /Profile</button>{" "}
        </NavLink>

        <NavLink to="/register">
          {" "}
          <button> Register</button>{" "}
        </NavLink>
        <NavLink to="/login">
          {" "}
          <button>Login</button>{" "}
        </NavLink>
      </nav>
    </>
  );
}

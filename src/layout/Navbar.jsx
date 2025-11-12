import React from "react";
import { NavLink } from "react-router-dom";
import "./navbar.css";

export function Navbar() {
  return (
    <>
      <nav>
        <NavLink to="/">
          <div className="logo">LOGO PLACEHOLDER</div>
        </NavLink>
        <NavLink to="/">
          <button>Home</button>{" "}
        </NavLink>
        <NavLink to="/profilepage">
          <button> My Kitchen /Profile</button>{" "}
        </NavLink>
        <NavLink to="*">
          {" "}
          <button> If needed </button>{" "}
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

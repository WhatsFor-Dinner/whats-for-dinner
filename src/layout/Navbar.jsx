import { NavLink } from "react-router";

export function Navbar() {
  return (
    <>
      <nav>
        <NavLink to="/">
          <image>LOGO PLACE HOLDER</image>
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

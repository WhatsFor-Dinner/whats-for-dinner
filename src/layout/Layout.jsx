import Navbar from "./Navbar";
import { Outlet } from "react-router";

export function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}

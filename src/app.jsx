import "./index.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/homePage/Home.jsx";
import { Navbar } from "./layout/Navbar.jsx";

import ProfilePage from "./pages/ProfilePage.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profilepage" element={<ProfilePage />} />
        <Route path="/login" element={<div>Login Page - Coming Soon</div>} />
        <Route
          path="/register"
          element={<div>Register Page - Coming Soon</div>}
        />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </>
  );
}

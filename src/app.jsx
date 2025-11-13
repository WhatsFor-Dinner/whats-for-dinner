import "./index.css";
import { Routes, Route } from "react-router";
import Home from "./pages/Home.jsx";
import { Navbar } from "./layout/Navbar.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SignIn from "./pages/sign_in.jsx";
import RegisterPage from "./pages/register_page";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profilepage" element={<ProfilePage />} />
        <Route path="/login" element={<SignIn />} />

        {/* 👇 Replace the placeholder with your actual component */}
        <Route path="/register" element={<RegisterPage />} />

        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </>
  );
}

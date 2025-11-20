import "./index.css";
import { useState } from "react";
import { Routes, Route } from "react-router";
import Home from "./pages/homePage/Home.jsx";
import { Navbar } from "./layout/Navbar.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SignIn from "./pages/sign_in.jsx";
import RegisterPage from "./pages/register_page.jsx";
import TestRecipeCard from "./profilepagecomponents/TestRecipeCard.jsx";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <Routes>
        <Route
          path="/"
          element={
            <Home searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          }
        />
        <Route path="/profilepage" element={<ProfilePage />} />
        <Route path="/login" element={<SignIn />} />

        {/* 👇 Replace the placeholder with your actual component */}
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/testlink" element={<TestRecipeCard/>}/>
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </>
  );
}

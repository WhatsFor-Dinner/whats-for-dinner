import "./index.css";
import { useState } from "react";
import { Routes, Route } from "react-router";
import Home from "./pages/homePage/Home.jsx";
import { Navbar } from "./layout/Navbar.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SignIn from "./pages/sign_in.jsx";
import RegisterPage from "./pages/register_page.jsx";

import AllRecipeCard from "./profilepagecomponents/AllRecipeCard.jsx";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <Home searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          }
        />
        <Route path="/profilepage" element={<ProfilePage />} />
        <Route path="/login" element={<SignIn />} />

        <Route path="/register" element={<RegisterPage />} />
        <Route path="/recipe/:id" element={<AllRecipeCard />} />
        <Route path="/recipe/:id/edit" element={<ProfilePage />} />
        <Route path="/recipe/:id/liked" element={<AllRecipeCard />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </>
  );
}

import React, { useState } from "react";
import { Routes, Route } from "react-router";

import ProfilePage from "./profilePage/ProfilePage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/profilepage" element={<ProfilePage />} />
    </Routes>
  );
}

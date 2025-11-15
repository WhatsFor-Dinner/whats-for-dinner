import { createRoot } from "react-dom/client";
import App from "./app.jsx";
import "./index.css";
import { BrowserRouter } from "react-router";

// 👇 import your AuthProvider
import { AuthProvider } from "./Auth/Auth.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {/* 👇 Wrap only your part */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);

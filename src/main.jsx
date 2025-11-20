import { createRoot } from "react-dom/client";
import App from "./app.jsx";
import "./index.css";
import { BrowserRouter } from "react-router";

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error("Could not find #root element to mount React");

const root = createRoot(rootEl);

root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
);

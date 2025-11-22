import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // proxy backend API requests to the server running on port 3000
      "/users": "http://localhost:3000",
      "/recipes": "http://localhost:3000",
      "/profile": "http://localhost:3000",
      "/top-ten": "http://localhost:3000",
      "/ingredients": "http://localhost:3000",
    },
  },
});

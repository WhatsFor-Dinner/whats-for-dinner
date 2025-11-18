import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // proxy /api requests to the backend server running on port 3000
      "/api": "http://localhost:3000",
    },
  },
});

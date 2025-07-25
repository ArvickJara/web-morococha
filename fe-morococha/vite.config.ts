import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: [
      "localhost",
      "14d8185470ca.ngrok-free.app"
    ]
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
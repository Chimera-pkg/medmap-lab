import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3335",
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/api/, '')
      },
      // "/auth": {
      //   target: "http://122.11.173.11:10888",
      //   changeOrigin: true,
      //   secure: false,
      // },
      "/chainmarkx": {
        target: "https://backend.chainmarkx.cognidex.ai",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/chainmarkx/, ""),
      },
    },
  },
});

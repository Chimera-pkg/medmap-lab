import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/v1": {
        target: "http://122.11.173.11:10868",
        changeOrigin: true,
        secure: false,
      },
      "/auth": {
        target: "http://122.11.173.11:10888",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

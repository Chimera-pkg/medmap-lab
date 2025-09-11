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
      "/chainmarkx": {
        target: "https://backend.chainmarkx.cognidex.ai",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/chainmarkx/, ""),
        configure: (proxy, _options) => {
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log("Proxy request:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log("Proxy response:", proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react()
  ],

  server: {
    host: "localhost",
    port: 5173,

    strictPort: false
  },

  preview: {
    host: "localhost",
    port: 4173
  },

  build: {
    sourcemap: true,

    rollupOptions: {
      output: {
        manualChunks: {
          react: [
            "react",
            "react-dom",
            "react-router-dom"
          ],

          mui: [
            "@mui/material",
            "@mui/icons-material"
          ],

          axios: [
            "axios"
          ]
        }
      }
    }
  }
});
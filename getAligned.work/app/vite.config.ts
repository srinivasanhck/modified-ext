import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import path from "path";
const __dirname = path.resolve();

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
              @import "./src/scss/variables.scss";
            `,
      },
    },
  },
  envPrefix: "ENV_",
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "src"),
      },
      {
        find: "@root",
        replacement: path.resolve(__dirname, "src"),
      },
      {
        find: "@assets",
        replacement: path.resolve(__dirname, "src", "assets"),
      },
      {
        find: "@shared",
        replacement: path.resolve(__dirname, "../", "shared"),
      },
      {
        find: "@extension_util",
        replacement: path.resolve(
          __dirname,
          "../",
          "extension",
          "src",
          "core",
          "util"
        ),
      },
    ],
  },
});

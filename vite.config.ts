import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import fs from "fs";
import path from "path";

// Custom plugin to rename index.html to options.html
const renameIndexToOptions = () => {
  return {
    name: "rename-index-to-options",
    closeBundle: () => {
      const indexPath = resolve(__dirname, "dist/index.html");
      const optionsPath = resolve(__dirname, "dist/options.html");
      if (fs.existsSync(indexPath)) {
        fs.renameSync(indexPath, optionsPath);
      }
    },
  };
};

// Custom plugin to bump manifest version
const bumpManifestVersion = () => {
  return {
    name: "bump-manifest-version",
    enforce: "pre" as const,
    buildStart: () => {
      const manifestPath = resolve(__dirname, "public/manifest.json");
      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

      // Split version into major.minor.patch
      const [major, minor, patch] = manifest.version.split(".").map(Number);

      // Bump patch version
      manifest.version = `${major}.${minor}.${patch + 1}`;

      // Write back to manifest.json
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      console.log(`Bumped manifest version to ${manifest.version}`);
    },
  };
};

// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        background: resolve(__dirname, "src/chrome-scripts/background.ts"),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === "background"
            ? "[name].js"
            : "assets/[name]-[hash].js";
        },
        chunkFileNames: "assets/[name]-[hash].js",
      },
    },
  },
  plugins: [bumpManifestVersion(), react(), renameIndexToOptions()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

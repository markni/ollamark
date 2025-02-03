import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import fs from "fs";
import path from "path";
import { Jimp } from "jimp"; // Use named export per latest API

// Plugin to rename index.html to options.html
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

// Plugin to bump manifest version
const bumpManifestVersion = () => {
  return {
    name: "bump-manifest-version",
    enforce: "pre" as const,
    buildStart: () => {
      const manifestPath = resolve(__dirname, "public/manifest.json");
      const packagePath = resolve(__dirname, "package.json");

      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
      const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf-8"));

      // Split version into major.minor.patch
      const [major, minor, patch] = manifest.version.split(".").map(Number);
      const newVersion = `${major}.${minor}.${patch + 1}`;

      // Update both manifest.json and package.json
      manifest.version = newVersion;
      packageJson.version = newVersion;

      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));

      console.log(
        `Bumped version to ${newVersion} in manifest.json and package.json`
      );
    },
  };
};

// Plugin to generate icons using Jimp
const generateIcons = () => {
  return {
    name: "generate-icons",
    enforce: "pre" as const, // Run early in the build process
    async buildStart() {
      const sourceImagePath = resolve(__dirname, "public", "ollamark-logo.png");
      const outputDir = resolve(__dirname, "public", "icons");

      // Ensure the source image exists
      if (!fs.existsSync(sourceImagePath)) {
        console.error(`Source image not found: ${sourceImagePath}`);
        return;
      }

      // Create the output directory if it doesn't exist
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Define the sizes you need
      const sizes = [16, 48, 128];

      try {
        // Read the source image using the updated Jimp API
        const image = await Jimp.read(sourceImagePath);
        for (const size of sizes) {
          // Clone the image so the original is not modified
          const clonedImage = image.clone().resize({ w: size, h: size });
          const outputFile = path.join(outputDir, `ollamark-logo-${size}.png`);
          // Use writeAsync to write the image (promise-based)
          await clonedImage.write(outputFile as `${string}.${string}`);
          console.log(`Generated icon: ${outputFile}`);
        }
      } catch (error) {
        console.error("Error generating icons with Jimp:", error);
      }
    },
  };
};

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        background: resolve(__dirname, "src/chrome-scripts/background.ts"),
      },
      output: {
        entryFileNames: (chunkInfo) =>
          chunkInfo.name === "background"
            ? "[name].js"
            : "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
      },
    },
  },
  plugins: [
    bumpManifestVersion(),
    generateIcons(), // Generate icons using Jimp (with the current API)
    react(),
    renameIndexToOptions(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://kbsooo.github.io",
  output: "static",
  publicDir: "./static",
  markdown: {
    shikiConfig: {
      theme: "github-dark",
      wrap: true,
    },
  },
});


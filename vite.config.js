import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    sveltekit({
      adapter: adapter(),
      prerender: {
        handleHttpError: ({ path, message }) => {
          if (path.startsWith("/snapshots/")) return;
          throw new Error(message);
        },
      },
    }),
  ],
  server: { port: 5190, strictPort: true },
});

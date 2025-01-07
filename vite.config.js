import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  build: { outDir: "dist" },
  plugins: [react()],
<<<<<<< HEAD
=======
  base: '/', // For root domain
>>>>>>> 3e8c1209c3a8d708b1f338503a56f8fab8dbc017
});

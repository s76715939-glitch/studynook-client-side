import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173, // ফ্রন্টএন্ড রান করবে ৫১৭৩ পোর্টে
    // proxy: {
    //   // যেকোনো '/api' রিকোয়েস্ট লোকাল ব্যাকএন্ড পোর্টে পাঠাবে
    //   "/api": {
    //     target: "http://localhost:3000",
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },
  },
});

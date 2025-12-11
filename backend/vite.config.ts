<<<<<<< HEAD
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import svgr from "vite-plugin-svgr";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     react(),
//     svgr({
//       svgrOptions: {
//         icon: true,
//         // This will transform your SVG to a React component
//         exportType: "named",
//         namedExport: "ReactComponent",
//       },
//     }),
//   ],
// });


=======
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

<<<<<<< HEAD
=======
// https://vite.dev/config/
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
<<<<<<< HEAD
=======
        // This will transform your SVG to a React component
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
<<<<<<< HEAD

  // ⚡ Fix eval() warnings from libraries like @react-jvectormap
  esbuild: {
    logOverride: {
      eval: "silent",
    },
  },

  // ⚡ Improve bundle size by splitting vendor chunks
  build: {
    chunkSizeWarningLimit: 1200, // removes scary warnings
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id.toString().split("node_modules/")[1].split("/")[0].toString();
          }
        },
      },
    },
  },
=======
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
});

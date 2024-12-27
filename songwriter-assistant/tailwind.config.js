// tailwind.config.js
module.exports = {
  content: [
    "./index.html",           // Include the root HTML file
    "./src/**/*.{js,ts,jsx,tsx}", // Include all files in the src directory
  ],
  theme: {
    extend: {}, // Add customizations here if needed
  },
  plugins: [], // Add Tailwind plugins if necessary
};


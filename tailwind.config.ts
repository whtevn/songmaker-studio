import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    // Match text, bg, and border classes for specified colors
    {
      pattern: /^(text|bg|border)-(pink|fuchsia|amber|yellow|emerald|cyan|blue|violet)-(100|200|300|400|500|600|700|800|900)$/,

    },
  ],
  screens: {
    sm: '640px', // Ensure this breakpoint exists
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Inter"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;

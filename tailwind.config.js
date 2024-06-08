/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#191A19", // Primary color
        },
        secondary: {
          DEFAULT: "#1E5128", // Secondary color
        },
        tertiary: {
          DEFAULT: "#4E9F3D", // Tertiary color
        },
        quaternary: {
          DEFAULT: "#D8E9A8", // Quaternary color
        },
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'selector',
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Map to CSS custom properties from globals.css
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        background: "var(--color-background)",
        text: "var(--color-text)",
        muted: "var(--color-muted)",
      },
      fontFamily: {
        // Mapped from "design_system.typography"
        sans: ['Inter', 'sans-serif'], // For Headings & UI
        serif: ['Merriweather', 'serif'], // For Long-form Body
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
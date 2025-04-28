/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['Inter', 'system-ui', 'Arial', 'sans-serif'],
        },
        colors: {
          primary: '#3b82f6', // Azul personalizado
          secondary: '#f97316', // Laranja personalizado
        },
      },
    },
    plugins: [],
  }
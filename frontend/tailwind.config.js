// tailwind.config.js
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          // Spotify-like color palette
          'spotify-black': '#121212',
          'spotify-dark-gray': '#181818',
          'spotify-light-gray': '#282828',
          'spotify-green': '#1DB954',
          'spotify-white': '#FFFFFF',
          'spotify-light': '#b3b3b3',
        },
        fontFamily: {
          sans: ['Circular', 'Helvetica', 'Arial', 'sans-serif'],
        },
        spacing: {
          // Custom spacing for consistent layout
          '18': '4.5rem',
        },
        animation: {
          'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
      },
    },
    plugins: [],
  }
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        white: '#FCF7F6',
        black: '#282524',
        orange: {
          DEFAULT: '#FEBE73',
        },
        pink: {
          DEFAULT: '#F2AABD',
        },
        green: {
          DEFAULT: '#B5F2A4',
        },
        yellow: {
          DEFAULT: '#FEDF74',
        },
        red: {
          DEFAULT: '#F3777D',
        },
        purple: {
          DEFAULT: '#B09AED',
        },
        blue: {
          DEFAULT: '#A0D1DC',
        },
      },
    },
  },
  plugins: [],
};

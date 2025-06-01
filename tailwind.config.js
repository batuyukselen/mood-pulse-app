/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#5B3DF4',
        secondary: '#FFB400',
        success: '#19C37D',
        background: '#FDFDFD',
        text: '#0E0F1A',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'custom': '0 4px 20px rgba(91, 61, 244, 0.1)',
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-[#FFB400]',
    'bg-[#3B82F6]',
    'bg-[#F43F5E]',
    'bg-[#EF4444]',
    'bg-[#A855F7]',
  ],
};
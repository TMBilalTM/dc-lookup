import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enables class-based dark mode
  theme: {
    extend: {
      colors: {
        light: '#fefffe',
        dark: '#0e172b',
        'text-light': '#0e172b',
        'text-dark': '#fefffe',
        'border-light': '#e5e5e5',
        'border-dark': '#333',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        light: '0 1px 3px rgba(0, 0, 0, 0.1)',
        dark: '0 1px 3px rgba(255, 255, 255, 0.1)',
      },
      transitionProperty: {
        'background-color': 'background-color',
        'text-color': 'color',
      },
    },
  },
  plugins: [],
};

export default config;

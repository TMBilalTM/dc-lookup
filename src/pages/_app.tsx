// pages/_app.tsx

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Montserrat } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaSun, FaMoon, FaHome, FaSearch, FaHistory } from 'react-icons/fa';

const font = Montserrat({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load the theme from localStorage or default to light
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className={font.className}>
      <header className="w-full max-w-2xl mx-auto py-2 px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-500/10 rounded-md flex items-center justify-center">
              <Link href="/">
                <FaSearch className="text-blue-500" />
              </Link>
            </div>
            <p className="font-semibold tracking-tighter ml-3 sm:ml-4 text-base sm:text-lg">Discord Lookup</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/history">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-500/10 rounded-md flex items-center justify-center">
                <FaHistory className="text-blue-500" />
              </div>
            </Link>
            <button onClick={toggleTheme} className="w-8 h-8 flex items-center justify-center bg-blue-500/10 rounded-md">
              {theme === 'light' ? (
                <FaSun className="text-blue-500" />
              ) : (
                <FaMoon className="text-blue-500" />
              )}
            </button>
          </div>
        </div>
      </header>
      <Toaster
        position="bottom-right"
        containerClassName="font-medium tracking-tighter"
      />
      <main className="w-full max-w-2xl mx-auto px-2 sm:px-4 lg:px-6">
        <Component {...pageProps} />
      </main>
    </div>
  );
}

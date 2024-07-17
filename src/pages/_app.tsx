import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Montserrat } from "next/font/google";
import { Toaster } from "react-hot-toast";

const font = Montserrat({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={font.className}>
      <header className="w-full max-w-2xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-500/10 rounded-md flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="rgb(59 130 246)" className="w-5 h-5 sm:w-6 sm:h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <p className="font-semibold tracking-tighter ml-3 sm:ml-4 text-base sm:text-lg">Discord Lookup</p>
          </div>
        </div>
      </header>
      <Toaster
        position="bottom-right"
        containerClassName="font-medium tracking-tighter"
      />
      <main className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Component {...pageProps} />
      </main>
    </div>
  );
}

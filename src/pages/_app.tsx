import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Montserrat } from "next/font/google";
import { Toaster } from "react-hot-toast";

const font = Montserrat({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return <div className={font.className}>
    <div className="w-full max-w-2xl mx-auto py-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <div className="w-9 h-9 bg-blue-500/10 rounded-md flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="rgb(59 130 246)" className="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
          <p className="font-semibold tracking-tighter ml-4 text-lg">Discord Lookup</p>
        </div>
      </div>
    </div>
    <Toaster
      position="bottom-right"
      containerClassName="font-medium tracking-tighter"
    />
    <Component {...pageProps} />
  </div>
}

// pages/index.js
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

export default function Home() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  const handleSignIn = () => {
    signIn('discord');
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md p-4 fixed top-0 w-full z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">BilalTM Discord</h1>
          <div>
            {!session ? (
              <button
                onClick={handleSignIn}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
              >
                Discord ile Giriş Yap
              </button>
            ) : (
              <div className="flex items-center space-x-4">
                <p className="text-gray-800">Hoş geldiniz, {session.user.name}</p>
                <button
                  onClick={handleSignOut}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
                >
                  Çıkış Yap
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto mt-20 p-4">
        {loading ? (
          <div className="bg-white p-4 rounded-md shadow-md animate-pulse">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Yükleniyor...</h2>
            <div className="flex items-center space-x-4">
              <div className="rounded-full h-12 w-12 bg-gray-300"></div>
              <div>
                <div className="bg-gray-300 h-4 w-24 mb-2"></div>
                <div className="bg-gray-300 h-4 w-32"></div>
              </div>
            </div>
          </div>
        ) : session ? (
          <div className="bg-white p-4 rounded-md shadow-md flex items-center space-x-4">
            <div className="relative h-24 w-24">
              <Image
                src={`https://cdn.discordapp.com/avatars/${session.user.discordId}/${session.user.avatar}.png`}
                alt="Discord Profil Resmi"
                layout="fill"
                className="rounded-full"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{session.user.name}</h2>
              <p className="text-gray-800 mb-2">{session.user.email}</p>
            </div>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-md shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Hoş Geldiniz!</h2>
            <p className="text-gray-800 mb-4">Devam etmek için Discord ile giriş yapın.</p>
            <button
              onClick={handleSignIn}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
            >
              Discord ile Giriş Yap
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

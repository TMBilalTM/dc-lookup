import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { config } from 'dotenv';

config(); // dotenv'in yüklenmesi

export default function Home() {
  const { data: session, status } = useSession();
  const [userFlags, setUserFlags] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserFlags = async () => {
      if (session) {
        try {
          // Kullanıcının Discord rozetlerini getir
          const response = await fetch('https://discord.com/api/v9/users/@me', {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            const flags = userData.user_flags;

            // Rozetleri metin formatına çevir
            const badgeNames = [];
            if (flags & 1) badgeNames.push('Discord Employee');
            if (flags & 2) badgeNames.push('Partnered Server Owner');
            if (flags & 4) badgeNames.push('HypeSquad Events');
            if (flags & 8) badgeNames.push('Bug Hunter Level 1');
            if (flags & 64) badgeNames.push('House Bravery');
            if (flags & 128) badgeNames.push('House Brilliance');
            if (flags & 256) badgeNames.push('House Balance');
            if (flags & 512) badgeNames.push('Early Supporter');
            if (flags & 1024) badgeNames.push('Team User');
            if (flags & 4096) badgeNames.push('Bug Hunter Level 2');
            if (flags & 16384) badgeNames.push('Verified Bot');
            if (flags & 65536) badgeNames.push('Early Verified Bot Developer');

            setUserFlags(badgeNames);
          } else {
            setError(`Discord API error: ${response.status} ${response.statusText}`);
          }
        } catch (error) {
          console.error('Error fetching user flags:', error);
          setError('Error fetching user flags.');
        }
      }
    };

    if (session) {
      fetchUserFlags();
    }
  }, [session]);

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
        {status === 'loading' ? (
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
                src={session.user.image}
                alt="Discord Profil Resmi"
                layout="fill"
                className="rounded-full"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{session.user.name}</h2>
              <p className="text-gray-800 mb-2">{session.user.email}</p>
              <div className="flex space-x-2">
                {userFlags.map((badge) => (
                  <span
                    key={badge}
                    className="bg-gray-200 text-gray-600 px-2 py-1 rounded-md text-sm"
                  >
                    {badge}
                  </span>
                ))}
              </div>
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

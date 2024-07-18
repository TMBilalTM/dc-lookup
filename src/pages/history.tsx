import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

const History = () => {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    async function fetchHistory() {
      const response = await axios.get('/api/history');
      if (response.data.ok) {
        setHistory(response.data.data);
      }
    }
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen w-full mx-auto flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Arama Geçmişi</h1>
      <div className="flex flex-col items-center justify-center w-full md:w-[42rem] bg-gray-200/40 rounded-3xl p-4 md:p-8">
        {history.map((entry, index) => (
          <div key={index} className="flex items-center justify-between w-full mt-4">
            <div className="flex items-center">
              <img
                src={entry.icon ?? "https://cdn.discordapp.com/embed/avatars/0.png"}
                alt="Icon"
                className="w-16 h-16 rounded-full"
              />
              <div className="ml-4">
                <p className="text-[#0e172b]/90 font-semibold tracking-tighter text-xl">{entry.name}</p>
                <p className="text-[#0e172b]/60 font-medium tracking-tighter text-sm">{entry.type === 'user' ? 'User' : 'Guild'}</p>
              </div>
            </div>
            <Link href={entry.type === 'user' ? `https://discord.com/users/${entry.id}` : `https://discord.com/guilds/${entry.id}`} target="_blank">
              <button className="bg-blue-500/10 transition-all hover:bg-blue-500/20 text-sm duration-200 p-2 rounded-md text-blue-500 font-medium tracking-tighter">View on Discord</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;

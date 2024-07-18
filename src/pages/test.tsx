import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Home = () => {
  const [value, setValue] = useState<string>('');
  const [lastSearched, setLastSearched] = useState<any[]>([]);

  useEffect(() => {
    async function fetchLastSearched() {
      const response = await axios.get('/api/last-searched');
      if (response.data.ok) {
        setLastSearched(response.data.data);
      }
    }
    fetchLastSearched();
  }, []);

  const fetchGuild = async () => {
    try {
      const response = await axios.post('/api/last-searched', { id: value });
      if (!response.data.ok) {
        throw new Error('Guild not found!');
      }
      return response.data.data;
    } catch (error) {
      throw new Error('Guild not found!');
    }
  };

  const getGuild = async () => {
    if (!value) {
      toast.error('Please enter a guild id.');
      return;
    }

    toast.promise(
      fetchGuild(),
      {
        loading: 'Searching on Discord...',
        success: (data) => {
          setLastSearched([data, ...lastSearched].slice(0, 10));
          return 'Guild found!';
        },
        error: (error) => {
          return `${error.message}`;
        }
      }
    );
  };

  return (
    <div className="min-h-screen w-full mx-auto flex flex-col items-center justify-center">
      <span
        className="w-full block h-[35rem] absolute -z-[1] select-none mask top-0 left-0 right-0"
        draggable={false}
        style={{
          backgroundImage: 'url(https://img.freepik.com/free-photo/vivid-blurred-colorful-wallpaper-background_58702-3798.jpg?size=626&ext=jpg&ga=GA1.1.2008272138.1721174400&semt=ais_user)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <p className="text-5xl text-[#0e172b]/90 font-bold tracking-tighter">Discord Lookup</p>
      <p className="text-[#0e172b]/60 font-medium tracking-tighter mt-4">Find Discord guilds easily.</p>
      <input
        className="mt-5 w-full max-w-lg py-1.5 rounded-md bg-gray-200/30 backdrop-blur-xl hover:bg-gray-200/40 transition-all duration-200 outline-none px-4 focus:bg-gray-200/40 border border-black/5"
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        className="mt-5 bg-blue-500/10 transition-all hover:bg-blue-500/20 text-sm duration-200 py-2 px-8 rounded-md text-blue-500 font-medium"
        onClick={getGuild}
      >
        Search
      </button>
      <div className="mt-10 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Last Searched Guilds</h2>
        {lastSearched.map((guild) => (
          <motion.div
            key={guild.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start justify-start w-full mb-4 p-4 bg-white rounded-lg shadow"
          >
            {guild.banner ? (
              <img
                src={guild.banner}
                alt="Guild Banner"
                className="w-full rounded-lg object-cover h-[10rem] md:h-[15rem]"
              />
            ) : null}
            <div className="flex items-center mt-4">
              {guild.icon ? (
                <img
                  src={guild.icon}
                  alt="Guild Icon"
                  className="w-20 h-20 rounded-full"
                />
              ) : (
                <img
                  src="https://cdn.discordapp.com/embed/avatars/0.png"
                  alt="Guild Icon"
                  className="w-20 h-20 rounded-full"
                />
              )}
              <div className="ml-4">
                <p className="text-[#0e172b]/90 font-semibold tracking-tighter text-xl">{guild.name}</p>
              </div>
            </div>
            <Link href={`https://discord.com/guilds/${guild.id}`} target="_blank">
              <button className="mt-4 bg-blue-500/10 transition-all hover:bg-blue-500/20 text-sm duration-200 py-2 px-4 rounded-md text-blue-500 font-medium">View on Discord</button>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Home;

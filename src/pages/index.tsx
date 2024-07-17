import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const [value, setValue] = useState<string>('');
  const [user, setUser] = useState<any>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('tr-TR', options);
  };

  async function fetch() {
    const check = await axios.get(`/api/user/${value}`).then(res => res.data).catch(() => null);
    console.log(check);
    if (!check?.ok) throw new Error('User not found!');

    return check.data;
  };

  const Badge = ({ badge }: any) => {
    const [isError, setIsError] = useState(false);

    if (isError) return null;

    return (
      <Image
        src={`/png/${badge.toLowerCase()}.png`}
        className="w-6 h-6"
        alt="Badge"
        width={200}
        height={200}
        onError={() => setIsError(true)}
      />
    );
  };

  async function getUser() {
    if (!value) return toast.error('Please enter a user id.');

    toast.promise(
      fetch(),
      {
        loading: 'Searching on Discord...',
        success: (data) => {
          setUser(data);
          return 'User found!';
        },
        error: (error) => {
          return `${error.message}`;
        }
      }
    );
  };

  return (
    <div className="min-h-screen w-full mx-auto flex flex-col items-center justify-center p-4 md:p-8">
      <span
        className="w-full block h-[35rem] absolute -z-[1] select-none mask top-0 left-0 right-0"
        draggable={false}
        style={{
          backgroundImage: 'url(https://img.freepik.com/free-photo/vivid-blurred-colorful-wallpaper-background_58702-3798.jpg?size=626&ext=jpg&ga=GA1.1.2008272138.1721174400&semt=ais_user)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="mt-16 text-center">
        <p className="text-3xl md:text-5xl text-[#0e172b]/90 font-bold tracking-tighter">Discord Lookup</p>
        <p className="text-[#0e172b]/60 font-medium tracking-tighter mt-4">Find Discord user easily.</p>
      </div>
      <input
        className="mt-5 w-full max-w-lg py-1.5 rounded-md bg-gray-200/30 backdrop-blur-xl hover:bg-gray-200/40 transition-all duration-200 outline-none px-4 focus:bg-gray-200/40 border border-black/5"
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        className="mt-5 bg-blue-500/10 transition-all hover:bg-blue-500/20 text-sm duration-200 py-2 px-8 rounded-md text-blue-500 font-medium"
        onClick={getUser}
      >
        Search
      </button>
      {user ? (
        <motion.div
          initial={{ translateY: 50, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-start w-full max-w-4xl h-auto bg-gray-200/40 mt-12 rounded-3xl p-4 md:p-8">
          <div className="flex flex-col items-start justify-start w-full">
            {user?.banner !== null ? (
              <img src={user?.banner?.startsWith('a_') ? `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.gif?size=4096` : `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.png?size=4096`} alt="Banner" className="w-full h-[10rem] md:h-[15rem] rounded-xl object-cover" />
            ) : (
              <div className={`w-full h-[10rem] md:h-[15rem] rounded-xl bg-[${user.banner_color ?? '#000000'}]`} />
            )}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full mt-4">
              <div className="flex items-center">
                <img src={user?.modified_avatar} alt="Avatar" className="w-16 md:w-20 h-16 md:h-20 rounded-full" />
                <div className="ml-4">
                  <p className="text-[#0e172b]/90 font-semibold tracking-tighter text-lg md:text-xl">{user?.global_name}</p>
                  <p className="text-[#0e172b]/60 font-medium tracking-tighter text-sm">{formatDate(user?.created_at)}</p>
                </div>
              </div>
              <div className="flex items-center px-1 bg-gray-200 rounded-md p-0.5 mt-4 md:mt-0">
                {user?.badges_string.map((badge: string) => (
                  <Badge key={badge} badge={badge} />
                ))}
              </div>
            </div>
            <div className="h-px w-full bg-gray-300 mt-7" />
            <Link href={`https://discord.com/users/${user.id}`} target="_blank">
              <button className="mt-10 bg-blue-500/10 transition-all hover:bg-blue-500/20 text-sm duration-200 p-2 rounded-md text-blue-500 font-medium tracking-tighter">View on Discord</button>
            </Link>
          </div>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-start w-full max-w-4xl h-auto bg-gray-200/40 mt-12 rounded-3xl p-4 md:p-8">
          <div className="flex flex-col items-start justify-start w-full">
            <img src='https://assets-global.website-files.com/5f9072399b2640f14d6a2bf4/611af00d256b9e541fac258f_0_4clCON4Ko2L_PqGi.png' alt="Banner" className="w-full h-[10rem] md:h-[15rem] rounded-xl object-cover" />
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full mt-4">
              <div className="flex items-center">
                <img src="https://cdn.discordapp.com/embed/avatars/0.png" alt="Avatar" className="w-16 md:w-20 h-16 md:h-20 rounded-full" />
                <div className="ml-4">
                  <p className="text-[#0e172b]/90 font-semibold tracking-tighter text-lg md:text-xl">Example</p>
                  <p className="text-[#0e172b]/60 font-medium tracking-tighter text-sm">21 Nisan 2021</p>
                </div>
              </div>
              <div className="flex items-center px-1 bg-gray-200 rounded-md p-0.5 mt-4 md:mt-0">
                {['ActiveDeveloper', 'HypeSquadOnlineHouse1'].map((badge: string) => (
                  <Badge key={badge} badge={badge} />
                ))}
              </div>
            </div>
            <div className="h-px w-full bg-gray-300 mt-7" />
            <Link href={`https://discord.com/users/${user?.id ?? '603868522195714049'}`} target="_blank">
              <button className="mt-10 bg-blue-500/10 transition-all hover:bg-blue-500/20 text-sm duration-200 p-2 rounded-md text-blue-500 font-medium tracking-tighter">View on Discord</button>
            </Link>
          </div>
        </div>
      )}
      <p className="text-sm text-gray-400/80 mt-24 max-w-48 text-center font-medium tracking-tighter">This app is not affiliated with <span className="text-indigo-400">Discord</span>.</p>
    </div>
  );
}

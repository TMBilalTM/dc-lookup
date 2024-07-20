import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const [value, setValue] = useState<string>('');
  const [data, setData] = useState<any>(null);

  async function fetchData() {
    try {
      const response = await axios.get(`/api/user/${value}`);
      if (!response.data.ok) {
        throw new Error('User or Guild not found! The server widget system may not be turned on.');
      }
      return response.data.data;
    } catch (error) {
      throw new Error('User or Guild not found! The server widget system may not be turned on.');
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('tr-TR', options);
  };

  const Badge = ({ badge }: any) => {
    const [isError, setIsError] = useState(false);

    if (isError) return null;

    return (
      <Image
        src={`/png/${badge.toLowerCase()}.png`}
        className="w-6 h-6"
        alt="Badge"
        width={24}
        height={24}
        onError={() => setIsError(true)}
      />
    );
  };

  const BadgeList = ({ badges }: { badges: string[] }) => (
    <div className="flex gap-1">
      {badges.map((badge) => (
        <Badge key={badge} badge={badge} />
      ))}
    </div>
  );

  async function getData() {
    if (!value) {
      toast.error('Please enter a user or guild id.');
      return;
    }

    toast.promise(
      fetchData(),
      {
        loading: 'Searching on Discord...',
        success: (data) => {
          setData(data);
          return 'User or Guild found!';
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
      <p className="text-[#0e172b]/60 font-medium tracking-tighter mt-4">Find Discord user or guild easily.</p>
      <input
        className="mt-5 w-full max-w-lg py-1.5 rounded-md bg-gray-200/30 backdrop-blur-xl hover:bg-gray-200/40 transition-all duration-200 outline-none px-4 focus:bg-gray-200/40 border border-black/5"
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        className="mt-5 bg-blue-500/10 transition-all hover:bg-blue-500/20 text-sm duration-200 py-2 px-8 rounded-md text-blue-500 font-medium"
        onClick={getData}
      >
        Search
      </button>
      {data ? (
        <motion.div
          initial={{ translateY: 50, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-start w-full md:w-[42rem] h-auto bg-gray-200/40 mt-12 rounded-3xl p-4 md:p-8 relative"
        >
          {data.type === 'user' ? (
            <div className="flex flex-col items-start justify-start w-full">
              {data?.banner !== null ? (
                <img
                  src={data?.banner?.startsWith('a_') ? `https://cdn.discordapp.com/banners/${data.id}/${data.banner}.gif?size=4096` : `https://cdn.discordapp.com/banners/${data.id}/${data.banner}.png?size=4096`}
                  alt="Banner"
                  className="w-full mt-4 rounded-xl object-cover h-[10rem] md:h-[15rem]"
                />
              ) : (
                <div className={`w-full mt-4 rounded-xl h-[10rem] md:h-[15rem] bg-[${data.banner_color ?? '#000000'}]`} />
              )}
              <div className="flex items-start justify-between w-full mt-4">
                <div className="flex items-center">
                  <img
                    src={data?.modified_avatar ?? "https://cdn.discordapp.com/embed/avatars/0.png"}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full"
                  />
                  <div className="ml-4 flex flex-col">
                    <div className="flex items-center">
                      <p className="text-[#0e172b]/90 font-semibold tracking-tighter text-xl">
                        {data?.username ?? "Example"}
                      </p>
                      {data.bot && data.flags && (data.flags & (1 << 16)) !== 0 && (
                        <Image
                          src={`/png/verifiedbots.png`}
                          className="w-6 h-6 ml-2"
                          alt="Verified Bot"
                          width={24}
                          height={24}
                        />
                      )}
                    </div>
                    <p className="text-[#0e172b]/60 font-medium tracking-tighter text-sm mt-1">{formatDate(data?.created_at ?? "21 Nisan 2021")}</p>
                  </div>
                </div>
                <div className="relative flex flex-col items-start mt-4">
                  <BadgeList badges={data?.badges_string || []} />
                </div>
              </div>
              <div className="h-px w-full bg-gray-300 mt-7" />
              <Link href={`https://discord.com/users/${data.id}`} target="_blank">
                <button className="mt-10 bg-blue-500/10 transition-all hover:bg-blue-500/20 text-sm duration-200 p-2 rounded-md text-blue-500 font-medium tracking-tighter">View on Discord</button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-start justify-start w-full">
              {data?.banner ? (
                <div className="relative w-full mt-4 rounded-xl h-[10rem] md:h-[15rem]">
                  <img
                    src={data.banner}
                    alt="Guild Banner"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute bottom-2 right-2 flex gap-1">
                    <BadgeList badges={data?.badges || []} />
                  </div>
                </div>
              ) : null}

              {data?.icon ? (
                <img
                  src={`${data.icon}`}
                  alt="Guild Icon"
                  className="w-20 h-20 rounded-full mt-4"
                />
              ) : (
                <img
                  src="https://cdn.discordapp.com/embed/avatars/0.png"
                  alt="Guild Icon"
                  className="w-20 h-20 rounded-full mt-4"
                />
              )}

              <div className="flex items-center mt-4">
                <div className="ml-4">
                  <p className="text-[#0e172b]/90 font-semibold tracking-tighter text-xl">{data?.name ?? "Example Guild"}</p>
                  <p className="text-[#0e172b]/60 font-medium tracking-tighter text-sm">Guild</p>
                </div>
              </div>
              <div className="h-px w-full bg-gray-300 mt-7" />
              <Link href={`${data?.instant_invite}`} target="_blank">
                <button className="mt-10 bg-blue-500/10 transition-all hover:bg-blue-500/20 text-sm duration-200 p-2 rounded-md text-blue-500 font-medium tracking-tighter">View on Discord</button>
              </Link>
            </div>
          )}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-start w-full md:w-[42rem] h-auto bg-gray-200/40 mt-12 rounded-3xl p-4 md:p-8">
          <div className="flex flex-col items-start justify-start w-full">
            <img
              src='https://i.dfr.gg/banniere-discord-go-live.png'
              alt="Placeholder"
              className="w-full mt-4 rounded-xl object-cover h-[10rem] md:h-[15rem]"
            />
            <div className="flex items-start justify-between w-full mt-4">
              <div className="flex items-center">
                <img
                  src="https://cdn.discordapp.com/embed/avatars/0.png"
                  alt="Avatar Placeholder"
                  className="w-20 h-20 rounded-full"
                />
                <div className="ml-4 flex flex-col">
                  <div className="flex items-center">
                    <p className="text-[#0e172b]/90 font-semibold tracking-tighter text-xl">
                      Example User
                    </p>
                  </div>
                  <p className="text-[#0e172b]/60 font-medium tracking-tighter text-sm mt-1">21 Nisan 2021</p>
                </div>
              </div>
              <div className="relative flex flex-col items-start mt-4">
                <BadgeList badges={['premiumearlysupporter','partner', 'bughunterlevel2']} />

              </div>
            </div>
            <div className="h-px w-full bg-gray-300 mt-7" />
            <Link href="https://discord.com/" target="_blank">
              <button className="mt-10 bg-blue-500/10 transition-all hover:bg-blue-500/20 text-sm duration-200 p-2 rounded-md text-blue-500 font-medium tracking-tighter">View on Discord</button>
            </Link>
          </div>
        </div>
      )}
      <p className="text-sm text-gray-400/80 mt-24 max-w-48 text-center font-medium tracking-tighter">This app is not affiliated with <span className="text-indigo-400">Discord</span>.</p>
    </div>
  );
}

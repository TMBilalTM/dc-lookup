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
    const genericError = 'Discord bu ID hakkında bilgi döndürmedi. Bot tokenini ve sunucu widget ayarlarını kontrol edin.';

    try {
      const response = await axios.get(`/api/user/${value}`);
      if (!response.data.ok) {
        throw new Error(response.data.msg || genericError);
      }
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverMessage = error.response?.data?.msg;
        if (serverMessage) {
          throw new Error(serverMessage);
        }
      }

      if (error instanceof Error) {
        throw new Error(error.message || genericError);
      }

      throw new Error(genericError);
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('tr-TR', options);
  };

  const formatNumber = (value?: number | null) => {
    if (value === null || value === undefined) return 'Bilinmiyor';
    return value.toLocaleString('tr-TR');
  };

  const verificationLabels: Record<number, string> = {
    0: 'Hiçbiri',
    1: 'Düşük',
    2: 'Orta',
    3: 'Yüksek',
    4: 'En Yüksek'
  };

  const featureLabels: Record<string, string> = {
    PARTNERED: 'Partner',
    VERIFIED: 'Doğrulanmış',
    COMMUNITY: 'Topluluk',
    COMMUNITY2: 'Topluluk+',
    DISCOVERABLE: 'Keşfedilebilir',
    NEWS: 'Haber Kanalı',
    ANIMATED_BANNER: 'Animasyonlu Afiş',
    INVITE_SPLASH: 'Özel Davet',
    BANNER: 'Sunucu Afişi'
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
                <div className="relative w-full mt-4 rounded-xl h-[10rem] md:h-[15rem] overflow-hidden">
                  <img
                    src={data.banner}
                    alt="Sunucu Afişi"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    <BadgeList badges={data?.badges || []} />
                  </div>
                </div>
              ) : null}

              <div className="flex items-start gap-4 mt-6 w-full">
                <img
                  src={data?.icon ?? 'https://cdn.discordapp.com/embed/avatars/0.png'}
                  alt="Sunucu Simgesi"
                  className="w-20 h-20 rounded-2xl border border-white/50 shadow-lg"
                />
                <div className="flex-1">
                  <p className="text-2xl font-semibold text-[#0e172b] tracking-tight">{data?.name ?? 'Sunucu'}</p>
                  <p className="text-sm text-[#0e172b]/60 mt-1">ID: {data?.id}</p>
                  {data?.verification_level !== undefined && (
                    <span className="inline-flex mt-2 items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-[#0e172b]">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Doğrulama: {verificationLabels[data.verification_level] ?? 'Bilinmiyor'}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-6">
                <div className="rounded-2xl bg-white/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-[#0e172b]/60">Üye</p>
                  <p className="text-2xl font-semibold text-[#0e172b]">{formatNumber(data?.member_count)}</p>
                </div>
                <div className="rounded-2xl bg-white/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-[#0e172b]/60">Çevrim içi</p>
                  <p className="text-2xl font-semibold text-[#0e172b]">{formatNumber(data?.presence_count)}</p>
                </div>
                <div className="rounded-2xl bg-white/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-[#0e172b]/60">Rozet</p>
                  {data?.badges?.length ? (
                    <div className="flex gap-2 mt-2">
                      <BadgeList badges={data.badges} />
                    </div>
                  ) : (
                    <p className="text-sm text-[#0e172b]/60 mt-2">Rozet bulunamadı</p>
                  )}
                </div>
              </div>

              {data?.features?.length ? (
                <div className="w-full mt-6">
                  <p className="text-sm font-medium text-[#0e172b]/70 mb-2">Aktif Özellikler</p>
                  <div className="flex flex-wrap gap-2">
                    {data.features.map((feature: string) => (
                      <span key={feature} className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-medium">
                        {featureLabels[feature] ?? feature}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="h-px w-full bg-gray-300 mt-7" />
              {data?.instant_invite ? (
                <Link href={`${data.instant_invite}`} target="_blank">
                  <button className="mt-10 bg-blue-500/10 transition-all hover:bg-blue-500/20 text-sm duration-200 p-3 rounded-md text-blue-500 font-medium tracking-tighter w-full">Discord&rsquo;da Görüntüle</button>
                </Link>
              ) : (
                <button disabled className="mt-10 bg-gray-400/10 text-sm duration-200 p-3 rounded-md text-gray-400 font-medium tracking-tighter cursor-not-allowed w-full">Bu sunucu davet paylaşmıyor</button>
              )}
            </div>
          )}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-start w-full md:w-[42rem] h-auto bg-gray-200/40 mt-12 rounded-3xl p-4 md:p-8">
          <div className="flex flex-col items-start justify-start w-full">
            <img
              src='https://i.redd.it/pyeuy7iyfw961.png'
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

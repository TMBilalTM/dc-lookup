import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import type { DiscoveryGuildSummary } from "../../types/discovery";

const verificationLabels: Record<number, string> = {
    0: "Hiçbiri",
    1: "Düşük",
    2: "Orta",
    3: "Yüksek",
    4: "En Yüksek"
};

const formatNumber = (value?: number | null) => {
    if (value === null || value === undefined) return "Bilinmiyor";
    return value.toLocaleString("tr-TR");
};

const formatDate = (value: string | undefined) => {
    if (!value) return "Bilinmiyor";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Bilinmiyor";
    return date.toLocaleString("tr-TR", { dateStyle: "medium", timeStyle: "short" });
};

const formatDescription = (value?: string | null, limit = 220) => {
    if (!value || !value.trim()) return "Sunucu açıklaması paylaşılmamış.";
    const trimmed = value.trim();
    if (trimmed.length <= limit) return trimmed;
    return `${trimmed.slice(0, limit - 3)}...`;
};

export default function KesfetPage() {
    const [guilds, setGuilds] = useState<DiscoveryGuildSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadGuilds = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get("/api/discovery");
            if (!response.data.ok) {
                throw new Error(response.data.msg || "Keşfet verileri yüklenemedi.");
            }
            setGuilds(response.data.data as DiscoveryGuildSummary[]);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.msg || "Keşfet verileri yüklenemedi.");
            } else {
                setError((err as Error).message ?? "Keşfet verileri yüklenemedi.");
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadGuilds();
    }, [loadGuilds]);

    const copyGuildId = (id: string) => {
        if (typeof navigator === "undefined" || !navigator.clipboard) {
            toast.error("Clipboard desteklenmiyor.");
            return;
        }

        navigator.clipboard.writeText(id)
            .then(() => toast.success("Sunucu ID&rsquo;si kopyalandı."))
            .catch(() => toast.error("Sunucu ID&rsquo;si kopyalanamadı."));
    };

    return (
        <div className="min-h-screen w-full py-10 flex flex-col items-center">
            <div className="w-full max-w-4xl text-center px-4">
                <h1 className="text-4xl font-semibold text-[#0e172b] tracking-tight">Keşfet</h1>
                <p className="text-[#0e172b]/70 mt-3">
                    Keşfet listesi tamamen gerçek kullanıcı aramalarından beslenir. Bir sunucu ID&rsquo;si başarıyla çözümlendiğinde burada kalıcı olarak listelenir ve üye sayısına göre sıralanır.
                </p>
                <div className="mt-6 flex items-center justify-center gap-3">
                    <button
                        onClick={loadGuilds}
                        className="px-4 py-2 rounded-xl bg-blue-500/10 text-blue-500 text-sm font-medium hover:bg-blue-500/20 transition"
                        disabled={isLoading}
                    >
                        {isLoading ? "Yükleniyor..." : "Yenile"}
                    </button>
                    <span className="text-xs text-[#0e172b]/60">
                        {guilds.length ? `${guilds.length} sunucu listeleniyor` : "Henüz bir sunucu keşfedilmedi"}
                    </span>
                </div>
            </div>

            <div className="w-full max-w-5xl mt-10 px-4">
                {isLoading ? (
                    <p className="text-sm text-[#0e172b]/60">Veriler yükleniyor...</p>
                ) : error ? (
                    <p className="text-sm text-red-500">{error}</p>
                ) : guilds.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-[#0e172b]/20 bg-white/40 p-10 text-center text-[#0e172b]/70">
                        İlk sunucuyu eklemek için ana sayfada herhangi bir sunucu ID&rsquo;si arat.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {guilds.map((guild) => (
                            <GuildCard key={guild.id} guild={guild} onCopy={() => copyGuildId(guild.id)} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

interface GuildCardProps {
    guild: DiscoveryGuildSummary;
    onCopy: () => void;
}

function GuildCard({ guild, onCopy }: GuildCardProps) {
    const activeMembers = guild.presence_count ?? null;
    const totalMembers = guild.member_count ?? null;
    const passiveMembers = totalMembers !== null && activeMembers !== null ? Math.max(totalMembers - activeMembers, 0) : null;
    const activityRate = totalMembers && activeMembers !== null && totalMembers > 0
        ? `${((activeMembers / totalMembers) * 100).toFixed(1)}%`
        : 'Bilinmiyor';
    const descriptionText = formatDescription(guild.description);

    return (
        <div className="flex flex-col rounded-3xl bg-gray-200/40 border border-white/30 shadow-md backdrop-blur-lg overflow-hidden">
            {guild.banner ? (
                <div className="relative w-full h-32 sm:h-40">
                    <img
                        src={guild.banner}
                        alt={`${guild.name} afişi`}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-3 text-xs text-white/90">
                        İlk keşif: {formatDate(guild.firstDiscoveredAt)}
                    </div>
                </div>
            ) : null}

            <div className="p-5 sm:p-6 flex flex-col gap-4">
                <div className="flex items-start gap-4">
                    <img
                        src={guild.icon ?? 'https://cdn.discordapp.com/embed/avatars/0.png'}
                        alt={`${guild.name} simgesi`}
                        className="w-16 h-16 rounded-2xl border border-white/60 bg-white/30"
                    />
                    <div className="flex-1">
                        <p className="text-xl font-semibold text-[#0e172b] tracking-tight">{guild.name}</p>
                        {guild.verification_level !== null && guild.verification_level !== undefined ? (
                            <span className="inline-flex mt-2 items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-[#0e172b]">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                Doğrulama: {verificationLabels[guild.verification_level] ?? 'Bilinmiyor'}
                            </span>
                        ) : null}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Stat label="Toplam Üye" value={formatNumber(guild.member_count)} />
                    <Stat label="Çevrim içi" value={formatNumber(guild.presence_count)} />
                    <Stat label="Son Senkron" value={formatDate(guild.lastSyncedAt)} />
                </div>

                <div className="rounded-2xl bg-white/80 p-4">
                    <p className="text-xs uppercase tracking-wide text-[#0e172b]/60 mb-1">Sunucu Açıklaması</p>
                    <p className="text-sm text-[#0e172b]/80 leading-relaxed">{descriptionText}</p>
                </div>

                <div>
                    <p className="text-xs uppercase tracking-wide text-[#0e172b]/60 mb-2">Üyelik İstatistikleri</p>
                    <div className="grid grid-cols-2 gap-3 text-sm text-[#0e172b]">
                        <DetailStat label="Aktif Üye" value={formatNumber(activeMembers)} />
                        <DetailStat label="Pasif Üye" value={passiveMembers !== null ? formatNumber(passiveMembers) : 'Bilinmiyor'} />
                        <DetailStat label="Aktif Oranı" value={activityRate} />
                        <DetailStat label="İlk Keşif" value={formatDate(guild.firstDiscoveredAt)} />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    {guild.instant_invite ? (
                        <Link href={guild.instant_invite} target="_blank" className="flex-1">
                            <button className="w-full bg-blue-500/10 hover:bg-blue-500/20 transition text-blue-500 text-sm font-medium py-2 rounded-xl">
                                Daveti Aç
                            </button>
                        </Link>
                    ) : (
                        <button disabled className="flex-1 bg-gray-400/10 text-gray-500 text-sm font-medium py-2 rounded-xl cursor-not-allowed">
                            Davet Yok
                        </button>
                    )}
                    <button
                        className="flex-1 bg-[#0e172b]/90 text-white text-sm font-medium py-2 rounded-xl hover:bg-[#0e172b] transition"
                        onClick={onCopy}
                    >
                        ID&rsquo;yi Kopyala
                    </button>
                </div>
            </div>
        </div>
    );
}

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl bg-white/80 p-3 flex flex-col">
            <p className="text-xs uppercase tracking-wide text-[#0e172b]/60">{label}</p>
            <p className="text-lg font-semibold text-[#0e172b] mt-1">{value}</p>
        </div>
    );
}

function DetailStat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl bg-white/60 p-3">
            <p className="text-xs uppercase tracking-wide text-[#0e172b]/50">{label}</p>
            <p className="text-base font-semibold text-[#0e172b] mt-1">{value}</p>
        </div>
    );
}

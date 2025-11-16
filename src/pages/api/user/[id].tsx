import type { NextApiRequest, NextApiResponse } from "next";
import axios from 'axios';
import { UserFlagsBitField, UserFlags } from 'discord.js';
import config from '../../../../project.config';
import { addToHistory } from '../../../../historyStore';
import { upsertDiscoveryGuild } from '../../../../discoveryStore';

interface DiscordUser {
    id: string;
    username: string;
    discriminator: string;
    avatar: string | null;
    bot: boolean;
    accent_color: number | null;
    banner: string | null;
    flags: number;
    email?: string;
    locale?: string;
    premium_type?: number;
    public_flags?: number;
    global_name?: string | null;
}

interface JapiUserPayload {
    id: string;
    username: string;
    discriminator?: string;
    avatar?: string | null;
    bot?: boolean;
    accent_color?: number | null;
    banner?: string | null;
    public_flags?: number;
    flags?: number;
    createdAt?: string;
    avatarURL?: string;
    defaultAvatarURL?: string;
}

interface DiscordGuild {
    id: string;
    name: string;
    icon: string | null;
    banner: string | null;
    description?: string | null;
    owner_id?: string;
    presence_count: number | null;
    member_count?: number | null;
    approximate_member_count?: number;
    approximate_presence_count?: number;
    verification_level: number | null;
    features: string[];
    roles: Array<{
        id: string;
        name: string;
        color: number;
    }>;
    emojis: Array<{
        id: string;
        name: string;
        animated: boolean;
    }>;
    instant_invite?: string | null;
    premium_tier?: number;
    premium_subscription_count?: number;
}

interface DiscordPresence {
    activities: Array<{
        type: number;
        name: string;
        state?: string;
    }>;
}

type GuildLookupResult =
    | { success: true; guild: DiscordGuild }
    | { success: false; error: string };

const DISCORD_EPOCH = BigInt(1420070400000);

// Hata işleme fonksiyonu
function handleError(error: unknown): string {
    if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const details = error.response.data?.message || error.response.data?.msg;

        if (status === 401) {
            return 'Discord 401 Unauthorized döndürdü. Bot tokenini kontrol edin.';
        }

        if (status === 403) {
            return 'Discord 403 Forbidden döndürdü. Botun erişmeye çalıştığınız kaynakta yetkisi yok.';
        }

        if (status === 404) {
            return 'Discord bu ID ile eşleşen bir kayıt bulamadı.';
        }

        return details || error.message;
    }

    return (error as Error).message || 'An unexpected error occurred';
}

function getInviteCode(instantInvite: string | null): string | null {
    if (!instantInvite) return null;
    const sanitized = instantInvite.trim();
    const withoutQuery = sanitized.split('?')[0] ?? sanitized;
    const parts = withoutQuery.split('/');
    return parts[parts.length - 1] ?? null;
}

function snowflakeToIsoString(id: string): string {
    try {
        return new Date(Number((BigInt(id) >> BigInt(22)) + DISCORD_EPOCH)).toISOString();
    } catch {
        return new Date().toISOString();
    }
}

function formatBannerColor(accentColor: number | null): string | null {
    if (accentColor === null || accentColor === undefined) return null;
    return `#${accentColor.toString(16).padStart(6, '0')}`;
}

function buildAvatarUrl(userId: string, avatar: string | null | undefined): string | null {
    if (!avatar) return null;
    const isGif = avatar.startsWith('a_');
    const extension = isGif ? 'gif' : 'png';
    return `https://cdn.discordapp.com/avatars/${userId}/${avatar}.${extension}?size=4096`;
}

function normalizeJapiUser(payload: JapiUserPayload): DiscordUser {
    return {
        id: payload.id,
        username: payload.username,
        discriminator: payload.discriminator ?? '0',
        avatar: payload.avatar ?? null,
        bot: Boolean(payload.bot),
        accent_color: payload.accent_color ?? null,
        banner: payload.banner ?? null,
        flags: payload.public_flags ?? payload.flags ?? 0,
        public_flags: payload.public_flags
    };
}

// Sunucu widget verilerini çekme fonksiyonu
async function fetchGuild(id: string): Promise<GuildLookupResult> {
    try {
        const widgetResponse = await axios.get(`https://discord.com/api/v10/guilds/${id}/widget.json`, {
            headers: {
                "Authorization": `Bot ${config.token}`
            }
        });

        const widgetData = widgetResponse.data;
        const inviteUrl = typeof widgetData.instant_invite === 'string' ? widgetData.instant_invite : null;
        const inviteCode = getInviteCode(inviteUrl);

        let inviteData: any = null;
        if (inviteCode) {
            try {
                const inviteResponse = await axios.get(`https://discord.com/api/v10/invites/${inviteCode}?with_counts=true`, {
                    headers: {
                        "Authorization": `Bot ${config.token}`
                    }
                });
                inviteData = inviteResponse.data;
            } catch (inviteErr) {
                console.warn('Invite lookup failed:', handleError(inviteErr));
            }
        }

        let guildDetails: DiscordGuild | null = inviteData?.guild ?? null;

        if (!guildDetails) {
            try {
                const guildDetailsResponse = await axios.get(`https://discord.com/api/v10/guilds/${id}?with_counts=true`, {
                    headers: {
                        "Authorization": `Bot ${config.token}`
                    }
                });
                guildDetails = guildDetailsResponse.data;
            } catch (detailsErr) {
                console.warn('Guild details lookup failed:', handleError(detailsErr));
                guildDetails = null;
            }
        }

        const normalizedGuild: DiscordGuild = {
            id: guildDetails?.id ?? widgetData.id,
            name: guildDetails?.name ?? widgetData.name,
            icon: guildDetails?.icon ?? null,
            banner: guildDetails?.banner ?? null,
            description: guildDetails?.description ?? inviteData?.guild?.description ?? null,
            owner_id: guildDetails?.owner_id,
            presence_count: widgetData.presence_count ?? guildDetails?.approximate_presence_count ?? inviteData?.approximate_presence_count ?? null,
            member_count: guildDetails?.approximate_member_count ?? inviteData?.approximate_member_count ?? widgetData.members?.length ?? null,
            verification_level: guildDetails?.verification_level ?? null,
            features: guildDetails?.features ?? inviteData?.guild?.features ?? [],
            roles: guildDetails?.roles ?? [],
            emojis: guildDetails?.emojis ?? [],
            instant_invite: inviteUrl ?? (inviteData?.code ? `https://discord.gg/${inviteData.code}` : null)
        };

        return {
            success: true,
            guild: normalizedGuild
        };
    } catch (err) {
        if (axios.isAxiosError(err)) {
            if (err.response?.status === 404) return { success: false, error: 'Unknown Guild ID.' };
            if (err.response?.status === 403) return { success: false, error: 'This server disabled its public widget, therefore Discord will not expose its data.' };
            return { success: false, error: err.response?.data?.msg || err.message };
        }
        return { success: false, error: 'An unexpected error occurred while fetching the guild.' };
    }
}

async function fetchUserFromJapi(id: string): Promise<{ user: DiscordUser | null; error: string | null }> {
    try {
        const response = await axios.get(`https://japi.rest/discord/v1/user/${id}`);
        const payload = response.data?.data as JapiUserPayload | undefined;

        if (!payload) {
            return { user: null, error: 'japi.rest bu kullanıcıyı döndermedi.' };
        }

        return { user: normalizeJapiUser(payload), error: null };
    } catch (err) {
        let message = handleError(err);

        if (axios.isAxiosError(err)) {
            const status = err.response?.status;
            const errorPayload = err.response?.data as { error?: string; msg?: string } | undefined;
            const apiMessage = errorPayload?.error || errorPayload?.msg;

            if (status === 404) {
                message = apiMessage || 'japi.rest bu ID için kayıt bulamadı.';
            } else if (status === 429) {
                message = 'japi.rest oran limitine takıldı. Birkaç saniye sonra tekrar deneyin.';
            } else if (apiMessage) {
                message = apiMessage;
            }
        }

        console.warn('JAPI user lookup failed:', message);
        return { user: null, error: message };
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id, guild_id: guildId } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ ok: false, msg: 'id is required and must be a string' });
    }

    // Kullanıcı bilgilerini çek
    let user: DiscordUser | null = null;
    let userErrorMessage: string | null = null;
    let userSource: 'discord' | 'japi' | null = null;
    try {
         const response = await axios({
                method: `get`,
                url: `https://discord.com/api/v10/users/${id}`,
                headers: {
                    'Authorization': `Bot ${config.token}`
                }
            });

        user = response.data;
        userSource = 'discord';
    } catch (err) {
        userErrorMessage = handleError(err);
        console.error('Error fetching user:', userErrorMessage);
        user = null;
    }

    if (!user) {
        const { user: japiUser, error } = await fetchUserFromJapi(id);
        if (japiUser) {
            user = japiUser;
            userSource = 'japi';
            userErrorMessage = null;
        } else if (error) {
            userErrorMessage = error;
        }
    }

    if (user) {
        const avatar = buildAvatarUrl(user.id, user.avatar) ?? 'https://cdn.discordapp.com/embed/avatars/0.png';

        addToHistory({ id: user.id, name: `${user.username}`, avatar, type: 'User' });

        const badges: string[] = [];
        const flags = new UserFlagsBitField(user.flags || 0);

        for (const flag in UserFlags) {
            if (flags.has((flag as unknown) as UserFlagsBitField)) {
                if (typeof flag === 'number') continue;
                badges.push(flag);
            }
        }

        const createdAt = snowflakeToIsoString(user.id);
        const bannerColor = formatBannerColor(user.accent_color);

        let nitro = false;

        if (!user.bot && (user.avatar?.startsWith('a_') || user.banner)) {
            badges.push('discordnitro');
            nitro = true;
        }

        let playing: string | null = null;
        let statusMessage: string | null = null;

        if (guildId) {
            try {
                const presenceResponse = await axios.get(`https://discord.com/api/v10/guilds/${guildId}/members/${id}`, {
                    headers: {
                        "Authorization": `Bot ${config.token}`
                    }
                });
                const presence: DiscordPresence = presenceResponse.data;

                if (presence && presence.activities) {
                    playing = presence.activities.find(activity => activity.type === 0)?.name ?? null;
                    statusMessage = presence.activities.find(activity => activity.type === 4)?.state ?? null;
                }
            } catch (err) {
                console.error('Error fetching presence:', handleError(err));
                // Presence hatalarını şimdilik görmezden gel
            }
        }

        return res.status(200).json({
            ok: true,
            data: {
                type: 'user',
                ...user,
                badges_string: badges,
                nitro,
                created_at: createdAt,
                banner_color: bannerColor,
                modified_avatar: avatar,
                playing,
                status_message: statusMessage,
                lookup_source: userSource
            }
        });
    }

    // Kullanıcı bulunamazsa, sunucu bilgilerini widget ile çekmeye çalış
    const guildResponse = await fetchGuild(id);

    if (guildResponse.success) {
        const guild = guildResponse.guild;

        const banner = guild.banner ? `https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}.png?size=4096` : null;
        const icon = guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=4096` : 'https://cdn.discordapp.com/embed/avatars/0.png';

        let mostImportantBadge: string | null = null;

        const badgePriority = ["PARTNERED", "VERIFIED", "COMMUNITY2", "COMMUNITY"];

        for (const badge of badgePriority) {
            if (guild.features && guild.features.includes(badge)) {
                mostImportantBadge = badge;
                break;
            }
        }

        addToHistory({ id: guild.id, name: guild.name, avatar: icon, type: 'Guild' });

        let discoveryPersisted = true;
        try {
            await upsertDiscoveryGuild({
                id: guild.id,
                name: guild.name,
                icon,
                banner,
                description: guild.description ?? null,
                member_count: guild.member_count ?? null,
                presence_count: guild.presence_count ?? null,
                verification_level: guild.verification_level ?? null,
                features: guild.features ?? [],
                instant_invite: guild.instant_invite ?? null,
                premiumTier: (guild as any).premium_tier ?? null,
                premiumSubscriptionCount: (guild as any).premium_subscription_count ?? null
            });
        } catch (storeError) {
            discoveryPersisted = false;
            console.error('Failed to persist discovery guild entry:', storeError);
        }

        return res.status(200).json({
            ok: true,
            data: {
                type: 'guild',
                id: guild.id,
                name: guild.name,
                icon,
                banner,
                presence_count: guild.presence_count,
                member_count: guild.member_count,
                verification_level: guild.verification_level,
                features: guild.features,
                roles: guild.roles,
                emojis: guild.emojis,
                badges: mostImportantBadge ? [mostImportantBadge] : [],
                instant_invite: guild.instant_invite,
                description: guild.description ?? null,
                discoveryPersisted
            }
        });
    }

    const finalError = userErrorMessage || guildResponse.error || 'User or Guild not found';
    return res.status(400).json({ ok: false, msg: finalError });
}

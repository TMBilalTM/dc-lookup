import type { NextApiRequest, NextApiResponse } from "next";
import axios from 'axios';
import { UserFlagsBitField, UserFlags } from 'discord.js';
import config from '../../../../project.config';
import { addToHistory } from '../../../../historyStore';

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
}

interface DiscordGuild {
    id: string;
    name: string;
    icon: string | null;
    banner: string | null;
    owner_id: string;
    presence_count: number;
    member_count?: number;
    verification_level: number;
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
    instant_invite?: string;
}

interface DiscordPresence {
    activities: Array<{
        type: number;
        name: string;
        state?: string;
    }>;
    status: string;
}

// Hata işleme fonksiyonu
function handleError(error: unknown): string {
    if (axios.isAxiosError(error) && error.response) {
        return error.response.data?.msg || error.message;
    }
    return (error as Error).message || 'An unexpected error occurred';
}

// Sunucu widget verilerini çekme fonksiyonu
async function fetchGuild(id: string) {
    try {
        const widgetResponse = await axios.get(`https://discord.com/api/v10/guilds/${id}/widget.json`, {
            headers: {
                "Authorization": `Bot ${config.token}`
            }
        });

        const { instant_invite, presence_count, member_count } = widgetResponse.data;

        if (!instant_invite) {
            return { success: false, error: 'No instant invite available for this guild.' };
        }

        // Instant invite ile sunucu hakkında daha fazla bilgi al
        try {
            const inviteResponse = await axios.get(`https://discord.com/api/v10/invites/${instant_invite.split('/')[4]}`, {
                headers: {
                    "Authorization": `Bot ${config.token}`
                }
            });

            const { guild, channel } = inviteResponse.data;

            return {
                success: true,
                guild: { ...guild, instant_invite, member_count: member_count ?? presence_count },
                channel,
                code: instant_invite
            };
        } catch (err) {
            return { success: false, error: 'The widget invite could not be retrieved!' };
        }
    } catch (err) {
        if (axios.isAxiosError(err)) {
            if (err.response?.status === 404) return { success: false, error: 'Unknown Guild.' };
            if (err.response?.status === 403) return { success: false, error: 'This server\'s widget is disabled.' };
            return { success: false, error: err.response?.data?.msg || err.message };
        }
        return { success: false, error: 'An unexpected error occurred.' };
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id, guild_id: guildId } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ ok: false, msg: 'id is required and must be a string' });
    }

    // Kullanıcı bilgilerini çek
    let user: DiscordUser | null = null;
    try {
        const response = await axios.get(`https://discord.com/api/v10/users/${id}`, {
            headers: {
                "Authorization": `${config.token}`
            }
        });
        user = response.data;
    } catch (err) {
        console.error('Error fetching user:', handleError(err));
    }

    if (user) {
        const avatar = user.avatar ? user.avatar.startsWith('a_') 
            ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.gif?size=4096`
            : `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=4096` 
            : 'https://cdn.discordapp.com/embed/avatars/0.png';

        addToHistory({ id: user.id, name: `${user.username}`, avatar, type: 'User' });

        const badges: string[] = [];
        const flags = new UserFlagsBitField(user.flags);

        for (const flag in UserFlags) {
            if (flags.has((flag as unknown) as UserFlagsBitField)) {
                if (typeof flag === 'number') continue;
                badges.push(flag);
            }
        }

        const createdAt = new Date(Number((BigInt(user.id) >> BigInt(22)) + BigInt(1420070400000))).toISOString();
        const bannerColor = user.accent_color ? `#${user.accent_color.toString(16).padStart(6, '0')}` : null;

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

                // Üyenin var olup olmadığını kontrol et
                if (presenceResponse.data) {
                    const presence: DiscordPresence = presenceResponse.data;

                    if (presence.activities) {
                        playing = presence.activities.find(activity => activity.type === 0)?.name ?? null;
                        statusMessage = presence.activities.find(activity => activity.type === 4)?.state ?? null;
                    }
                } else {
                    console.warn(`User ${id} not found in guild ${guildId}`);
                    return res.status(404).json({ ok: false, msg: 'User not found in the guild.' });
                }
            } catch (err) {
                console.error('Error fetching presence:', handleError(err));
                return res.status(500).json({ ok: false, msg: 'Error fetching user presence.' });
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
                status_message: statusMessage
            }
        });
    }

    // Kullanıcı bulunamazsa, sunucu bilgilerini widget ile çekmeye çalış
    const guildResponse = await fetchGuild(id);

    if (guildResponse.success) {
        const guild = guildResponse.guild;

        const banner = guild.banner ? `https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}.png?size=4096` : null;
        const icon = guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=4096` : 'https://cdn.discordapp.com/embed/avatars/0.png';

        console.log('Guild Icon URL:', icon); // Debug: İkon URL'sini kontrol et

        let mostImportantBadge: string | null = null;

        const badgePriority = ["PARTNERED", "VERIFIED", "COMMUNITY2", "COMMUNITY"];

        for (const badge of badgePriority) {
            if (guild.features && guild.features.includes(badge)) {
                mostImportantBadge = badge;
                break;
            }
        }

        addToHistory({ id: guild.id, name: guild.name, avatar: icon, type: 'Guild' });

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
                instant_invite: guild.instant_invite
            }
        });
    }

    return res.status(400).json({ ok: false, msg: 'User or Guild not found' });
}

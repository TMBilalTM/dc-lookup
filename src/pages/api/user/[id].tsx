import type { NextApiRequest, NextApiResponse } from "next";
import config from '../../../../project.config';
import axios from 'axios';
import { UserFlagsBitField, UserFlags } from 'discord.js';

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
    member_count: number;
    presence_count: number;
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
}

interface DiscordPresence {
    activities: Array<{
        type: number;
        name: string;
        state?: string;
    }>;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    function error(message: string) {
        return res.status(400).json({ ok: false, msg: message });
    };

    function success(data: any) {
        return res.status(200).json({ ok: true, data: data });
    };

    const id = req.query.id;
    const guildId = req.query.guild_id;
    if (!id) return error('id is required');

    // Try to get the user
    const user: DiscordUser | null = await axios.get(`https://discord.com/api/v10/users/${id}`, {
        headers: {
            Authorization: `${config.token}`
        }
    }).then(res => res.data).catch(() => null);

    if (user) {
        const badges: string[] = [];
        const flags = new UserFlagsBitField(user.flags);

        for (const flag in UserFlags) {
            if (flags.has((flag as unknown) as UserFlagsBitField)) {
                if (typeof flag === 'number') continue;
                badges.push(flag);
            }
        }

        const createdAt = new Date(Number((BigInt(user.id) >> BigInt(22)) + BigInt(1420070400000))).toISOString();
        const bannerColor = user.accent_color ? `#${user.accent_color.toString(16)}` : null;
        const avatar = user.avatar ? user.avatar.startsWith('a_') ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.gif?size=4096` : `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=4096` : 'https://cdn.discordapp.com/embed/avatars/0.png';

        // Check if the user is not a bot and meets the criteria for having a "discordnitro" badge
        let nitro = false;
        if (!user.bot && (user.avatar && user.avatar.startsWith('a_')) || user.banner) {
            badges.push('discordnitro');
            nitro = true;
        }

        let playing: string | null = null;
        let statusMessage: string | null = null;

        if (guildId) {
            // Get user's presence from guild
            const presence: DiscordPresence | null = await axios.get(`https://discord.com/api/v10/guilds/${guildId}/members/${id}`, {
                headers: {
                    Authorization: `${config.token}`
                }
            }).then(res => res.data).catch(() => null);

            if (presence && presence.activities) {
                playing = presence.activities.find(activity => activity.type === 0)?.name ?? null;
                statusMessage = presence.activities.find(activity => activity.type === 4)?.state ?? null;
            }
        }

        return success({
            type: 'user',
            ...user,
            badges_string: badges.map(f => f),
            nitro: nitro,
            created_at: createdAt,
            banner_color: bannerColor,
            modified_avatar: avatar,
            playing,
            status_message: statusMessage
        });
    }

    // Try to get the guild if user is not found
    const guild: DiscordGuild | null = await axios.get(`https://discord.com/api/v10/guilds/${id}`, {
        headers: {
            Authorization: `${config.token}`
        }
    }).then(res => res.data).catch(() => null);

    if (guild) {
        const banner = guild.banner ? `https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}.png?size=4096` : null;
        return success({
            type: 'guild',
            ...guild,
            banner
        });
    }

    return error('User or Guild not found');
};

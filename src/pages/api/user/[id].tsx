import type { NextApiRequest, NextApiResponse } from "next";
import config from '../../../../project.config';
import axios from 'axios';
import { UserFlagsBitField, UserFlagsString, UserFlags } from 'discord.js';

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
    if (!id) return error('id is required');

    // Try to get the user
    const user = await axios.get(`https://discord.com/api/v10/users/${id}`, {
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
            };
        };

        const createdAt = new Date((user.id / 4194304) + 1420070400000).toISOString();
        const bannerColor = user.accent_color ? `#${user.accent_color.toString(16)}` : null;
        const avatar = user.avatar ? user.avatar.startsWith('a_') ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.gif?size=4096` : `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=4096` : 'https://cdn.discordapp.com/embed/avatars/0.png';

        // Check if the user has a banner, is not a bot, and has a GIF avatar
        if (user.banner && !user.bot && user.avatar && user.avatar.startsWith('a_')) {
            badges.push('discordnitro');
        }

        return success({
            type: 'user',
            ...user,
            badges_string: badges.map(f => f),
            nitro: (user.avatar && user.avatar.startsWith('a_')) || user.banner ? true : false,
            created_at: createdAt,
            banner_color: bannerColor,
            modified_avatar: avatar
        });
    }

    // Try to get the guild if user is not found
    const guild = await axios.get(`https://discord.com/api/v10/guilds/${id}`, {
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

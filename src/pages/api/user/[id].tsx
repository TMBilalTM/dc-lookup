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

// Hata işleme fonksiyonu
function handleError(error: unknown): string {
    if (axios.isAxiosError(error) && error.response) {
        return error.response.data?.msg || error.message;
    }
    return (error as Error).message || 'An unexpected error occurred';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

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
        return res.status(500).json({ ok: false, msg: 'Error fetching user data' });
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

        return res.status(200).json({
            ok: true,
            data: {
                type: 'user',
                ...user,
                badges_string: badges,
                nitro,
                created_at: createdAt,
                banner_color: bannerColor,
                modified_avatar: avatar
            }
        });
    }

    return res.status(404).json({ ok: false, msg: 'User not found' });
}

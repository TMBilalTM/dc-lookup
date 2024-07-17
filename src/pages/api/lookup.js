import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'Kullanıcı ID gereklidir' });
  }

  try {
    const userResponse = await fetch(`https://discord.com/api/v10/users/${userId}`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    });

    if (userResponse.ok) {
      const userData = await userResponse.json();
      const defaultAvatarUrl = 'https://cdn.discordapp.com/embed/avatars/0.png'; // Varsayılan avatar URL'si

      const avatarUrl = userData.avatar
        ? `https://cdn.discordapp.com/avatars/${userId}/${userData.avatar}.${userData.avatar.startsWith('a_') ? 'gif' : 'png'}?size=256`
        : defaultAvatarUrl;

      const bannerUrl = userData.banner
        ? `https://cdn.discordapp.com/banners/${userId}/${userData.banner}.${userData.banner.startsWith('a_') ? 'gif' : 'png'}?size=512`
        : null;

      const createdAt = new Date((userId / 4194304) + 1420070400000).toISOString();
      const bannerColor = userData.accent_color ? `#${userData.accent_color.toString(16)}` : null;

      // Rozetler
      const flags = userData.public_flags;
      const badgeIcons = [];
      const badgeNames = [];

      if (flags & 1) {
        badgeNames.push('Discord Staff');
        badgeIcons.push(getBadgeSvg('discord-staff.svg'));
      }
      if (flags & 2) {
        badgeNames.push('Partner Sunucu Sahibi');
        badgeIcons.push(getBadgeSvg('partner-sunucu-sahibi.svg'));
      }
      if (flags & 4) {
        badgeNames.push('HypeSquad Etkinlikleri');
        badgeIcons.push(getBadgeSvg('hypesquad-etkinlikleri.svg'));
      }
      if (flags & 8) {
        badgeNames.push('Hata Avcisi Seviye 1');
        badgeIcons.push(getBadgeSvg('hata-avcisi-seviye-1.svg'));
      }
      if (flags & 4194304) {
        badgeNames.push('Aktif Gelistirici');
        badgeIcons.push(getBadgeSvg('aktif-gelistirici.svg'));
      }
      if (flags & 65536) {
        badgeNames.push('Dogrulanmis Bot');
        badgeIcons.push(getBadgeSvg('dogrulanmis-bot.svg'));
      }
      if (flags & 64) {
        badgeNames.push('House Bravery');
        badgeIcons.push(getBadgeSvg('house-bravery.svg'));
      }
      if (flags & 262144) {
        badgeNames.push('Moderator Program Mezunu');
        badgeIcons.push(getBadgeSvg('moderator-program-mezunu.svg'));
      }
      if (flags & 128) {
        badgeNames.push('House Brilliance');
        badgeIcons.push(getBadgeSvg('house-brilliance.svg'));
      }
      if (flags & 256) {
        badgeNames.push('House Balance');
        badgeIcons.push(getBadgeSvg('house-balance.svg'));
      }
      if (flags & 512) {
        badgeNames.push('Erken Destekci');
        badgeIcons.push(getBadgeSvg('erken-destekci.svg'));
      }
      if (flags & 16384) {
        badgeNames.push('Hata Avcisi Seviye 2');
        badgeIcons.push(getBadgeSvg('hata-avcisi-seviye-2.svg'));
      }
      if (flags & 131072) {
        badgeNames.push('Erken Doğrulanmis Bot Gelistiricisi');
        badgeIcons.push(getBadgeSvg('erken-dogrulanmis-bot-gelistiricisi.svg'));
      }
      if (flags & 8388608) {
        badgeNames.push('Slash komutlarini destekler');
        badgeIcons.push(getBadgeSvg('supportscommands.svg'));
      }
      if (flags & 16777216) {
        badgeNames.push('Automod');
        badgeIcons.push(getBadgeSvg('automod.svg'));
      }

      // Nitro kontrolü
      if (userData.premium_type === 1 || userData.premium_type === 2) {
        badgeNames.push('Nitro Abonesi');
        badgeIcons.push(getBadgeSvg('nitro-abonesi.svg'));
      }

      // Avatar Dekorasyonları
      const avatarDecorations = userData.avatar_decoration_data ? userData.avatar_decoration_data : null;

      // Sunucu Booster kontrolü
      const guildsResponse = await fetch(`https://discord.com/api/v9/users/@me/guilds`, {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      });

      const guilds = guildsResponse.ok ? await guildsResponse.json() : [];

      const boostedGuilds = [];
      for (const guild of guilds) {
        const guildMemberResponse = await fetch(`https://discord.com/api/v9/guilds/${guild.id}/members/${userId}`, {
          headers: {
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          },
        });

        if (guildMemberResponse.ok) {
          const guildMember = await guildMemberResponse.json();
          if (guildMember.premium_since) {
            boostedGuilds.push(guild.name);
          }
        }
      }

      if (boostedGuilds.length > 0) {
        badgeNames.push('Sunucu Booster');
        badgeIcons.push(getBadgeSvg('server-booster.svg'));
      }

      res.status(200).json({
        id: userId,
        username: `${userData.username}`,
        avatar_url: avatarUrl,
        banner_url: bannerUrl,
        created_at: createdAt,
        banner_color: bannerColor,
        badges: badgeNames,
        badge_icons: badgeIcons,
        avatar_decorations: avatarDecorations,
        guilds,
        boosted_guilds: boostedGuilds,
      });
    } else {
      res.status(userResponse.status).json({ error: userResponse.statusText });
    }
  } catch (error) {
    res.status(500).json({ error: 'Sunucu İç Hatası' });
  }
}

function getBadgeSvg(filename) {
  const filePath = path.join(process.cwd(), 'public', 'svg', 'badges', filename);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return fileContents;
}

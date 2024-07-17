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
      const avatarUrl = userData.avatar
        ? `https://cdn.discordapp.com/avatars/${userId}/${userData.avatar}.${userData.avatar.startsWith('a_') ? 'gif' : 'png'}?size=256`
        : null;
      const bannerUrl = userData.banner
        ? `https://cdn.discordapp.com/banners/${userId}/${userData.banner}.${userData.banner.startsWith('a_') ? 'gif' : 'png'}?size=512`
        : null;

      const createdAt = new Date((userId / 4194304) + 1420070400000).toISOString();
      const bannerColor = userData.banner_color ? `${userData.banner_color.toString(16)}` : null;

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
        badgeNames.push('Erken Dogrulanmis Bot Gelistiricisi');
        badgeIcons.push(getBadgeSvg('erken-dogrulanmis-bot-gelistiricisi.svg'));
      }
      if (flags & 8388608) {
        badgeNames.push('Slash komutlarını destekler');
        badgeIcons.push(getBadgeSvg('supportscommands.svg'));
      }
      if (flags & 16777216) {
        badgeNames.push('Automod kullanıyor');
        badgeIcons.push(getBadgeSvg('automod.svg'));
      }

      // Kullanıcının bulunduğu sunucuları çekmek
      const guildsResponse = await fetch(`https://discord.com/api/v9/users/@me/guilds`, {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      });
      const guilds = guildsResponse.ok ? await guildsResponse.json() : [];

      // Kullanıcının botlarını kontrol etmek
      const bots = guilds.filter(guild => guild.owner_id === userId).map(guild => ({
        id: guild.id,
        name: guild.name,
        icon_url: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : null,
      }));

      res.status(200).json({
        id: userId,
        username: `${userData.username}`,
        avatar_url: avatarUrl,
        banner_url: bannerUrl,
        created_at: createdAt,
        banner_color: bannerColor,
        badges: badgeNames,
        badge_icons: badgeIcons,
        guilds,
        bots,
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

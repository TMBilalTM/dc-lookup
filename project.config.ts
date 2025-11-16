const TOKEN_ENV_KEYS = ['DISCORD_BOT_TOKEN', 'BOT_TOKEN'] as const;

export function getDiscordBotToken(): string {
    for (const key of TOKEN_ENV_KEYS) {
        const candidate = process.env[key];
        if (candidate) {
            return candidate;
        }
    }

    throw new Error('Discord bot token missing. Set DISCORD_BOT_TOKEN (preferred) or BOT_TOKEN in your environment.');
}

const config = {
    get token() {
        return getDiscordBotToken();
    }
};

export default config;

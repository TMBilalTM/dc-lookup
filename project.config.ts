export function getDiscordBotToken(): string {
    const token = process.env.DISCORD_BOT_TOKEN;

    if (!token) {
        throw new Error('DISCORD_BOT_TOKEN environment variable is not defined.');
    }

    return token;
}

const config = {
    get token() {
        return getDiscordBotToken();
    }
};

export default config;

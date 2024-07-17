// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import axios from 'axios';

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  secret: process.env.DISCORD_CLIENT_SECRET, // Bunu çevre değişkenlerinde tanımlayın
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken;

      if (token.accessToken) {
        try {
          const response = await axios.get('https://discord.com/api/v9/users/@me', {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          });

          const { id, avatar } = response.data;
          session.user.discordId = id;
          session.user.avatar = avatar;
        } catch (error) {
          console.error('Error fetching user profile:', error.response?.data || error.message);
        }
      }

      return session;
    },
  },
});

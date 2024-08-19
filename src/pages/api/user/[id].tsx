import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import config from '../../../../project.config';
// Ensure your Discord bot token is stored in a safe place, such as an environment variable

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;



  try {
    // Fetch data from the Discord API
    const response = await axios.get(`https://discord.com/api/v10/users/${id}`, {
      headers: {
        Authorization: `Bot ${config.token}`,
      },
    });

    if (response.status !== 200) {
      return res.status(404).json({
        ok: false,
        message: 'User or Guild not found! The server widget system may not be turned on.',
      });
    }

    const data = response.data;

    return res.status(200).json({
      ok: true,
      data,
    });
  } catch (error) {
    // Handle specific Discord API errors
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        ok: false,
        message: 'User or Guild not found! The server widget system may not be turned on.',
      });
    }

    // Handle other errors
    return res.status(500).json({
      ok: false,
      message: 'An error occurred while fetching the data.',
    });
  }
}

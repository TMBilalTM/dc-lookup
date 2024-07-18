import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import config from '../../../project.config';

// Define the path to the history file
const historyFilePath = path.join(process.cwd(), 'data', 'history.json');

// Function to read the search history from file
function readSearchHistory(): any[] {
  try {
    const historyData = fs.readFileSync(historyFilePath, 'utf-8');
    return JSON.parse(historyData);
  } catch (error) {
    // If the file doesn't exist or is empty, return an empty array
    return [];
  }
}

// Function to write the search history to file
function writeSearchHistory(history: any[]): void {
  try {
    fs.writeFileSync(historyFilePath, JSON.stringify(history));
  } catch (error) {
    console.error('Error writing search history:', error);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const searchHistory = readSearchHistory();
    return res.status(200).json({ ok: true, data: searchHistory });
  } else if (req.method === 'POST') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ ok: false, msg: 'id is required' });

    let data;
    let type: string;

    // First check if the ID is a user
    data = await axios.get(`https://discord.com/api/v10/users/${id}`, {
      headers: {
        Authorization: `${config.token}`
      }
    }).then(res => res.data).catch(() => null);

    if (data) {
      type = 'user';
    } else {
      // If not a user, check if it's a guild
      data = await axios.get(`https://discord.com/api/v10/guilds/${id}`, {
        headers: {
          Authorization: `${config.token}`
        }
      }).then(res => res.data).catch(() => null);

      if (data) {
        type = 'guild';
      } else {
        return res.status(404).json({ ok: false, msg: 'User or Guild not found' });
      }
    }

    const entry = {
      id: data.id,
      type: type,
      name: data.username || data.name,
      icon: data.avatar ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png?size=4096` : null,
      banner: data.banner ? `https://cdn.discordapp.com/banners/${data.id}/${data.banner}.png?size=4096` : null,
    };

    // Read current search history from file
    let searchHistory = readSearchHistory();

    // Update search history (prepend new entry and keep up to 10 entries)
    searchHistory = [entry, ...searchHistory.slice(0, 9)];

    // Write updated search history back to file
    writeSearchHistory(searchHistory);

    return res.status(200).json({ ok: true, data: entry });
  } else {
    return res.status(405).json({ ok: false, msg: 'Method not allowed' });
  }
}

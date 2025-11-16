import type { NextApiRequest, NextApiResponse } from "next";
import { getDiscoveryGuilds } from "../../../discoveryStore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ ok: false, msg: 'Method Not Allowed' });
    }

    try {
        const data = await getDiscoveryGuilds();
        return res.status(200).json({ ok: true, data });
    } catch (error) {
        console.error('Failed to read discovery guild store:', error);
        return res.status(500).json({ ok: false, msg: 'Keşif listesi alınamadı. Lütfen tekrar deneyin.' });
    }
}

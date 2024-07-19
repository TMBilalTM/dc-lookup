// pages/api/history.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { getHistory } from '../../../historyStore';

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const history = getHistory();
    return res.status(200).json({ ok: true, history });
}

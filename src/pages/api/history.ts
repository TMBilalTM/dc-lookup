import type { NextApiRequest, NextApiResponse } from "next";
import { loadHistory, saveHistory } from '../../../utils/localStorage';

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const history = loadHistory();
    return res.status(200).json({ ok: true, history });
}

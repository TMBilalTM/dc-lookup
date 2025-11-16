import { promises as fs } from 'fs';
import path from 'path';
import type { DiscoveryGuildSummary } from './types/discovery';

const STORE_PATH = path.join(process.cwd(), 'data', 'discovery-guilds.json');

interface DiscoveryGuildUpsertPayload {
    id: string;
    name: string;
    icon: string | null;
    banner: string | null;
    description?: string | null;
    member_count?: number | null;
    presence_count?: number | null;
    verification_level?: number | null;
    features?: string[];
    instant_invite?: string | null;
    premiumTier?: number | null;
    premiumSubscriptionCount?: number | null;
}

async function ensureStoreFile() {
    try {
        await fs.access(STORE_PATH);
    } catch {
        await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
        await fs.writeFile(STORE_PATH, '[]', 'utf-8');
    }
}

async function readStore(): Promise<DiscoveryGuildSummary[]> {
    await ensureStoreFile();

    try {
        const raw = await fs.readFile(STORE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
            return parsed as DiscoveryGuildSummary[];
        }
        return [];
    } catch {
        return [];
    }
}

async function writeStore(data: DiscoveryGuildSummary[]) {
    await fs.writeFile(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getDiscoveryGuilds(): Promise<DiscoveryGuildSummary[]> {
    const data = await readStore();
    return data.sort((a, b) => (b.member_count ?? 0) - (a.member_count ?? 0));
}

export async function upsertDiscoveryGuild(entry: DiscoveryGuildUpsertPayload): Promise<DiscoveryGuildSummary> {
    const now = new Date().toISOString();
    const store = await readStore();
    const index = store.findIndex((guild) => guild.id === entry.id);

    const normalized: DiscoveryGuildSummary = {
        id: entry.id,
        name: entry.name,
        icon: entry.icon ?? null,
        banner: entry.banner ?? null,
        description: entry.description ?? store[index]?.description ?? null,
        member_count: entry.member_count ?? null,
        presence_count: entry.presence_count ?? null,
        verification_level: entry.verification_level ?? null,
        features: entry.features ?? [],
        instant_invite: entry.instant_invite ?? null,
        firstDiscoveredAt: index >= 0 ? store[index].firstDiscoveredAt : now,
        lastSyncedAt: now,
        premiumTier: entry.premiumTier ?? store[index]?.premiumTier ?? null,
        premiumSubscriptionCount: entry.premiumSubscriptionCount ?? store[index]?.premiumSubscriptionCount ?? null,
    };

    if (index >= 0) {
        store[index] = { ...store[index], ...normalized, lastSyncedAt: now };
    } else {
        store.push(normalized);
    }

    await writeStore(store);
    return normalized;
}

import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import type { DiscoveryGuildSummary } from './types/discovery';

const PRIMARY_STORE_PATH = process.env.DISCOVERY_STORE_PATH
    ?? path.join(process.cwd(), 'data', 'discovery-guilds.json');
const TEMP_DIRECTORY = process.env.DISCOVERY_STORE_TMP_DIR ?? os.tmpdir();
const FALLBACK_STORE_PATH = process.env.DISCOVERY_STORE_FALLBACK_PATH
    ?? path.join(TEMP_DIRECTORY, 'dc-lookup', 'discovery-guilds.json');

let resolvedStorePath: string | null = null;
let attemptedPrimary = false;
let attemptedFallback = false;

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

function isReadOnlyFsError(error: unknown) {
    if (!error || typeof error !== 'object') return false;
    const code = (error as NodeJS.ErrnoException).code;
    return code === 'EROFS' || code === 'EACCES' || code === 'EPERM';
}

async function ensureStoreFile(targetPath: string) {
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    try {
        await fs.access(targetPath);
    } catch {
        await fs.writeFile(targetPath, '[]', 'utf-8');
    }
}

async function resolveStorePath(): Promise<string | null> {
    if (resolvedStorePath) return resolvedStorePath;

    if (!attemptedPrimary) {
        attemptedPrimary = true;
        try {
            await ensureStoreFile(PRIMARY_STORE_PATH);
            resolvedStorePath = PRIMARY_STORE_PATH;
            return resolvedStorePath;
        } catch (error) {
            if (isReadOnlyFsError(error)) {
                console.warn('Discovery store primary path is read-only. Falling back to tmp.');
            } else {
                console.warn('Discovery store primary path unavailable:', error);
            }
        }
    }

    if (!attemptedFallback && FALLBACK_STORE_PATH) {
        attemptedFallback = true;
        try {
            await ensureStoreFile(FALLBACK_STORE_PATH);
            resolvedStorePath = FALLBACK_STORE_PATH;
            console.warn(`Discovery store using fallback path: ${FALLBACK_STORE_PATH}`);
            return resolvedStorePath;
        } catch (error) {
            console.error('Discovery store fallback path unavailable:', error);
        }
    }

    return null;
}

async function readStore(): Promise<DiscoveryGuildSummary[]> {
    const targetPath = await resolveStorePath();
    if (!targetPath) return [];

    try {
        const raw = await fs.readFile(targetPath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
            return parsed as DiscoveryGuildSummary[];
        }
        return [];
    } catch (error) {
        console.error('Failed to read discovery store:', error);
        return [];
    }
}

async function writeStore(data: DiscoveryGuildSummary[]) {
    const targetPath = await resolveStorePath();
    if (!targetPath) {
        throw new Error('DISCOVERY_STORE_UNAVAILABLE');
    }

    try {
        await fs.writeFile(targetPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        if (isReadOnlyFsError(error) && targetPath !== FALLBACK_STORE_PATH) {
            resolvedStorePath = null;
            return writeStore(data);
        }
        throw error;
    }
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

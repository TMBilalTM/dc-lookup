export interface DiscoveryGuildSummary {
    id: string;
    name: string;
    icon: string | null;
    banner: string | null;
    description: string | null;
    member_count: number | null;
    presence_count: number | null;
    verification_level: number | null;
    features: string[];
    instant_invite: string | null;
    firstDiscoveredAt: string;
    lastSyncedAt: string;
    premiumTier: number | null;
    premiumSubscriptionCount: number | null;
}

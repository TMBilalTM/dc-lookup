// historyStore.ts

interface HistoryEntry {
    id: string;
    name: string;
    avatar: string;
    type:string;
}

let history: HistoryEntry[] = [];

export function addToHistory(entry: HistoryEntry) {
    history.push(entry);
    // Optionally, limit the history size, persist it, etc.
}

export function getHistory(): HistoryEntry[] {
    return history;
}

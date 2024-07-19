// utils/localStorage.ts

interface HistoryEntry {
    id: string;
    name: string;
    avatar: string;
    type: 'user' | 'guild';
}

const HISTORY_KEY = 'ASDOJAFKSAvmaduwdQQDSD239548';

export function saveHistory(history: HistoryEntry[]) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function loadHistory(): HistoryEntry[] {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
}

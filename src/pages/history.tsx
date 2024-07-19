import { useEffect, useState } from 'react';
import axios from 'axios';
import { loadHistory, saveHistory } from '../../utils/localStorage';

interface HistoryEntry {
    id: string;
    name: string;
    avatar: string;
    type: 'user' | 'guild';
}

export default function HistoryPage() {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setHistory(loadHistory());
    }, []);

    useEffect(() => {
        saveHistory(history);
    }, [history]);

    useEffect(() => {
        async function fetchHistory() {
            try {
                const response = await axios.get('/api/history');
                if (response.data.ok) {
                    setHistory(response.data.history);
                } else {
                    setError('Failed to fetch history.');
                }
            } catch (err) {
                setError('An error occurred while fetching history.');
            }
        }
        fetchHistory();
    }, []);

    if (error) {
        return <div className="container mx-auto p-4 text-red-600">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-extrabold mb-6 text-gray-800">Request History</h1>
            <ul className="space-y-4">
                {history.map((entry) => (
                    <li key={entry.id} className="flex items-center space-x-4 border rounded-lg shadow-md bg-white p-4">
                        <img 
                            src={entry.avatar}
                            alt={entry.name} 
                            className="w-16 h-16 rounded-full border border-gray-300" 
                        />
                        <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                                <div className={`text-lg font-semibold ${entry.type === 'user' ? 'text-blue-600' : 'text-green-600'}`}>
                                    {entry.name}
                                </div>
                                <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${entry.type === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                    {entry.type ? entry.type.charAt(0).toUpperCase() + entry.type.slice(1) : 'Unknown'}
                                </span>
                            </div>
                            <div className="text-sm text-gray-600">{entry.id}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

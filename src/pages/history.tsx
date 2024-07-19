// pages/history.tsx

import { useEffect, useState } from 'react';
import axios from 'axios';

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
            <span
                className="w-full block h-[35rem] absolute -z-[1] select-none mask top-0 left-0 right-0"
                draggable={false}
                style={{
                    backgroundImage: 'url(https://img.freepik.com/free-photo/vivid-blurred-colorful-wallpaper-background_58702-3798.jpg?size=626&ext=jpg&ga=GA1.1.2008272138.1721174400&semt=ais_user)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <p className="text-5xl text-[#0e172b]/90 font-bold tracking-tighter text-center">Discord Lookup</p>
            <p className="text-[#0e172b]/60 font-medium tracking-tighter mt-4 text-center">Request History</p><br></br>
            <ul className="space-y-4">
                {history.length === 0 ? (
                    <li className="flex items-center space-x-4 border rounded-lg shadow-md bg-primary-bg-color p-4">
                        <img
                            src="https://cdn.discordapp.com/embed/avatars/0.png"
                            alt="Example"
                            className="w-16 h-16 rounded-full border border-gray-300"
                        />
                        <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                                <div className={`text-lg font-semibold text-green-600`}>
                                    Example
                                </div>
                                <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800`}>
                                    User
                                </span>
                            </div>
                            <div className="text-sm">123456789</div>
                        </div>
                    </li>
                ) : (
                    history.map((entry) => (
                        <li key={entry.id} className="flex items-center space-x-4 border rounded-lg shadow-md bg-primary-bg-color p-4">
                            <img 
                                src={entry.avatar}
                                alt={entry.name} 
                                className="w-16 h-16 rounded-full border border-gray-300" 
                            />
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                    <div className={`text-lg font-semibold ${entry.type === 'user' ? 'text-primary-color' : 'text-green-600'}`}>
                                        {entry.name}
                                    </div>
                                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${entry.type === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                        {entry.type ? entry.type.charAt(0).toUpperCase() + entry.type.slice(1) : 'Unknown'}
                                    </span>
                                </div>
                                <div className="text-sm">{entry.id}</div>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}

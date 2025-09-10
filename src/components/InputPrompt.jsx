// Componente: InputPrompt.jsx
// Descripción: Input para que el usuario escriba el prompt y botón para generar playlist

import React, { useState } from 'react';

export default function InputPrompt({ onSubmit, horizontalOnDesktop }) {
    const [prompt, setPrompt] = useState('');
    const [artist, setArtist] = useState('');
    const [count, setCount] = useState(5);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (prompt.trim() || artist.trim()) {
            onSubmit({ prompt, artist, count });
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`w-full ${horizontalOnDesktop ? 'flex flex-col md:flex-row gap-3 mb-4' : 'flex flex-col gap-3 mb-4'}`}>
            <input
                type="text"
                className="flex-1 min-w-[180px] bg-neutral-800 text-white placeholder-neutral-400 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition"
                placeholder="Género o vibra musical..."
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
            />
            <input
                type="text"
                className="flex-1 min-w-[180px] bg-neutral-800 text-white placeholder-neutral-400 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition"
                placeholder="Artista (opcional)"
                value={artist}
                onChange={e => setArtist(e.target.value)}
            />
            <select
                className="bg-neutral-800 text-white border border-neutral-700 rounded-lg px-3 py-3 focus:outline-none focus:border-blue-500 transition min-w-[140px]"
                value={count}
                onChange={e => setCount(Number(e.target.value))}
            >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                    <option key={n} value={n}>{n} canciones</option>
                ))}
            </select>
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg px-6 py-3 transition w-full md:w-auto">
                Generar Playlist
            </button>
        </form>
    );
}

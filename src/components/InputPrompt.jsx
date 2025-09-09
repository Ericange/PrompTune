// Componente: InputPrompt.jsx
// Descripción: Input para que el usuario escriba el prompt y botón para generar playlist

import React, { useState } from 'react';

export default function InputPrompt({ onSubmit }) {
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
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4 items-center">
            <input
                type="text"
                className="flex-1 border rounded px-3 py-2"
                placeholder="Género o vibra musical..."
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
            />
            <input
                type="text"
                className="border rounded px-3 py-2"
                placeholder="Artista (opcional)"
                value={artist}
                onChange={e => setArtist(e.target.value)}
                style={{ width: 180 }}
            />
            <select
                className="border rounded px-2 py-2"
                value={count}
                onChange={e => setCount(Number(e.target.value))}
            >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                    <option key={n} value={n}>{n} canciones</option>
                ))}
            </select>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                Generar Playlist
            </button>
        </form>
    );
}

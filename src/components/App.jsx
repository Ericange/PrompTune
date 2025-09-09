import React, { useState } from 'react';
import InputPrompt from './InputPrompt.jsx';
import Player from './Player.jsx';

export default function App() {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handlePrompt({ prompt, count }) {
        if (!prompt || !prompt.trim()) {
            setError('El prompt no puede estar vacío.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/playlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, count })
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Error al generar playlist');
                setTracks([]);
                return;
            }
            setTracks(data.tracks || []);
        } catch (e) {
            setError('Error de red o servidor.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-xl mx-auto py-10">
            <h1 className="text-2xl font-bold mb-4">Generador de Playlists</h1>
            <InputPrompt onSubmit={handlePrompt} />
            {loading && <div className="mb-4">Generando playlist...</div>}
            {error && <div className="mb-4 text-red-600">{error}</div>}
            <Player trackUrls={tracks} />
        </div>
    );
}

import React, { useState } from 'react';
import InputPrompt from './InputPrompt.jsx';
import YouTubePlayerWithEnd from './YouTubePlayerWithEnd.jsx';

export default function App() {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentIdx, setCurrentIdx] = useState(0);

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
                setCurrentIdx(0);
                return;
            }
            setTracks(data.tracks || []);
            setCurrentIdx(0);
        } catch (e) {
            setError('Error de red o servidor.');
        } finally {
            setLoading(false);
        }
    }

    // Extraer videoId de la URL (mejorada para más formatos)
    function extractVideoId(url) {
        if (!url) return null;
        // Soporta varios formatos de YouTube
        const regex = /(?:v=|\/embed\/|\.be\/|v=|youtu\.be\/|\/v\/|\/shorts\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    const currentUrl = tracks[currentIdx];
    const currentVideoId = extractVideoId(currentUrl);
    const queue = tracks.slice(currentIdx + 1);

    return (
        <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center py-10">
            {/* FORMULARIO */}
            <div className="w-full max-w-3xl bg-neutral-900 rounded-2xl shadow-lg p-8 border border-neutral-800 flex flex-col items-center gap-8">
                <div className="flex items-center gap-3 mb-2">
                    <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-blue-500"><path d="M12 3v18m0 0c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <h1 className="text-3xl font-bold text-white tracking-tight" style={{ fontFamily: 'ZariantzBookDemo, sans-serif', fontWeight: 700 }}>Generador de Playlists</h1>
                </div>
                <div className="w-full">
                    <InputPrompt onSubmit={handlePrompt} horizontalOnDesktop />
                </div>
                {loading && <div className="mb-2 text-blue-400 text-sm">Generando playlist...</div>}
                {error && <div className="mb-2 text-red-400 text-sm">{error}</div>}
            </div>
            {/* REPRODUCTOR Y COLA */}
            {tracks.length > 0 && (
                <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 items-start mt-12">
                    {/* REPRODUCTOR CENTRADO */}
                    <div className="flex-1 flex justify-center">
                        <div className="rounded-xl overflow-hidden shadow-lg bg-black border border-neutral-800 w-full max-w-2xl aspect-video flex items-center justify-center min-h-[200px]">
                            {currentVideoId ? (
                                <YouTubePlayerWithEnd
                                    videoId={currentVideoId}
                                    onEnd={() => {
                                        if (currentIdx < tracks.length - 1) {
                                            setCurrentIdx(currentIdx + 1);
                                        }
                                    }}
                                />
                            ) : (
                                <div className="text-neutral-400 text-center w-full">No se pudo cargar el video.</div>
                            )}
                        </div>
                    </div>
                    {/* COLA A LA DERECHA EN DESKTOP, DEBAJO EN MOBILE */}
                    <div className="w-full md:w-72 bg-neutral-800 rounded-xl p-4 shadow flex flex-col gap-2 mt-8 md:mt-0">
                        <h2 className="text-white text-lg font-semibold mb-2">Cola</h2>
                        {queue.length === 0 ? (
                            <div className="text-neutral-400 text-sm">No hay más canciones en la cola.</div>
                        ) : (
                            queue.map((url, idx) => (
                                <div key={url} className="truncate text-neutral-200 text-sm px-2 py-1 rounded hover:bg-neutral-700 cursor-pointer"
                                    onClick={() => setCurrentIdx(currentIdx + idx + 1)}>
                                    {url}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

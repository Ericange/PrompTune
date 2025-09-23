import React, { useState, useEffect } from 'react';
import InputPrompt from './InputPrompt.jsx';
import YouTubePlayerWithEnd from './YouTubePlayerWithEnd.jsx';

export default function App() {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentIdx, setCurrentIdx] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    // Detectar tema oscuro del sistema
    const [darkMode, setDarkMode] = useState(true);

    useEffect(() => {
        // Efecto de animación al cargar
        document.body.classList.add('fade-in');
        return () => document.body.classList.remove('fade-in');
    }, []);

    async function handlePrompt({ prompt, artist, count, allowDuplicateArtists }) {
        if (!prompt.trim() && !artist.trim()) {
            setError('Por favor ingresa un género o un artista.');
            return;
        }

        // Limpiar playlist actual y detener reproducción antes de generar nueva
        setTracks([]);
        setCurrentIdx(0);
        setIsPlaying(false);
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/playlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, artist, count, allowDuplicateArtists })
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
            setIsPlaying(true);
        } catch (e) {
            setError('Error de red o servidor.');
        } finally {
            setLoading(false);
        }
    }

    // Extraer videoId de la URL
    function extractVideoId(url) {
        if (!url) return null;

        // Soporta varios formatos de YouTube
        const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url?.match(regex);

        return match && match[1] ? match[1] : null;
    }

    // Obtener metadatos del video actual (título)
    function getTrackNumber(index) {
        return (index + 1).toString().padStart(2, '0');
    }

    const currentTrack = tracks[currentIdx];
    const currentUrl = currentTrack?.url;
    const currentVideoId = extractVideoId(currentUrl);
    const queue = tracks.slice(currentIdx + 1);

    // Avanzar a la siguiente canción
    const handleNext = () => {
        if (currentIdx < tracks.length - 1) {
            setCurrentIdx(currentIdx + 1);
        }
    };

    // Retroceder a la canción anterior
    const handlePrevious = () => {
        if (currentIdx > 0) {
            setCurrentIdx(currentIdx - 1);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-neutral-950 to-neutral-900 flex flex-col items-center justify-start py-8 px-4">
            {/* HEADER - LOGO & TITLE */}
            <div className="w-full max-w-6xl mb-8">
                <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                    <div className="relative">
                        <svg width="40" height="40" fill="none" viewBox="0 0 24 24" className="text-blue-500">
                            <path d="M12 3v18m0 0c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight"
                        style={{ fontFamily: 'ZariantzBookDemo, sans-serif' }}>
                        PrompTune
                    </h1>
                </div>
                <p className="text-center sm:text-left text-neutral-400 text-sm mt-1 ml-1">
                    Genera playlists musicales con inteligencia artificial
                </p>
            </div>

            {/* FORMULARIO */}
            <div className="w-full max-w-4xl bg-neutral-900/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-neutral-800 flex flex-col items-center gap-6">
                <div className="w-full">
                    <InputPrompt onSubmit={handlePrompt} horizontalOnDesktop />
                </div>

                {loading && (
                    <div className="flex items-center gap-2 text-blue-400 text-sm">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {tracks.length > 0 ? 'Generando nueva playlist...' : 'Generando playlist con IA...'}
                    </div>
                )}

                {error && (
                    <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-lg">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </div>
                )}
            </div>

            {/* REPRODUCTOR Y COLA */}
            {tracks.length > 0 && (
                <div className="w-full max-w-6xl flex flex-col xl:flex-row gap-8 items-start mt-12 animate-fadeIn">
                    {/* REPRODUCTOR Y CONTROLES */}
                    <div className="flex-1 flex flex-col items-center">
                        <div className="w-full max-w-2xl relative group">
                            {/* Player Container con Glow Effect */}
                            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-3xl transform group-hover:bg-blue-500/30 transition-all duration-500"></div>

                            <div className="relative rounded-3xl shadow-2xl border border-neutral-800/50 bg-black w-full max-w-2xl aspect-video">
                                {currentVideoId ? (
                                    <div className="w-full h-full rounded-3xl overflow-hidden">
                                        <YouTubePlayerWithEnd
                                            key={`player-${currentVideoId}`}
                                            videoId={currentVideoId}
                                            onEnd={handleNext}
                                        />
                                    </div>
                                ) : (
                                    <div className="h-full flex items-center justify-center bg-neutral-900 rounded-3xl">
                                        <div className="text-neutral-400 text-center w-full p-6">
                                            {tracks.length > 0
                                                ? "No se pudo extraer el ID del video de YouTube."
                                                : "No hay videos en la playlist."}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Track Info Overlay - No interfiere con controles */}
                            <div className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-3xl pointer-events-none">
                                <div className="text-white font-medium truncate">
                                    {currentTrack ? (
                                        <span>#{getTrackNumber(currentIdx)} {currentTrack.title}</span>
                                    ) : ''}
                                </div>
                            </div>
                        </div>

                        {/* Controles */}
                        <div className="flex items-center justify-center gap-6 mt-6 mb-2">
                            <button
                                onClick={handlePrevious}
                                disabled={currentIdx === 0}
                                className={`p-3 rounded-full ${currentIdx === 0 ? 'text-neutral-600' : 'text-white hover:bg-white/10'} transition-all duration-200`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <div className="w-10 h-10 flex items-center justify-center">
                                {currentVideoId ? (
                                    <div className="relative flex items-center justify-center">
                                        <div className="absolute inset-0 bg-blue-500/30 rounded-full animate-ping opacity-75"></div>
                                        <div className="relative bg-blue-500 p-2 rounded-full">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-neutral-800"></div>
                                )}
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={currentIdx >= tracks.length - 1}
                                className={`p-3 rounded-full ${currentIdx >= tracks.length - 1 ? 'text-neutral-600' : 'text-white hover:bg-white/10'} transition-all duration-200`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full max-w-md h-1 bg-neutral-800 rounded-full mt-2 mb-8">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                style={{ width: `${(currentIdx / (tracks.length - 1)) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* PLAYLIST CONTAINER */}
                    <div className="w-full xl:w-[480px] bg-neutral-900/70 backdrop-blur-md rounded-3xl shadow-xl border border-neutral-800/50 p-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-white text-xl font-semibold">Playlist</h2>
                            <div className="flex items-center gap-1 text-blue-400 text-xs bg-blue-500/10 px-3 py-1 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                </svg>
                                {tracks.length} canciones
                            </div>
                        </div>

                        {/* Lista actual + cola */}
                        <div className="overflow-y-auto max-h-[600px] pr-2 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900">
                            <div className="space-y-1">
                                {tracks.map((track, idx) => {
                                    const isCurrentTrack = idx === currentIdx;

                                    return (
                                        <div
                                            key={`${track.url}-${idx}`}
                                            className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 ${isCurrentTrack
                                                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30'
                                                : 'hover:bg-neutral-800/70 border border-transparent'
                                                }`}
                                            onClick={() => setCurrentIdx(idx)}
                                        >
                                            <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${isCurrentTrack ? 'bg-blue-500 text-white' : 'bg-neutral-800 text-neutral-400'
                                                }`}>
                                                {isCurrentTrack ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <span>{getTrackNumber(idx)}</span>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className={`line-clamp-2 leading-tight ${isCurrentTrack ? 'text-white font-medium' : 'text-neutral-300'}`}>
                                                    {track.title}
                                                </div>
                                                {track.channelTitle && (
                                                    <div className="text-xs text-neutral-500 truncate mt-1">
                                                        {track.channelTitle}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

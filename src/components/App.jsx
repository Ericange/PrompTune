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
        <div className="min-h-screen relative overflow-hidden bg-black">
            {/* Background Musical Waves */}
            <div className="absolute inset-0">
                <svg width="100%" height="100%" viewBox="0 0 1200 800" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                    <defs>
                        <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.04)" />
                            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.12)" />
                            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.04)" />
                        </linearGradient>
                        <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.02)" />
                            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.08)" />
                            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.02)" />
                        </linearGradient>
                        <linearGradient id="waveGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.01)" />
                            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.05)" />
                            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.01)" />
                        </linearGradient>
                    </defs>

                    {/* Primera capa de ondas - bottom */}
                    <path
                        d="M0,500 Q300,420 600,500 T1200,500 L1200,800 L0,800 Z"
                        fill="url(#waveGradient1)"
                        className="wave-layer-1"
                    />

                    {/* Segunda capa de ondas - middle */}
                    <path
                        d="M0,550 Q200,480 400,550 T800,550 Q1000,480 1200,550 L1200,800 L0,800 Z"
                        fill="url(#waveGradient2)"
                        className="wave-layer-2"
                    />

                    {/* Tercera capa de ondas - front */}
                    <path
                        d="M0,600 Q150,520 300,600 T600,600 Q750,520 900,600 T1200,600 L1200,800 L0,800 Z"
                        fill="url(#waveGradient3)"
                        className="wave-layer-3"
                    />

                    {/* Ondas superiores sutiles - top accent */}
                    <path
                        d="M0,150 Q400,80 800,150 T1200,150 L1200,0 L0,0 Z"
                        fill="url(#waveGradient3)"
                        className="wave-ripple"
                    />

                    {/* Líneas de frecuencia musical - centro */}
                    {Array.from({ length: 8 }, (_, i) => (
                        <rect
                            key={`freq-${i}`}
                            x={150 + (i * 130)}
                            y={350 + Math.sin(i * 0.5) * 30}
                            width="3"
                            height="100"
                            fill="rgba(255, 255, 255, 0.05)"
                            className="music-particle"
                            style={{
                                animationDelay: `${i * 0.2}s`,
                                transformOrigin: 'bottom'
                            }}
                        />
                    ))}

                    {/* Partículas musicales flotantes */}
                    {Array.from({ length: 15 }, (_, i) => (
                        <circle
                            key={`particle-${i}`}
                            cx={80 + (i * 80)}
                            cy={200 + Math.sin(i * 0.7) * 100}
                            r="1"
                            fill="rgba(255, 255, 255, 0.1)"
                            className="music-particle"
                            style={{
                                animationDelay: `${i * 0.3}s`,
                                animationDuration: '5s'
                            }}
                        />
                    ))}
                </svg>
            </div>

            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-start py-8 px-4">
                {/* HEADER - LOGO & TITLE CON DISEÑO NEURONAL */}
                <div className="w-full max-w-6xl mb-12">
                    <div className="flex items-center justify-center gap-6 mb-4">
                        <div className="relative float-animation">
                            <div className="absolute inset-0 bg-white/10 blur-xl rounded-full neural-pulse"></div>
                            <img
                                src="/promptune-high-resolution-logo.png"
                                alt="PrompTune Logo"
                                className="w-16 h-16 object-contain relative z-10"
                            />
                        </div>
                        <div className="text-center">
                            <h1 className="text-6xl font-bold text-white tracking-tight"
                                style={{ fontFamily: 'Afacad, sans-serif' }}>
                                PrompTune
                            </h1>
                            {/* Musical Wave Indicators */}
                            <div className="flex justify-center gap-1 mt-2">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <div
                                        key={i}
                                        className="w-1 bg-white rounded-full music-wave"
                                        style={{ height: `${8 + Math.random() * 16}px` }}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <p className="text-center text-gray-300 text-lg font-medium tracking-wide">
                        Escribe lo que sientes, escucha lo que necesitas.
                    </p>
                </div>

                {/* FORMULARIO CON EFECTO CRISTAL */}
                <div className="w-full max-w-5xl glass-effect rounded-3xl shadow-2xl p-8 border border-white/20 mb-8">
                    <div className="w-full">
                        <InputPrompt onSubmit={handlePrompt} horizontalOnDesktop />
                    </div>

                    {loading && (
                        <div className="flex flex-col items-center gap-4 text-white text-lg mt-6">
                            <div className="relative">
                                <div className="w-12 h-12 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
                                <div className="absolute inset-0 w-12 h-12 border-4 border-gray-700 border-r-gray-300 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                            </div>
                            <div className="text-center">
                                <p className="font-semibold">{tracks.length > 0 ? '🎵 Generando nueva playlist...' : '🧠 Procesando con IA...'}</p>
                                <div className="flex justify-center gap-1 mt-2">
                                    {Array.from({ length: 3 }, (_, i) => (
                                        <div
                                            key={i}
                                            className="w-2 h-2 bg-white rounded-full animate-bounce"
                                            style={{ animationDelay: `${i * 0.2}s` }}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="flex items-center justify-center gap-3 text-gray-300 text-lg bg-red-900/20 px-6 py-4 rounded-2xl border border-red-800/30 mt-6">
                            <div className="w-6 h-6 bg-red-700 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="font-medium">{error}</span>
                        </div>
                    )}
                </div>

                {/* REPRODUCTOR Y PLAYLIST CON DISEÑO NEURONAL */}
                {tracks.length > 0 && (
                    <div className="w-full max-w-7xl flex flex-col xl:flex-row gap-8 items-start animate-fadeIn">
                        {/* REPRODUCTOR Y CONTROLES */}
                        <div className="flex-1 flex flex-col items-center">
                            <div className="w-full max-w-2xl relative group">
                                {/* Efecto de halo neuronal */}
                                <div className="absolute inset-0 bg-white/10 blur-2xl rounded-3xl neural-pulse"></div>

                                <div className="relative glass-effect rounded-3xl shadow-2xl border border-white/20 bg-black/50 w-full aspect-video overflow-hidden">
                                    {currentVideoId ? (
                                        <div className="w-full h-full rounded-3xl overflow-hidden">
                                            <YouTubePlayerWithEnd
                                                key={`player-${currentVideoId}`}
                                                videoId={currentVideoId}
                                                onEnd={handleNext}
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                            <div className="w-24 h-24 mb-6 flex items-center justify-center glass-effect rounded-full">
                                                <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-300 text-lg font-medium">
                                                {tracks.length > 0 ? "🎵 Error al cargar el video" : "🧠 No hay videos en la playlist"}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Track Info Overlay - Diseño neuronal */}
                                <div className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-6 rounded-b-3xl">
                                    <div className="text-white font-semibold text-lg truncate">
                                        {currentTrack ? (
                                            <span className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-black">
                                                    {getTrackNumber(currentIdx)}
                                                </div>
                                                <span className="text-white">
                                                    {currentTrack.title}
                                                </span>
                                            </span>
                                        ) : ''}
                                    </div>
                                </div>
                            </div>

                            {/* Controles con diseño neuronal */}
                            <div className="flex items-center justify-center gap-8 mt-8 mb-4">
                                <button
                                    onClick={handlePrevious}
                                    disabled={currentIdx === 0}
                                    className={`p-4 rounded-full transition-all duration-300 ${currentIdx === 0
                                        ? 'text-gray-600 cursor-not-allowed'
                                        : 'text-white hover:text-gray-300 hover:bg-white/10 glass-effect neural-pulse'
                                        }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                <div className="relative">
                                    {currentVideoId ? (
                                        <div className="relative flex items-center justify-center">
                                            <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20"></div>
                                            <div className="relative bg-white p-4 rounded-full shadow-lg">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 glass-effect rounded-full flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6l5-3-5-3z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={handleNext}
                                    disabled={currentIdx >= tracks.length - 1}
                                    className={`p-4 rounded-full transition-all duration-300 ${currentIdx >= tracks.length - 1
                                        ? 'text-gray-600 cursor-not-allowed'
                                        : 'text-white hover:text-gray-300 hover:bg-white/10 glass-effect neural-pulse'
                                        }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>

                            {/* Progress Bar Neuronal */}
                            <div className="w-full max-w-md mt-4">
                                <div className="flex items-center justify-between text-white text-sm mb-2">
                                    <span>Track {currentIdx + 1}</span>
                                    <span>{tracks.length} total</span>
                                </div>
                                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-white rounded-full transition-all duration-300"
                                        style={{ width: `${((currentIdx + 1) / tracks.length) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* PLAYLIST CON DISEÑO NEURONAL */}
                        <div className="w-full xl:w-[480px] relative">
                            {/* Efecto de halo neuronal para la playlist */}
                            <div className="absolute inset-0 bg-white/5 blur-xl rounded-3xl"></div>

                            <div className="relative glass-effect rounded-3xl shadow-2xl border border-white/20 bg-black/50 p-6 flex flex-col gap-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-white text-xl font-bold font-['Afacad']">
                                        Neural Playlist
                                    </h2>
                                    <div className="flex items-center gap-2 text-white text-sm glass-effect px-4 py-2 rounded-full border border-white/20">
                                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                                        <span className="font-semibold">{tracks.length}</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Lista de tracks con scroll neuronal */}
                                <div className="overflow-y-auto max-h-[600px] pr-2 scrollbar-thin scrollbar-thumb-white/50 scrollbar-track-gray-800">
                                    <div className="space-y-2">
                                        {tracks.map((track, idx) => {
                                            const isCurrentTrack = idx === currentIdx;
                                            const isPlayed = idx < currentIdx;

                                            return (
                                                <div
                                                    key={`${track.url}-${idx}`}
                                                    className={`group flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 ${isCurrentTrack
                                                        ? 'bg-white/20 border border-white/50 neural-pulse'
                                                        : isPlayed
                                                            ? 'bg-gray-800/20 border border-gray-700/30 opacity-70'
                                                            : 'hover:bg-white/10 border border-gray-600/20 hover:border-white/40'
                                                        }`}
                                                    onClick={() => setCurrentIdx(idx)}
                                                >
                                                    <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${isCurrentTrack
                                                        ? 'bg-white text-black shadow-lg shadow-white/50'
                                                        : isPlayed
                                                            ? 'bg-gray-700 text-gray-300'
                                                            : 'bg-gray-800 text-white group-hover:bg-gray-600 group-hover:text-white'
                                                        }`}>
                                                        {isCurrentTrack ? (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                                            </svg>
                                                        ) : isPlayed ? (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        ) : (
                                                            <span className="text-sm font-bold">{getTrackNumber(idx)}</span>
                                                        )}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className={`line-clamp-2 leading-tight transition-colors duration-300 ${isCurrentTrack
                                                            ? 'text-white font-semibold'
                                                            : isPlayed
                                                                ? 'text-gray-400'
                                                                : 'text-gray-300 group-hover:text-white'
                                                            }`}>
                                                            {track.title}
                                                        </div>
                                                        {track.channelTitle && (
                                                            <div className={`text-xs truncate mt-1 transition-colors duration-300 ${isCurrentTrack
                                                                ? 'text-gray-300'
                                                                : isPlayed
                                                                    ? 'text-gray-500'
                                                                    : 'text-gray-400 group-hover:text-gray-300'
                                                                }`}>
                                                                {track.channelTitle}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Visual neural indicator */}
                                                    <div className={`w-2 h-8 rounded-full transition-all duration-300 ${isCurrentTrack
                                                        ? 'bg-white shadow-lg shadow-white/50'
                                                        : isPlayed
                                                            ? 'bg-gray-700'
                                                            : 'bg-gray-600 group-hover:bg-gray-500'
                                                        }`}></div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

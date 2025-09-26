// Componente: InputPrompt.jsx
// Descripción: Input moderno y minimalista para generar playlist

import React, { useState } from 'react';

export default function InputPrompt({ onSubmit, horizontalOnDesktop }) {
    const [prompt, setPrompt] = useState('');
    const [artist, setArtist] = useState('');
    const [count, setCount] = useState(5);
    const [allowDuplicateArtists, setAllowDuplicateArtists] = useState(false);
    const [activeField, setActiveField] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (prompt.trim() || artist.trim()) {
            onSubmit({ prompt, artist, count, allowDuplicateArtists });
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Main Input Container */}
                <div className="relative glass-effect-dark rounded-2xl p-6 border border-white/10">
                    {/* Primary Inputs */}
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        {/* Genre/Vibe Input */}
                        <div className="relative group">
                            <label className="block text-white/70 text-sm font-medium mb-2 transition-colors group-focus-within:text-white">
                                Género o Vibra Musical
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full bg-black/40 text-white placeholder-white/40 border-0 border-b-2 border-white/20 rounded-none px-0 py-3 focus:outline-none focus:border-white transition-all duration-300 bg-transparent"
                                    placeholder="ej. jazz relajante, rock energético..."
                                    value={prompt}
                                    onChange={e => setPrompt(e.target.value)}
                                    onFocus={() => setActiveField('prompt')}
                                    onBlur={() => setActiveField('')}
                                />
                                <div className={`absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-300 ${activeField === 'prompt' ? 'w-full' : 'w-0'}`}></div>
                            </div>
                        </div>

                        {/* Artist Input */}
                        <div className="relative group">
                            <label className="block text-white/70 text-sm font-medium mb-2 transition-colors group-focus-within:text-white">
                                Artista Específico
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full bg-black/40 text-white placeholder-white/40 border-0 border-b-2 border-white/20 rounded-none px-0 py-3 focus:outline-none focus:border-white transition-all duration-300 bg-transparent"
                                    placeholder="ej. The Beatles, Taylor Swift... (opcional)"
                                    value={artist}
                                    onChange={e => setArtist(e.target.value)}
                                    onFocus={() => setActiveField('artist')}
                                    onBlur={() => setActiveField('')}
                                />
                                <div className={`absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-300 ${activeField === 'artist' ? 'w-full' : 'w-0'}`}></div>
                            </div>
                        </div>
                    </div>

                    {/* Settings Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        {/* Song Count */}
                        <div className="flex items-center gap-3">
                            <span className="text-white/70 text-sm font-medium min-w-max">Cantidad:</span>
                            <div className="relative">
                                <select
                                    className="bg-transparent text-white border-0 border-b border-white/30 focus:outline-none focus:border-white transition-colors duration-300 pr-8 py-1 appearance-none cursor-pointer"
                                    value={count}
                                    onChange={e => setCount(Number(e.target.value))}
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                        <option key={n} value={n} className="bg-black text-white">{n} canciones</option>
                                    ))}
                                </select>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Duplicate Artists Toggle */}
                        <div className="flex items-center gap-3">
                            <span className={`text-sm font-medium transition-colors ${artist.trim() ? 'text-white/40' : 'text-white/70'}`}>
                                Solo artistas únicos
                            </span>
                            <button
                                type="button"
                                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${artist.trim()
                                        ? 'bg-white/20 cursor-not-allowed'
                                        : allowDuplicateArtists ? 'bg-white' : 'bg-white/30'
                                    } ${!artist.trim() ? 'hover:bg-white/40' : ''}`}
                                onClick={() => !artist.trim() && setAllowDuplicateArtists(!allowDuplicateArtists)}
                                disabled={artist.trim() !== ''}
                            >
                                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-all duration-300 ${allowDuplicateArtists ? 'translate-x-6 bg-black' : 'translate-x-0 bg-white'
                                    } ${artist.trim() ? 'opacity-50' : ''}`}></div>
                            </button>
                            <span className={`text-sm font-medium transition-colors ${artist.trim() ? 'text-white/40' : 'text-white/70'}`}>
                                Permitir repetidos
                            </span>
                        </div>
                    </div>

                    {/* Generate Button */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={!prompt.trim() && !artist.trim()}
                            className="group relative bg-white hover:bg-white/90 disabled:bg-white/30 disabled:cursor-not-allowed text-black font-semibold rounded-full px-8 py-4 transition-all duration-300 min-w-[200px] overflow-hidden"
                        >
                            <div className="relative z-10 flex items-center justify-center gap-3">
                                <div className="w-5 h-5 flex items-center justify-center">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                                <span className="font-medium">Generar Playlist</span>
                            </div>

                            {/* Hover Effect */}
                            <div className="absolute inset-0 w-0 bg-black/5 group-hover:w-full transition-all duration-300 rounded-full"></div>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

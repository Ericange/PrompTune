// Componente: InputPrompt.jsx
// Descripción: Input para que el usuario escriba el prompt y botón para generar playlist

import React, { useState } from 'react';

export default function InputPrompt({ onSubmit, horizontalOnDesktop }) {
    const [prompt, setPrompt] = useState('');
    const [artist, setArtist] = useState('');
    const [count, setCount] = useState(5);
    const [focus, setFocus] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (prompt.trim() || artist.trim()) {
            onSubmit({ prompt, artist, count });
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`w-full ${horizontalOnDesktop ? 'flex flex-col md:flex-row gap-4 mb-4' : 'flex flex-col gap-4 mb-4'}`}>
            <div className="relative flex-1 min-w-[180px] group">
                <input
                    type="text"
                    className="w-full bg-neutral-800/80 text-white placeholder-neutral-400 border-2 border-neutral-700/80 rounded-xl px-5 py-3.5 focus:outline-none focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 shadow-inner"
                    placeholder="Género o vibra musical..."
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                />
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 rounded-full ${focus ? 'w-[95%] opacity-100' : 'w-0 opacity-0'}`}></div>
            </div>

            <div className="relative flex-1 min-w-[180px] group">
                <input
                    type="text"
                    className="w-full bg-neutral-800/80 text-white placeholder-neutral-400 border-2 border-neutral-700/80 rounded-xl px-5 py-3.5 focus:outline-none focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 shadow-inner"
                    placeholder="Artista (opcional)"
                    value={artist}
                    onChange={e => setArtist(e.target.value)}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                />
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 rounded-full ${focus ? 'w-[95%] opacity-100' : 'w-0 opacity-0'}`}></div>
            </div>

            <div className="md:flex-shrink-0">
                <div className="flex gap-3">
                    <select
                        className="bg-neutral-800/80 text-white border-2 border-neutral-700/80 rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 shadow-inner min-w-[140px]"
                        value={count}
                        onChange={e => setCount(Number(e.target.value))}
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                            <option key={n} value={n}>{n} canciones</option>
                        ))}
                    </select>

                    <button
                        type="submit"
                        className="relative bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl px-6 py-3.5 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 overflow-hidden group"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Generar</span>
                        </span>
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                    </button>
                </div>
            </div>
        </form>
    );
}

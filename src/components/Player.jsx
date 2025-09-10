// Componente: Player.jsx
// Descripción: Muestra un reproductor de SoundCloud embebido

import React from 'react';

export default function Player({ trackUrls = [] }) {
    if (!trackUrls.length) return null;
    const getYoutubeId = url => {
        const match = url.match(/v=([\w-]{11})/);
        return match ? match[1] : null;
    };
    return (
        <div className="space-y-8 mt-6">
            {trackUrls.map((url, idx) => {
                const videoId = getYoutubeId(url);
                if (!videoId) return null;
                return (
                    <div
                        key={idx}
                        className="rounded-xl overflow-hidden shadow-lg bg-gray-900 border border-gray-800 flex justify-center items-center"
                    >
                        <iframe
                            className="w-full aspect-video min-h-[200px] bg-black"
                            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                );
            })}
        </div>
    );
}

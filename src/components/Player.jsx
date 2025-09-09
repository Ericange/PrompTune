// Componente: Player.jsx
// Descripción: Muestra un reproductor de SoundCloud embebido

import React from 'react';

export default function Player({ trackUrls = [] }) {
    if (!trackUrls.length) return null;
    // Extraer el ID de YouTube de la URL
    const getYoutubeId = url => {
        const match = url.match(/v=([\w-]{11})/);
        return match ? match[1] : null;
    };
    return (
        <div className="space-y-4">
            {trackUrls.map((url, idx) => {
                const videoId = getYoutubeId(url);
                if (!videoId) return null;
                return (
                    <iframe
                        key={idx}
                        width="100%"
                        height="315"
                        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                );
            })}
        </div>
    );
}

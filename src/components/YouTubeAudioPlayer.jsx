import React, { useEffect, useRef } from 'react';

export default function YouTubeAudioPlayer({ videoId }) {
    const playerRef = useRef(null);

    useEffect(() => {
        // Cargar el script de la API de YouTube si no está presente
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            document.body.appendChild(tag);
        }

        window.onYouTubeIframeAPIReady = () => {
            playerRef.current = new window.YT.Player(`yt-audio-${videoId}`, {
                height: '0',
                width: '0',
                videoId,
                playerVars: {
                    controls: 1,
                    modestbranding: 1,
                    rel: 0,
                },
            });
        };
    }, [videoId]);

    return (
        <div>
            <div id={`yt-audio-${videoId}`} />
        </div>
    );
}

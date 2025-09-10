import React, { useEffect, useRef } from 'react';

export default function YouTubePlayerWithEnd({ videoId, onEnd }) {
    const playerRef = useRef(null);
    const playerInstanceRef = useRef(null);
    const containerId = 'yt-player-fixed';

    useEffect(() => {
        let isMounted = true;

        function createPlayer() {
            if (!isMounted || !videoId) return;
            if (playerInstanceRef.current) {
                playerInstanceRef.current.destroy();
                playerInstanceRef.current = null;
            }
            if (playerRef.current) {
                playerRef.current.innerHTML = '';
            }
            playerInstanceRef.current = new window.YT.Player(containerId, {
                height: 360,
                width: 640,
                videoId,
                playerVars: {
                    controls: 1,
                    modestbranding: 1,
                    rel: 0,
                },
                events: {
                    onStateChange: (event) => {
                        // 0 = ended
                        if (event.data === 0 && typeof onEnd === 'function') {
                            onEnd();
                        }
                    },
                },
            });
        }

        // Cargar el script solo una vez
        if (!window._ytScriptLoaded) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            document.body.appendChild(tag);
            window._ytScriptLoaded = true;
        }

        // Manejar correctamente el callback de la API
        function onYouTubeReady() {
            if (window.YT && window.YT.Player) {
                createPlayer();
            }
        }

        if (window.YT && window.YT.Player) {
            createPlayer();
        } else {
            // No sobrescribir el callback si ya existe
            const prev = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = function () {
                if (typeof prev === 'function') prev();
                onYouTubeReady();
            };
        }

        return () => {
            isMounted = false;
            if (playerInstanceRef.current) {
                playerInstanceRef.current.destroy();
                playerInstanceRef.current = null;
            }
            if (playerRef.current) {
                playerRef.current.innerHTML = '';
            }
        };
    }, [videoId, onEnd]);

    return (
        <div ref={playerRef} className="w-full aspect-video flex items-center justify-center">
            <div id={containerId} className="mx-auto" />
        </div>
    );
}

import React, { useEffect, useRef, useState } from 'react';

/**
 * Componente reproductor de YouTube con detección de finalización
 * @param {string} videoId - ID del video de YouTube
 * @param {function} onEnd - Callback a ejecutar cuando el video termina
 */
export default function YouTubePlayerWithEnd({ videoId, onEnd }) {
    const containerRef = useRef(null);
    const playerRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);

    // Simular progreso de carga
    useEffect(() => {
        if (isLoading && !isError) {
            const interval = setInterval(() => {
                setLoadingProgress(prev => {
                    // Llegar hasta 90% máximo (el 100% será cuando realmente cargue)
                    const nextProgress = prev + (Math.random() * 15);
                    return Math.min(nextProgress, 90);
                });
            }, 400);

            return () => clearInterval(interval);
        } else if (!isLoading) {
            setLoadingProgress(100);
        }
    }, [isLoading, isError]);

    // Cargar la API de YouTube
    useEffect(() => {
        if (!window.YT && !document.getElementById('youtube-iframe-api')) {
            const tag = document.createElement('script');
            tag.id = 'youtube-iframe-api';
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScript = document.getElementsByTagName('script')[0];
            firstScript.parentNode.insertBefore(tag, firstScript);
        }
    }, []);

    // Inicializar el reproductor cuando cambia el videoId
    useEffect(() => {
        if (!videoId) return;

        let isComponentMounted = true;
        setIsLoading(true);
        setIsError(false);
        setLoadingProgress(0);

        const initPlayer = () => {
            // Limpiar reproductor anterior si existe
            if (playerRef.current) {
                try {
                    playerRef.current.destroy();
                    playerRef.current = null;
                } catch (e) {
                    console.error('Error al destruir el reproductor anterior:', e);
                }
            }

            try {
                playerRef.current = new window.YT.Player(containerRef.current, {
                    videoId,
                    width: '100%',
                    height: '100%',
                    playerVars: {
                        autoplay: 1,
                        controls: 1,
                        modestbranding: 1,
                        rel: 0,
                        color: 'white',
                        playsinline: 1,
                    },
                    events: {
                        onReady: () => {
                            if (isComponentMounted) {
                                setIsLoading(false);
                            }
                        },
                        onStateChange: (event) => {
                            // 0 = video terminado
                            if (event.data === 0 && onEnd) {
                                onEnd();
                            }
                        },
                        onError: () => {
                            if (isComponentMounted) {
                                setIsError(true);
                                setIsLoading(false);
                            }
                        }
                    }
                });
            } catch (error) {
                console.error('Error al crear el reproductor de YouTube:', error);
                if (isComponentMounted) {
                    setIsError(true);
                    setIsLoading(false);
                }
            }
        };

        // Si la API ya está cargada, inicializar el reproductor
        if (window.YT && window.YT.Player) {
            initPlayer();
        } else {
            // Si no está cargada, agregar callback
            window.onYouTubeIframeAPIReady = function () {
                if (isComponentMounted) {
                    initPlayer();
                }
            };
        }

        // Limpieza al desmontar
        return () => {
            isComponentMounted = false;
            if (playerRef.current) {
                try {
                    playerRef.current.destroy();
                    playerRef.current = null;
                } catch (e) {
                    console.error('Error al limpiar el reproductor:', e);
                }
            }
        };
    }, [videoId, onEnd]);

    return (
        <div className="w-full h-full aspect-video relative">
            {/* Contenedor para el iframe de YouTube */}
            <div ref={containerRef} className="w-full h-full min-h-[360px]"></div>

            {/* Estados de carga */}
            {isLoading && !isError && (
                <div className="absolute inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-10">
                    <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <div className="text-white mb-4">Cargando reproductor...</div>

                    {/* Barra de progreso */}
                    <div className="w-48 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                            style={{ width: `${loadingProgress}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {/* Estado de error */}
            {isError && (
                <div className="absolute inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-red-500 font-medium mb-2">Error al cargar el video</div>
                    <p className="text-neutral-400 text-sm text-center max-w-xs">
                        No se pudo reproducir este video. Intenta con otro o revisa tu conexión a internet.
                    </p>
                </div>
            )}
        </div>
    );
}

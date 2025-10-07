import { c as createComponent, a as createAstro, b as addAttribute, r as renderHead, e as renderSlot, f as renderTemplate, g as renderComponent } from '../chunks/astro/server_CEWY_R4y.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                                 */
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
export { renderers } from '../renderers.mjs';

const $$Astro$1 = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Layout;
  return renderTemplate`<html lang="en" data-astro-cid-sckkx6r4> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>PrompTune</title>${renderHead()}</head> <body data-astro-cid-sckkx6r4> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "C:/Users/PC/PrompTune/src/layouts/Layout.astro", void 0);

function InputPrompt({ onSubmit, horizontalOnDesktop }) {
  const [prompt, setPrompt] = useState("");
  const [artist, setArtist] = useState("");
  const [count, setCount] = useState(5);
  const [allowDuplicateArtists, setAllowDuplicateArtists] = useState(false);
  const [activeField, setActiveField] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim() || artist.trim()) {
      onSubmit({ prompt, artist, count, allowDuplicateArtists });
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "w-full max-w-4xl mx-auto", children: /* @__PURE__ */ jsx("form", { onSubmit: handleSubmit, className: "space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "relative glass-effect-dark rounded-2xl p-6 border border-white/10", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-4 mb-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
        /* @__PURE__ */ jsx("label", { className: "block text-white/70 text-sm font-medium mb-2 transition-colors group-focus-within:text-white", children: "Género o Vibra Musical" }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              className: "w-full bg-black/40 text-white placeholder-white/40 border-0 border-b-2 border-white/20 rounded-none px-0 py-3 focus:outline-none focus:border-white transition-all duration-300 bg-transparent",
              placeholder: "ej. jazz relajante, rock energético...",
              value: prompt,
              onChange: (e) => setPrompt(e.target.value),
              onFocus: () => setActiveField("prompt"),
              onBlur: () => setActiveField("")
            }
          ),
          /* @__PURE__ */ jsx("div", { className: `absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-300 ${activeField === "prompt" ? "w-full" : "w-0"}` })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
        /* @__PURE__ */ jsx("label", { className: "block text-white/70 text-sm font-medium mb-2 transition-colors group-focus-within:text-white", children: "Artista Específico" }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              className: "w-full bg-black/40 text-white placeholder-white/40 border-0 border-b-2 border-white/20 rounded-none px-0 py-3 focus:outline-none focus:border-white transition-all duration-300 bg-transparent",
              placeholder: "ej. The Beatles, Taylor Swift... (opcional)",
              value: artist,
              onChange: (e) => setArtist(e.target.value),
              onFocus: () => setActiveField("artist"),
              onBlur: () => setActiveField("")
            }
          ),
          /* @__PURE__ */ jsx("div", { className: `absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-300 ${activeField === "artist" ? "w-full" : "w-0"}` })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("span", { className: "text-white/70 text-sm font-medium min-w-max", children: "Cantidad:" }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            "select",
            {
              className: "bg-transparent text-white border-0 border-b border-white/30 focus:outline-none focus:border-white transition-colors duration-300 pr-8 py-1 appearance-none cursor-pointer",
              value: count,
              onChange: (e) => setCount(Number(e.target.value)),
              children: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20].map((n) => /* @__PURE__ */ jsxs("option", { value: n, className: "bg-black text-white", children: [
                n,
                " canciones"
              ] }, n))
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none", children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-white/50", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs("span", { className: `text-sm font-medium transition-colors ${artist.trim() ? "text-white/40" : "text-white/70"}`, children: [
          "Artistas Repetidos (",
          allowDuplicateArtists ? "Sí" : "No",
          ")"
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: `relative w-12 h-6 rounded-full transition-colors duration-300 ${artist.trim() ? "bg-white/20 cursor-not-allowed" : allowDuplicateArtists ? "bg-white" : "bg-white/30"} ${!artist.trim() ? "hover:bg-white/40" : ""}`,
            onClick: () => !artist.trim() && setAllowDuplicateArtists(!allowDuplicateArtists),
            disabled: artist.trim() !== "",
            children: /* @__PURE__ */ jsx("div", { className: `absolute top-1 left-1 w-4 h-4 rounded-full transition-all duration-300 ${allowDuplicateArtists ? "translate-x-6 bg-black" : "translate-x-0 bg-white"} ${artist.trim() ? "opacity-50" : ""}` })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxs(
      "button",
      {
        type: "submit",
        disabled: !prompt.trim() && !artist.trim(),
        className: "group relative bg-white hover:bg-white/90 disabled:bg-white/30 disabled:cursor-not-allowed text-black font-semibold rounded-full px-8 py-4 transition-all duration-300 min-w-[200px] overflow-hidden",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex items-center justify-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-5 h-5 flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M8 5v14l11-7z" }) }) }),
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Generar Playlist" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 w-0 bg-black/5 group-hover:w-full transition-all duration-300 rounded-full" })
        ]
      }
    ) })
  ] }) }) });
}

function YouTubePlayerWithEnd({ videoId, onEnd }) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  useEffect(() => {
    if (isLoading && !isError) {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          const nextProgress = prev + Math.random() * 15;
          return Math.min(nextProgress, 90);
        });
      }, 400);
      return () => clearInterval(interval);
    } else if (!isLoading) {
      setLoadingProgress(100);
    }
  }, [isLoading, isError]);
  useEffect(() => {
    if (!window.YT && !document.getElementById("youtube-iframe-api")) {
      const tag = document.createElement("script");
      tag.id = "youtube-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScript = document.getElementsByTagName("script")[0];
      firstScript.parentNode.insertBefore(tag, firstScript);
    }
  }, []);
  useEffect(() => {
    if (!videoId) return;
    let isComponentMounted = true;
    setIsLoading(true);
    setIsError(false);
    setLoadingProgress(0);
    const initPlayer = () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
          playerRef.current = null;
        } catch (e) {
          console.error("Error al destruir el reproductor anterior:", e);
        }
      }
      try {
        playerRef.current = new window.YT.Player(containerRef.current, {
          videoId,
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: 1,
            controls: 2,
            // Controles siempre visibles y totalmente funcionales
            modestbranding: 1,
            // Reducir branding de YouTube
            rel: 0,
            // No mostrar videos relacionados
            color: "white",
            // Color de la barra de progreso
            playsinline: 1,
            // Reproducir inline en móviles
            enablejsapi: 1,
            // Habilitar API de JavaScript
            fs: 1,
            // Permitir pantalla completa
            iv_load_policy: 3,
            // No mostrar anotaciones
            disablekb: 0,
            // Permitir controles por teclado
            showinfo: 0,
            // No mostrar info del video
            origin: window.location.origin
            // Establecer origen para mejor compatibilidad
          },
          events: {
            onReady: (event) => {
              if (isComponentMounted) {
                setIsLoading(false);
                try {
                  setTimeout(() => {
                    if (playerRef.current && playerRef.current.getIframe) {
                      const iframe = playerRef.current.getIframe();
                      if (iframe) {
                        iframe.style.pointerEvents = "auto";
                        iframe.style.touchAction = "auto";
                      }
                    }
                  }, 100);
                } catch (e) {
                  console.warn("No se pudieron configurar los controles del iframe:", e);
                }
              }
            },
            onStateChange: (event) => {
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
        console.error("Error al crear el reproductor de YouTube:", error);
        if (isComponentMounted) {
          setIsError(true);
          setIsLoading(false);
        }
      }
    };
    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = function() {
        if (isComponentMounted) {
          initPlayer();
        }
      };
    }
    return () => {
      isComponentMounted = false;
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
          playerRef.current = null;
        } catch (e) {
          console.error("Error al limpiar el reproductor:", e);
        }
      }
    };
  }, [videoId, onEnd]);
  return /* @__PURE__ */ jsxs("div", { className: "w-full h-full aspect-video relative", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: containerRef,
        className: "w-full h-full min-h-[360px]",
        style: {
          position: "relative",
          zIndex: 1,
          pointerEvents: "auto",
          touchAction: "auto"
        }
      }
    ),
    isLoading && !isError && /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-20", children: [
      /* @__PURE__ */ jsxs("svg", { className: "animate-spin h-10 w-10 text-blue-500 mb-4", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
        /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
        /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "text-white mb-4", children: "Cargando reproductor..." }),
      /* @__PURE__ */ jsx("div", { className: "w-48 h-1.5 bg-neutral-800 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300",
          style: { width: `${loadingProgress}%` }
        }
      ) })
    ] }),
    isError && /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-20", children: [
      /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-12 w-12 text-red-500 mb-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
      /* @__PURE__ */ jsx("div", { className: "text-red-500 font-medium mb-2", children: "Error al cargar el video" }),
      /* @__PURE__ */ jsx("p", { className: "text-neutral-400 text-sm text-center max-w-xs", children: "No se pudo reproducir este video. Intenta con otro o revisa tu conexión a internet." })
    ] })
  ] });
}

function App() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  useEffect(() => {
    document.body.classList.add("fade-in");
    return () => document.body.classList.remove("fade-in");
  }, []);
  useEffect(() => {
    if (tracks.length > 0) {
      console.log("Playlist updated with", tracks.length, "tracks");
    }
  }, [tracks]);
  async function handlePrompt({ prompt, artist, count, allowDuplicateArtists }) {
    if (!prompt.trim() && !artist.trim()) {
      setError("Por favor ingresa un género o un artista.");
      return;
    }
    setTracks([]);
    setCurrentIdx(0);
    setIsPlaying(false);
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, artist, count, allowDuplicateArtists })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al generar playlist");
        setTracks([]);
        setCurrentIdx(0);
        setIsPlaying(false);
        return;
      }
      const newTracks = data.tracks || [];
      setTracks([...newTracks]);
      setCurrentIdx(0);
      setIsPlaying(newTracks.length > 0);
    } catch (e) {
      setError("Error de red o servidor.");
      setTracks([]);
      setCurrentIdx(0);
      setIsPlaying(false);
    } finally {
      setLoading(false);
    }
  }
  function extractVideoId(url) {
    if (!url) return null;
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url?.match(regex);
    return match && match[1] ? match[1] : null;
  }
  function getTrackNumber(index) {
    return (index + 1).toString().padStart(2, "0");
  }
  const currentTrack = tracks[currentIdx];
  const currentUrl = currentTrack?.url;
  const currentVideoId = extractVideoId(currentUrl);
  tracks.slice(currentIdx + 1);
  const handleNext = () => {
    if (currentIdx < tracks.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };
  const handlePrevious = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen relative overflow-hidden bg-black", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0", children: /* @__PURE__ */ jsxs("svg", { width: "100%", height: "100%", viewBox: "0 0 1200 800", className: "w-full h-full", preserveAspectRatio: "xMidYMid slice", children: [
      /* @__PURE__ */ jsxs("defs", { children: [
        /* @__PURE__ */ jsxs("linearGradient", { id: "waveGradient1", x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [
          /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "rgba(255, 255, 255, 0.04)" }),
          /* @__PURE__ */ jsx("stop", { offset: "50%", stopColor: "rgba(255, 255, 255, 0.12)" }),
          /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "rgba(255, 255, 255, 0.04)" })
        ] }),
        /* @__PURE__ */ jsxs("linearGradient", { id: "waveGradient2", x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [
          /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "rgba(255, 255, 255, 0.02)" }),
          /* @__PURE__ */ jsx("stop", { offset: "50%", stopColor: "rgba(255, 255, 255, 0.08)" }),
          /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "rgba(255, 255, 255, 0.02)" })
        ] }),
        /* @__PURE__ */ jsxs("linearGradient", { id: "waveGradient3", x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [
          /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "rgba(255, 255, 255, 0.01)" }),
          /* @__PURE__ */ jsx("stop", { offset: "50%", stopColor: "rgba(255, 255, 255, 0.05)" }),
          /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "rgba(255, 255, 255, 0.01)" })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "path",
        {
          d: "M0,500 Q300,420 600,500 T1200,500 L1200,800 L0,800 Z",
          fill: "url(#waveGradient1)",
          className: "wave-layer-1"
        }
      ),
      /* @__PURE__ */ jsx(
        "path",
        {
          d: "M0,550 Q200,480 400,550 T800,550 Q1000,480 1200,550 L1200,800 L0,800 Z",
          fill: "url(#waveGradient2)",
          className: "wave-layer-2"
        }
      ),
      /* @__PURE__ */ jsx(
        "path",
        {
          d: "M0,600 Q150,520 300,600 T600,600 Q750,520 900,600 T1200,600 L1200,800 L0,800 Z",
          fill: "url(#waveGradient3)",
          className: "wave-layer-3"
        }
      ),
      /* @__PURE__ */ jsx(
        "path",
        {
          d: "M0,150 Q400,80 800,150 T1200,150 L1200,0 L0,0 Z",
          fill: "url(#waveGradient3)",
          className: "wave-ripple"
        }
      ),
      Array.from({ length: 8 }, (_, i) => /* @__PURE__ */ jsx(
        "rect",
        {
          x: 150 + i * 130,
          y: 350 + Math.sin(i * 0.5) * 30,
          width: "3",
          height: "100",
          fill: "rgba(255, 255, 255, 0.05)",
          className: "music-particle",
          style: {
            animationDelay: `${i * 0.2}s`,
            transformOrigin: "bottom"
          }
        },
        `freq-${i}`
      )),
      Array.from({ length: 15 }, (_, i) => /* @__PURE__ */ jsx(
        "circle",
        {
          cx: 80 + i * 80,
          cy: 200 + Math.sin(i * 0.7) * 100,
          r: "1",
          fill: "rgba(255, 255, 255, 0.1)",
          className: "music-particle",
          style: {
            animationDelay: `${i * 0.3}s`,
            animationDuration: "5s"
          }
        },
        `particle-${i}`
      ))
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 min-h-screen flex flex-col items-center justify-start py-8 px-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "w-full max-w-6xl mb-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-6 mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative float-animation", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-white/10 blur-xl rounded-full glow-pulse" }),
            /* @__PURE__ */ jsx(
              "img",
              {
                src: "/promptune-high-resolution-logo.png",
                alt: "PrompTune Logo",
                className: "w-16 h-16 object-contain relative z-10"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx(
              "h1",
              {
                className: "text-6xl font-bold text-white tracking-tight text-glow",
                style: { fontFamily: "Afacad, sans-serif" },
                children: "PrompTune"
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "flex justify-center gap-1 mt-2", children: Array.from({ length: 5 }, (_, i) => /* @__PURE__ */ jsx(
              "div",
              {
                className: "w-1 bg-white rounded-full music-wave",
                style: { height: `${8 + Math.random() * 16}px` }
              },
              i
            )) })
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-center text-gray-300 text-lg font-medium tracking-wide", children: "Escribe lo que sientes, escucha lo que necesitas." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "w-full max-w-5xl glass-effect rounded-3xl shadow-2xl p-8 border border-white/20 mb-8", children: [
        /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsx(InputPrompt, { onSubmit: handlePrompt, horizontalOnDesktop: true }) }),
        loading && /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4 text-white text-lg mt-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 border-4 border-gray-600 border-t-white rounded-full animate-spin" }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 w-12 h-12 border-4 border-gray-700 border-r-gray-300 rounded-full animate-spin", style: { animationDirection: "reverse", animationDuration: "1.5s" } })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold", children: tracks.length > 0 ? "🎵 Generando nueva playlist..." : "🧠 Procesando con IA..." }),
            /* @__PURE__ */ jsx("div", { className: "flex justify-center gap-1 mt-2", children: Array.from({ length: 3 }, (_, i) => /* @__PURE__ */ jsx(
              "div",
              {
                className: "w-2 h-2 bg-white rounded-full animate-bounce",
                style: { animationDelay: `${i * 0.2}s` }
              },
              i
            )) })
          ] })
        ] }),
        error && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3 text-gray-300 text-lg bg-red-900/20 px-6 py-4 rounded-2xl border border-red-800/30 mt-6", children: [
          /* @__PURE__ */ jsx("div", { className: "w-6 h-6 bg-red-700 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }),
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: error })
        ] })
      ] }),
      tracks.length > 0 && /* @__PURE__ */ jsxs("div", { className: "w-full max-w-7xl flex flex-col xl:flex-row gap-8 items-start scale-in", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center slide-in-left", children: [
          /* @__PURE__ */ jsxs("div", { className: "w-full max-w-2xl relative group", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-white/10 blur-2xl rounded-3xl glow-pulse" }),
            /* @__PURE__ */ jsx("div", { className: "relative glass-effect rounded-3xl shadow-2xl border border-white/20 bg-black/50 w-full aspect-video overflow-hidden", children: currentVideoId ? /* @__PURE__ */ jsx("div", { className: "w-full h-full rounded-3xl overflow-hidden", children: /* @__PURE__ */ jsx(
              YouTubePlayerWithEnd,
              {
                videoId: currentVideoId,
                onEnd: handleNext
              },
              `player-${currentVideoId}`
            ) }) : /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col items-center justify-center text-center p-8", children: [
              /* @__PURE__ */ jsx("div", { className: "w-24 h-24 mb-6 flex items-center justify-center glass-effect rounded-full", children: /* @__PURE__ */ jsx("svg", { className: "w-12 h-12 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5", d: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" }) }) }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-300 text-lg font-medium", children: tracks.length > 0 ? "🎵 Error al cargar el video" : "🧠 No hay videos en la playlist" })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "absolute left-0 right-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-6 rounded-b-3xl", children: /* @__PURE__ */ jsx("div", { className: "text-white font-semibold text-lg truncate", children: currentTrack ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-black", children: getTrackNumber(currentIdx) }),
              /* @__PURE__ */ jsx("span", { className: "text-white", children: currentTrack.title })
            ] }) : "" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-8 mt-8 mb-4", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handlePrevious,
                disabled: currentIdx === 0,
                className: `p-4 rounded-full transition-all duration-300 hover-lift ${currentIdx === 0 ? "text-gray-600 cursor-not-allowed" : "text-white hover:text-gray-300 hover:bg-white/10 glass-effect"}`,
                children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) })
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "relative", children: currentVideoId ? /* @__PURE__ */ jsxs("div", { className: "relative flex items-center justify-center", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-white rounded-full animate-ping opacity-20" }),
              /* @__PURE__ */ jsx("div", { className: "relative bg-white p-4 rounded-full shadow-lg hover-lift", children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8 text-black", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M8 5v14l11-7z" }) }) })
            ] }) : /* @__PURE__ */ jsx("div", { className: "w-16 h-16 glass-effect rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 9v6l5-3-5-3z" }) }) }) }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handleNext,
                disabled: currentIdx >= tracks.length - 1,
                className: `p-4 rounded-full transition-all duration-300 hover-lift ${currentIdx >= tracks.length - 1 ? "text-gray-600 cursor-not-allowed" : "text-white hover:text-gray-300 hover:bg-white/10 glass-effect"}`,
                children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md mt-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-white text-sm mb-2", children: [
              /* @__PURE__ */ jsxs("span", { children: [
                "Track ",
                currentIdx + 1
              ] }),
              /* @__PURE__ */ jsxs("span", { children: [
                tracks.length,
                " total"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-full h-2 bg-gray-800 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "h-full bg-white rounded-full transition-all duration-300",
                style: { width: `${(currentIdx + 1) / tracks.length * 100}%` }
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "w-full xl:w-[480px] relative slide-in-right", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-white/5 blur-xl rounded-3xl soft-pulse" }),
          /* @__PURE__ */ jsxs("div", { className: "relative glass-effect rounded-3xl shadow-2xl border border-white/20 bg-black/50 p-6 flex flex-col gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-white text-xl font-bold font-['Afacad']", children: "Cola" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-white text-sm glass-effect px-4 py-2 rounded-full border border-white/20", children: [
                /* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-white rounded-full" }),
                /* @__PURE__ */ jsx("span", { className: "font-semibold", children: tracks.length }),
                /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "overflow-y-auto max-h-[600px] pr-2 scrollbar-thin scrollbar-thumb-white/50 scrollbar-track-gray-800", children: /* @__PURE__ */ jsx("div", { className: "space-y-2", children: tracks.map((track, idx) => {
              const isCurrentTrack = idx === currentIdx;
              const isPlayed = idx < currentIdx;
              return /* @__PURE__ */ jsxs(
                "div",
                {
                  className: `group flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 hover-lift ${isCurrentTrack ? "bg-white/20 border border-white/50 scale-in" : isPlayed ? "bg-gray-800/20 border border-gray-700/30 opacity-70" : "hover:bg-white/10 border border-gray-600/20 hover:border-white/40"}`,
                  onClick: () => setCurrentIdx(idx),
                  children: [
                    /* @__PURE__ */ jsx("div", { className: `flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${isCurrentTrack ? "bg-white text-black shadow-lg shadow-white/50" : isPlayed ? "bg-gray-700 text-gray-300" : "bg-gray-800 text-white group-hover:bg-gray-600 group-hover:text-white"}`, children: isCurrentTrack ? /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z", clipRule: "evenodd" }) }) : isPlayed ? /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) : /* @__PURE__ */ jsx("span", { className: "text-sm font-bold", children: getTrackNumber(idx) }) }),
                    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsx("div", { className: `line-clamp-2 leading-tight transition-colors duration-300 ${isCurrentTrack ? "text-white font-semibold" : isPlayed ? "text-gray-400" : "text-gray-300 group-hover:text-white"}`, children: track.title }),
                      track.channelTitle && /* @__PURE__ */ jsx("div", { className: `text-xs truncate mt-1 transition-colors duration-300 ${isCurrentTrack ? "text-gray-300" : isPlayed ? "text-gray-500" : "text-gray-400 group-hover:text-gray-300"}`, children: track.channelTitle })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: `w-2 h-8 rounded-full transition-all duration-300 ${isCurrentTrack ? "bg-white shadow-lg shadow-white/50" : isPlayed ? "bg-gray-700" : "bg-gray-600 group-hover:bg-gray-500"}` })
                  ]
                },
                `track-${idx}-${track.url}`
              );
            }) }) })
          ] })
        ] })
      ] })
    ] })
  ] });
}

const $$Astro = createAstro();
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "App", App, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/PC/PrompTune/src/components/App.jsx", "client:component-export": "default" })} ` })}`;
}, "C:/Users/PC/PrompTune/src/pages/index.astro", void 0);

const $$file = "C:/Users/PC/PrompTune/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

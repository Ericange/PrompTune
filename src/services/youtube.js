// src/services/youtube.js
// Servicio para buscar canciones en YouTube usando la API pública de búsqueda

import dotenv from 'dotenv';
dotenv.config();
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;


// Busca el canal oficial o Topic de un artista en YouTube y retorna su channelId
async function getArtistChannelId(artist) {
    // 1. Buscar canal oficial
    let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&maxResults=1&q=${encodeURIComponent(artist)}&key=${YOUTUBE_API_KEY}`;
    try {
        let res = await fetch(url);
        let data = await res.json();
        if (Array.isArray(data.items) && data.items.length > 0) {
            return data.items[0].snippet.channelId || data.items[0].id.channelId;
        }
    } catch (e) { }
    // 2. Buscar canal Topic
    url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&maxResults=1&q=${encodeURIComponent(artist + ' - Topic')}&key=${YOUTUBE_API_KEY}`;
    try {
        let res = await fetch(url);
        let data = await res.json();
        if (Array.isArray(data.items) && data.items.length > 0) {
            return data.items[0].snippet.channelId || data.items[0].id.channelId;
        }
    } catch (e) { }
    return undefined;
}

// Búsqueda avanzada y ranking con enfoque en diversidad de artistas
export async function searchTracks(keywords, artist = '', options = {}) {
    // Si se especifica un artista, por defecto permitir duplicados
    // Si no se especifica artista (búsqueda por género), por defecto no permitir duplicados
    const defaultAllowDuplicates = artist ? true : false;
    const { allowDuplicateArtists = defaultAllowDuplicates, maxTracks = 5 } = options;
    const allTracks = [];
    let channelId = undefined;

    // Si no permitimos duplicados, necesitamos buscar más canciones para compensar el filtrado
    // Aumentar el límite de búsqueda para playlists más grandes (15, 20 canciones)
    const searchLimit = allowDuplicateArtists
        ? Math.max(15, Math.ceil(maxTracks * 1.5))
        : Math.max(20, maxTracks * 3);

    if (artist) {
        channelId = await getArtistChannelId(artist);
        console.log(`Canal encontrado para ${artist}:`, channelId || 'ninguno');
    }

    // Búsqueda individual por keyword
    for (const keyword of keywords) {
        let foundItemsForKeyword = 0;

        // Primero intentar con canal específico si existe
        if (channelId) {
            let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=${searchLimit}&q=${encodeURIComponent(keyword)}&key=${YOUTUBE_API_KEY}`;
            url += `&order=${options.order || 'relevance'}&videoCategoryId=10&type=video&videoDuration=medium&channelId=${channelId}`;
            console.log(`Buscando en canal específico: ${channelId} para keyword: ${keyword}`);

            try {
                const res = await fetch(url);
                const data = await res.json();
                console.log(`YouTube API response (canal específico) para "${keyword}":`, data.items?.length || 0, 'items');
                if (data.error) {
                    console.error('YouTube API Error:', data.error);
                }
                if (Array.isArray(data.items)) {
                    foundItemsForKeyword = data.items.length;
                    for (const item of data.items) {
                        allTracks.push({
                            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                            title: item.snippet.title,
                            channelTitle: item.snippet.channelTitle,
                            channelId: item.snippet.channelId,
                            description: item.snippet.description,
                            keyword: keyword
                        });
                    }
                }
            } catch (e) {
                console.error(`Error searching for keyword "${keyword}" in specific channel:`, e);
            }
        }

        // Si no encontró nada en canal específico o no hay canal, buscar generalmente
        if (foundItemsForKeyword === 0) {
            let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=${searchLimit}&q=${encodeURIComponent(keyword)}&key=${YOUTUBE_API_KEY}`;
            url += `&order=${options.order || 'relevance'}&videoCategoryId=10&type=video&videoDuration=medium`;
            console.log(`Búsqueda general para keyword: ${keyword}`);

            try {
                const res = await fetch(url);
                const data = await res.json();
                console.log(`YouTube API response (general) para "${keyword}":`, data.items?.length || 0, 'items');
                if (data.error) {
                    console.error('YouTube API Error:', data.error);
                }
                if (Array.isArray(data.items)) {
                    for (const item of data.items) {
                        allTracks.push({
                            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                            title: item.snippet.title,
                            channelTitle: item.snippet.channelTitle,
                            channelId: item.snippet.channelId,
                            description: item.snippet.description,
                            keyword: keyword
                        });
                    }
                }
            } catch (e) {
                console.error(`Error searching for keyword "${keyword}":`, e);
            }
        }
    }
    // Ranking interno mejorado con énfasis en contenido oficial
    function score(track) {
        let s = 0;
        const titleLower = track.title.toLowerCase();
        const channelLower = track.channelTitle.toLowerCase();

        // FILTRO CRÍTICO: Rechazar completamente mixes, compilaciones y playlists
        const rejectPatterns = [
            /\bmix\b/i,
            /\bmegamix\b/i,
            /\bcontinuous\b/i,
            /\bcompilaci[oó]n\b/i,
            /\bcompilation\b/i,
            /\bplaylist\b/i,
            /\balbum completo\b/i,
            /\bfull album\b/i,
            /\bmejores\s+(canciones|éxitos|hits)\b/i,
            /\bbest\s+(songs|hits|of)\b/i,
            /\btop\s+\d+/i,
            /\d+\s+(hours?|horas?|minutos?|minutes?)/i,
            /\bmedley\b/i,
            /\bmashup\b/i,
            /\&\s+más\b/i,
            /\&\s+more\b/i,
            /\bvarios\s+artistas\b/i,
            /\bvarious\s+artists\b/i,
        ];

        for (const pattern of rejectPatterns) {
            if (pattern.test(titleLower) || pattern.test(channelLower)) {
                return -100; // Puntuación extremadamente negativa para excluir completamente
            }
        }

        // FILTRO CRÍTICO: Rechazar COMPLETAMENTE videos oficiales con intros
        // Solo queremos audio oficial y lyrics oficiales
        const videoOfficialPatterns = [
            /official\s+music\s+video/i,
            /official\s+video/i,
            /\(official\s+video\)/i,
            /video\s+oficial/i,
            /\(video\s+oficial\)/i,
            /videoclip\s+oficial/i,
            /clip\s+oficial/i,
            /music\s+video/i,
        ];

        for (const pattern of videoOfficialPatterns) {
            if (pattern.test(titleLower)) {
                // Solo permitir si explícitamente dice "audio" también
                if (!/audio/i.test(titleLower)) {
                    return -100; // Rechazar completamente videos oficiales
                }
            }
        }

        // MÁXIMA PRIORIDAD: Audio Oficial y Lyrics Oficiales
        if (/official\s+audio/i.test(titleLower)) s += 50; // Prioridad máxima para audio oficial
        if (/official\s+lyric/i.test(titleLower) || /official\s+lyrics/i.test(titleLower)) s += 45; // Muy alta prioridad para lyrics oficiales
        if (/\(audio\s+oficial\)/i.test(titleLower) || /audio\s+oficial/i.test(titleLower)) s += 50;
        if (/\(letra\s+oficial\)/i.test(titleLower) || /letra\s+oficial/i.test(titleLower)) s += 45;

        // EASTER EGG: Prioridad máxima para "La Patrulla" de Peso Pluma
        if (titleLower.includes('la patrulla') && titleLower.includes('peso pluma')) {
            s += 100; // Puntuación altísima para garantizar que sea primera
        }

        // Puntuación alta por canales oficiales
        if (channelLower.includes('vevo')) s += 8;
        if (channelLower.includes('official')) s += 6;
        if (channelLower.includes('topic')) s += 10; // Topic channels suelen tener solo audio

        // Puntuación por coincidencia de artista en canal
        if (artist && channelLower.includes(artist.toLowerCase())) s += 7;

        // Puntuación por keywords en el título
        for (const keyword of keywords) {
            const keywordLower = keyword.toLowerCase();
            if (titleLower.includes(keywordLower)) s += 4;

            // Buscar palabras individuales del keyword
            const words = keywordLower.split(' ').filter(w => w.length > 2);
            for (const word of words) {
                if (titleLower.includes(word)) s += 1;
            }
        }

        // Bonificación por audio sin video
        if (/\baudio\b/i.test(titleLower) && !/video/i.test(titleLower)) s += 8;

        // Bonificación menor por contenido en vivo (pero menos que audio oficial)
        if (/(live|concert|performance)/i.test(track.title)) s += 1;

        // Penalización fuerte por contenido no deseado
        if (/(cover|remix|karaoke|instrumental|reaction|tutorial)/i.test(track.title)) s -= 10;
        if (/(lyric|letra)/i.test(track.title) && !/official/i.test(track.title)) s -= 5;
        if (/(fan made|unofficial)/i.test(track.title)) s -= 8;

        // Penalización fuerte por contenido de awards/billboard que tienen introducciones largas
        if (/(billboard|awards?|music awards?|premio|latin|grammy)/i.test(track.title)) s -= 10;

        return s;
    }
    // Filtrar tracks con score negativo (mixes, compilaciones, etc.) ANTES de ordenar
    const validTracks = allTracks.filter(track => score(track) > -50);
    console.log(`Filtrado: ${allTracks.length} tracks originales -> ${validTracks.length} tracks válidos (eliminados ${allTracks.length - validTracks.length} mixes/compilaciones)`);

    validTracks.sort((a, b) => score(b) - score(a));

    // Sistema mejorado de deduplicación para asegurar máxima diversidad de artistas
    const unique = [];
    const seenUrls = new Set();
    const seenTitles = new Set();
    const artistTrackCount = new Map();
    const keywordArtistMap = new Map(); // Mapear keywords a artistas para mejor distribución

    // Función para normalizar títulos y detectar similitudes
    function normalizeTitle(title) {
        return title
            .toLowerCase()
            .replace(/[\(\)\[\]]/g, '') // Remover paréntesis y corchetes
            .replace(/official|music|video|audio|hd|4k|feat|ft/gi, '') // Remover palabras comunes
            .replace(/\s+/g, ' ') // Normalizar espacios
            .trim();
    }

    // Función mejorada para extraer artista del título o canal
    function extractArtist(track, searchArtist = '') {
        // Si estamos buscando un artista específico, usar ese nombre para todas las canciones
        if (searchArtist && searchArtist.trim()) {
            return searchArtist.toLowerCase().trim();
        }

        let artist = '';

        // Priorizar el canal del artista si es oficial
        if (track.channelTitle.toLowerCase().includes('vevo') ||
            track.channelTitle.toLowerCase().includes('official') ||
            track.channelTitle.toLowerCase().includes('topic')) {
            artist = track.channelTitle.replace(/(vevo|official|topic|\s-\s.*)/gi, '').trim().toLowerCase();
        } else {
            // Extraer del título antes del primer "-"
            const match = track.title.match(/^([^-]+)/);
            artist = match ? match[1].trim().toLowerCase() : track.channelTitle.toLowerCase();
        }

        return artist;
    }

    // Primero, organizar tracks por keyword para garantizar diversidad
    const tracksByKeyword = new Map();
    for (const track of validTracks) {
        if (!tracksByKeyword.has(track.keyword)) {
            tracksByKeyword.set(track.keyword, []);
        }
        tracksByKeyword.get(track.keyword).push(track);
    }

    // Procesar tracks con estrategia diferente según allowDuplicateArtists
    if (!allowDuplicateArtists) {
        // Estrategia para artistas únicos: priorizar diversidad
        const remainingTracks = [...validTracks].sort((a, b) => score(b) - score(a));

        for (const track of remainingTracks) {
            if (unique.length >= maxTracks) break;

            // Skip si ya vimos esta URL exacta
            if (seenUrls.has(track.url)) continue;

            const normalizedTitle = normalizeTitle(track.title);
            const artistExtracted = extractArtist(track, artist);

            // Skip si ya vimos un título muy similar
            let isSimilar = false;
            for (const seenTitle of seenTitles) {
                if (normalizedTitle.includes(seenTitle) || seenTitle.includes(normalizedTitle)) {
                    isSimilar = true;
                    break;
                }
            }
            if (isSimilar) continue;

            // Skip si ya tenemos una canción de este artista
            if (artistTrackCount.has(artistExtracted)) continue;

            // Agregar a la lista final
            unique.push(track);
            seenUrls.add(track.url);
            seenTitles.add(normalizedTitle);
            artistTrackCount.set(artistExtracted, 1);
        }
    } else {
        // Estrategia original para cuando se permiten artistas duplicados
        for (const [keyword, tracks] of tracksByKeyword) {
            // Ordenar tracks de este keyword por score
            tracks.sort((a, b) => score(b) - score(a));

            for (const track of tracks) {
                // Skip si ya vimos esta URL exacta
                if (seenUrls.has(track.url)) continue;

                const normalizedTitle = normalizeTitle(track.title);
                const artistExtracted = extractArtist(track, artist);

                // Skip si ya vimos un título muy similar
                let isSimilar = false;
                for (const seenTitle of seenTitles) {
                    if (normalizedTitle.includes(seenTitle) || seenTitle.includes(normalizedTitle)) {
                        isSimilar = true;
                        break;
                    }
                }
                if (isSimilar) continue;

                // Limitar tracks por artista de forma razonable (máximo 3-5 por artista)
                const maxTracksPerArtist = Math.min(5, Math.ceil(maxTracks / 4));
                const currentArtistCount = artistTrackCount.get(artistExtracted) || 0;
                if (currentArtistCount >= maxTracksPerArtist) continue;

                // Agregar a la lista final
                unique.push(track);
                seenUrls.add(track.url);
                seenTitles.add(normalizedTitle);
                artistTrackCount.set(artistExtracted, currentArtistCount + 1);

                const maxTracksPerKeyword = Math.ceil(maxTracks / keywords.length);
                const tracksFromThisKeyword = unique.filter(t => t.keyword === keyword).length;
                if (tracksFromThisKeyword >= maxTracksPerKeyword) {
                    break;
                }

                // Parar si ya tenemos suficientes tracks
                if (unique.length >= maxTracks) {
                    break;
                }
            }

            // Salir del loop principal si ya tenemos suficientes tracks
            if (unique.length >= maxTracks) {
                break;
            }
        }
    }

    console.log(`searchTracks final result: ${unique.length} tracks, allowDuplicateArtists: ${allowDuplicateArtists}, maxTracks: ${maxTracks}`);
    console.log('Artist distribution:', [...artistTrackCount.entries()]);

    // Si tenemos menos tracks del solicitado y no permitimos duplicados, intentar buscar más
    if (unique.length < maxTracks && !allowDuplicateArtists) {
        console.log(`Insufficient tracks (${unique.length}/${maxTracks}), trying to fill remaining slots...`);

        // Intentar agregar más tracks permitiendo cierta flexibilidad
        const remainingSlots = maxTracks - unique.length;
        const remainingTracks = validTracks.filter(track =>
            !seenUrls.has(track.url) &&
            score(track) > 0 // Solo tracks con score positivo
        ).sort((a, b) => score(b) - score(a));

        for (const track of remainingTracks) {
            if (unique.length >= maxTracks) break;

            const normalizedTitle = normalizeTitle(track.title);
            let isSimilar = false;
            for (const seenTitle of seenTitles) {
                if (normalizedTitle.includes(seenTitle) || seenTitle.includes(normalizedTitle)) {
                    isSimilar = true;
                    break;
                }
            }
            if (isSimilar) continue;

            unique.push(track);
            seenUrls.add(track.url);
            seenTitles.add(normalizedTitle);
            const artistExtracted = extractArtist(track, artist);
            artistTrackCount.set(artistExtracted, (artistTrackCount.get(artistExtracted) || 0) + 1);
        }

        console.log(`After filling: ${unique.length} tracks`);
    }

    return unique.slice(0, maxTracks);
}

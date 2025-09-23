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
    const { allowDuplicateArtists = defaultAllowDuplicates } = options;
    const allTracks = [];
    let channelId = undefined;
    if (artist) {
        channelId = await getArtistChannelId(artist);
        console.log(`Canal encontrado para ${artist}:`, channelId || 'ninguno');
    }

    // Búsqueda individual por keyword
    for (const keyword of keywords) {
        let foundItemsForKeyword = 0;

        // Primero intentar con canal específico si existe
        if (channelId) {
            let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=8&q=${encodeURIComponent(keyword)}&key=${YOUTUBE_API_KEY}`;
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
            let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=8&q=${encodeURIComponent(keyword)}&key=${YOUTUBE_API_KEY}`;
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

        // Puntuación alta por canales oficiales
        if (channelLower.includes('vevo')) s += 8;
        if (channelLower.includes('official')) s += 6;
        if (channelLower.includes('topic')) s += 5;

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

        // Puntuación alta por indicadores de calidad oficial
        if (/official (video|audio|music video)/i.test(track.title)) s += 6;
        if (/\b(official|hd|4k)\b/i.test(track.title)) s += 3;
        if (/(music video)/i.test(track.title)) s += 2;

        // Bonificación menor por contenido en vivo
        if (/(live|concert|performance)/i.test(track.title)) s += 1;

        // Penalización fuerte por contenido no deseado
        if (/(cover|remix|karaoke|instrumental|reaction|tutorial)/i.test(track.title)) s -= 5;
        if (/(lyric|letra)/i.test(track.title) && !/official/i.test(track.title)) s -= 3;
        if (/(fan made|unofficial)/i.test(track.title)) s -= 4;

        return s;
    }
    allTracks.sort((a, b) => score(b) - score(a));

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
    function extractArtist(track) {
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
    for (const track of allTracks) {
        if (!tracksByKeyword.has(track.keyword)) {
            tracksByKeyword.set(track.keyword, []);
        }
        tracksByKeyword.get(track.keyword).push(track);
    }

    // Procesar un track por keyword para maximizar diversidad
    for (const [keyword, tracks] of tracksByKeyword) {
        // Ordenar tracks de este keyword por score
        tracks.sort((a, b) => score(b) - score(a));

        for (const track of tracks) {
            // Skip si ya vimos esta URL exacta
            if (seenUrls.has(track.url)) continue;

            const normalizedTitle = normalizeTitle(track.title);
            const artist = extractArtist(track);

            // Skip si ya vimos un título muy similar
            let isSimilar = false;
            for (const seenTitle of seenTitles) {
                if (normalizedTitle.includes(seenTitle) || seenTitle.includes(normalizedTitle)) {
                    isSimilar = true;
                    break;
                }
            }
            if (isSimilar) continue;

            // Permitir múltiples canciones por artista si allowDuplicateArtists es true
            // Para búsquedas por artista específico, permitir más canciones del mismo artista
            const maxTracksPerArtist = allowDuplicateArtists ? 5 : 1;
            const currentArtistCount = artistTrackCount.get(artist) || 0;
            if (currentArtistCount >= maxTracksPerArtist) continue;

            // Agregar a la lista final
            unique.push(track);
            seenUrls.add(track.url);
            seenTitles.add(normalizedTitle);
            artistTrackCount.set(artist, currentArtistCount + 1);

            // Si no permitimos artistas duplicados, solo tomar el mejor track de cada keyword
            // Si permitimos duplicados, tomar hasta 3 tracks por keyword para búsquedas por artista
            const maxTracksPerKeyword = allowDuplicateArtists ? 3 : 1;
            const tracksFromThisKeyword = unique.filter(t => t.keyword === keyword).length;
            if (tracksFromThisKeyword >= maxTracksPerKeyword) {
                break;
            }
        }
    }

    console.log(`searchTracks final result: ${unique.length} tracks, allowDuplicateArtists: ${allowDuplicateArtists}`);
    return unique;
}

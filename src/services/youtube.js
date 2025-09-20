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

// Búsqueda avanzada y ranking
export async function searchTracks(keywords, artist = '', options = {}) {
    const allTracks = [];
    let channelId = undefined;
    if (artist) {
        channelId = await getArtistChannelId(artist);
    }
    for (const keyword of keywords) {
        let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=8&q=${encodeURIComponent(keyword)}&key=${YOUTUBE_API_KEY}`;
        url += `&order=${options.order || 'relevance'}&videoCategoryId=10&type=video&videoDuration=medium`;
        if (channelId) {
            url += `&channelId=${channelId}`;
        }
        try {
            const res = await fetch(url);
            const data = await res.json();
            if (Array.isArray(data.items)) {
                for (const item of data.items) {
                    allTracks.push({
                        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                        title: item.snippet.title,
                        channelTitle: item.snippet.channelTitle,
                        channelId: item.snippet.channelId,
                        description: item.snippet.description
                    });
                }
            }
        } catch (e) {
            // Si falla, ignora ese keyword
        }
    }
    // Ranking interno mejorado
    function score(track) {
        let s = 0;
        const titleLower = track.title.toLowerCase();
        const channelLower = track.channelTitle.toLowerCase();

        // Puntuación por canal oficial o Topic
        if (artist && (channelLower.includes(artist.toLowerCase()) || channelLower.includes('topic'))) s += 5;
        if (channelLower.includes('vevo') || channelLower.includes('official')) s += 3;

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

        // Puntuación por indicadores de calidad
        if (/official (video|audio|music video)/i.test(track.title)) s += 3;
        if (/\bhd\b|\b4k\b|official/i.test(track.title)) s += 2;
        if (/(live|concert|performance)/i.test(track.title)) s += 1;

        // Penalización por contenido no deseado
        if (/(cover|remix|karaoke|instrumental|reaction)/i.test(track.title)) s -= 2;
        if (/(lyric|letra)/i.test(track.title) && !/official/i.test(track.title)) s -= 1;

        return s;
    }
    allTracks.sort((a, b) => score(b) - score(a));

    // Sistema de deduplicación avanzado para asegurar variedad
    const unique = [];
    const seenUrls = new Set();
    const seenTitles = new Set();
    const artistTrackCount = new Map();

    // Función para normalizar títulos y detectar similitudes
    function normalizeTitle(title) {
        return title
            .toLowerCase()
            .replace(/[\(\)\[\]]/g, '') // Remover paréntesis y corchetes
            .replace(/official|music|video|audio|hd|4k/gi, '') // Remover palabras comunes
            .replace(/\s+/g, ' ') // Normalizar espacios
            .trim();
    }

    // Función para extraer artista del título
    function extractArtist(title) {
        const match = title.match(/^([^-]+)/);
        return match ? match[1].trim().toLowerCase() : '';
    }

    for (const track of allTracks) {
        // Skip si ya vimos esta URL exacta
        if (seenUrls.has(track.url)) continue;

        const normalizedTitle = normalizeTitle(track.title);
        const artist = extractArtist(track.title);

        // Skip si ya vimos un título muy similar
        let isSimilar = false;
        for (const seenTitle of seenTitles) {
            if (normalizedTitle.includes(seenTitle) || seenTitle.includes(normalizedTitle)) {
                isSimilar = true;
                break;
            }
        }
        if (isSimilar) continue;

        // Limitar canciones por artista para asegurar diversidad
        const currentArtistCount = artistTrackCount.get(artist) || 0;
        if (currentArtistCount >= 2) continue; // Máximo 2 canciones por artista

        // Agregar a la lista final
        unique.push(track);
        seenUrls.add(track.url);
        seenTitles.add(normalizedTitle);
        artistTrackCount.set(artist, currentArtistCount + 1);
    }

    return unique;
}

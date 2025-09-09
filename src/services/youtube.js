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
        let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q=${encodeURIComponent(keyword)}&key=${YOUTUBE_API_KEY}`;
        url += `&order=${options.order || 'relevance'}&videoCategoryId=10&type=video`;
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
    // Ranking interno
    function score(track) {
        let s = 0;
        if (artist && track.channelTitle && (track.channelTitle.toLowerCase().includes(artist.toLowerCase()) || track.channelTitle.toLowerCase().includes('topic'))) s += 3;
        if (keywords.some(k => track.title.toLowerCase().includes(k.toLowerCase()))) s += 2;
        if (/official (video|audio)/i.test(track.title)) s += 1;
        return s;
    }
    allTracks.sort((a, b) => score(b) - score(a));
    // Eliminar duplicados por url
    const unique = [];
    const seen = new Set();
    for (const t of allTracks) {
        if (!seen.has(t.url)) {
            unique.push(t.url);
            seen.add(t.url);
        }
    }
    return unique;
}

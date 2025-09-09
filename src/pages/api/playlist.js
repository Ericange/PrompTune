export const prerender = false;
// src/pages/api/playlist.js
// Endpoint API para recibir el prompt, consultar Gemini y SoundCloud

import { getKeywordsFromPrompt } from '../../services/gemini.js';
import { searchTracks } from '../../services/youtube.js';

export async function POST({ request }) {
    let prompt = '';
    let artist = '';
    let count = 5;
    try {
        const body = await request.text();
        if (body) {
            const json = JSON.parse(body);
            prompt = json.prompt || '';
            artist = json.artist || '';
            count = Number(json.count) || 5;
        }
    } catch (e) {
        // Body malformado, prompt vacío
    }
    if (!prompt && !artist) {
        return new Response(JSON.stringify({ tracks: [], error: 'Prompt y artista vacíos o inválidos' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    let keywords = [];
    let tracks = [];
    // Preprocesamiento del prompt
    function normalize(str) {
        return str.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    }
    const promptNorm = normalize(prompt);
    if (artist) {
        // Si hay artista, buscar en el canal oficial o Topic
        keywords = [artist + ' official music video'];
        tracks = await searchTracks(keywords, artist, { order: 'viewCount' });
        if (tracks.length === 0) {
            // Si no hay resultados, buscar solo por el nombre del artista
            keywords = [artist];
            tracks = await searchTracks(keywords, artist, { order: 'viewCount' });
        }
        // Limitar la cantidad de tracks a la cantidad solicitada
        tracks = tracks.slice(0, count);
        console.log('Búsqueda por artista:', artist, 'Keywords:', keywords);
    } else {
        // 1. Obtener keywords estructuradas desde Gemini, pasando el count
        const gemini = await getKeywordsFromPrompt(`${prompt} (máximo ${count} resultados)`);
        console.log('Prompt recibido:', prompt);
        console.log('Gemini estructurado:', gemini);
        let searchKeywords = [];
        if (gemini.artists && gemini.artists.length > 0) searchKeywords.push(...gemini.artists.map(a => a + ' official music video'));
        if (gemini.songs && gemini.songs.length > 0) searchKeywords.push(...gemini.songs.map(s => s + ' official music video'));
        if (searchKeywords.length === 0 && gemini.genres && gemini.genres.length > 0) {
            searchKeywords.push(...gemini.genres.map(g => g + ' official music video'));
        }
        if (searchKeywords.length === 0) {
            // Fallback: prompt + music
            let promptMusic = prompt.trim();
            if (!/music/i.test(promptMusic)) {
                promptMusic += ' music';
            }
            searchKeywords = [promptMusic];
        }
        // Limitar la cantidad de keywords a la cantidad solicitada
        keywords = searchKeywords.slice(0, count);
        // 2. Buscar tracks en YouTube usando esas keywords
        tracks = await searchTracks(keywords, '', { order: 'viewCount' });
        // Limitar la cantidad de tracks a la cantidad solicitada
        tracks = tracks.slice(0, count);
        console.log('Tracks YouTube:', tracks);
    }
    // 3. Retornar la lista de tracks exacta
    return new Response(
        JSON.stringify({ tracks }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
}

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

    // 🎵 Easter Egg: Palabra secreta "Exitoso" → Solo Peso Pluma
    if (prompt.trim() === 'Exitoso') {
        console.log('🎵 Easter Egg activado: Exitoso → Peso Pluma');
        const pesoPlumaTracks = await searchTracks(
            ['Peso Pluma official music video', 'Peso Pluma corridos tumbados', 'Peso Pluma El Belicon'],
            'Peso Pluma',
            { order: 'relevance' }
        );
        return new Response(
            JSON.stringify({ tracks: pesoPlumaTracks.slice(0, count) }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
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

        // Estrategia de diversidad: alternar entre artistas, canciones y géneros

        // 1. Agregar artistas principales (máximo 3 para evitar saturación)
        if (gemini.artists && gemini.artists.length > 0) {
            searchKeywords.push(...gemini.artists.slice(0, 3).map(a => `${a} official music video`));
        }

        // 2. Agregar canciones específicas para más variedad
        if (gemini.songs && gemini.songs.length > 0) {
            searchKeywords.push(...gemini.songs.slice(0, 3).map(s => `${s} official video`));
        }

        // 3. Combinar artistas con géneros (solo si tenemos pocos resultados)
        if (searchKeywords.length < count && gemini.artists && gemini.genres) {
            for (const artist of gemini.artists.slice(0, 2)) {
                for (const genre of gemini.genres.slice(0, 1)) {
                    searchKeywords.push(`${artist} ${genre} official`);
                }
            }
        }

        // 4. Búsquedas por género para llenar espacios restantes
        if (searchKeywords.length < count && gemini.genres && gemini.genres.length > 0) {
            for (const genre of gemini.genres) {
                searchKeywords.push(`${genre} best songs`);
                searchKeywords.push(`top ${genre} music`);
            }
        }

        if (searchKeywords.length === 0) {
            // Fallback: prompt + music más específico
            let promptMusic = prompt.trim();
            if (!/music/i.test(promptMusic)) {
                promptMusic += ' official music';
            }
            searchKeywords = [promptMusic, `best of ${promptMusic}`];
        }

        // Limitar keywords pero asegurar variedad
        keywords = [...new Set(searchKeywords)].slice(0, Math.min(count * 3, 12)); // Más keywords para más opciones

        // 2. Buscar tracks en YouTube usando relevancia en lugar de viewCount
        tracks = await searchTracks(keywords, '', { order: 'relevance' });

        // 3. Aplicar filtro final de diversidad y limite exacto
        const finalTracks = [];
        const seenArtists = new Set();
        const maxPerArtist = Math.max(1, Math.floor(count / 3)); // Distribuir equitativamente

        for (const track of tracks) {
            if (finalTracks.length >= count) break;

            const artist = track.title.split('-')[0]?.trim().toLowerCase() || '';
            const artistCount = Array.from(seenArtists).filter(a => a === artist).length;

            if (artistCount < maxPerArtist) {
                finalTracks.push(track);
                seenArtists.add(artist);
            }
        }

        // Si no tenemos suficientes, llenar con los mejores ranked restantes
        if (finalTracks.length < count) {
            for (const track of tracks) {
                if (finalTracks.length >= count) break;
                if (!finalTracks.some(t => t.url === track.url)) {
                    finalTracks.push(track);
                }
            }
        }

        tracks = finalTracks.slice(0, count);
        console.log('Tracks YouTube:', tracks);
    }
    // 3. Retornar la lista de tracks exacta
    return new Response(
        JSON.stringify({ tracks }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
}

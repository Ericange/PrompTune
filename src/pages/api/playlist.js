export const prerender = false;
// src/pages/api/playlist.js
// Endpoint API para recibir el prompt, consultar Gemini y SoundCloud

import { getKeywordsFromPrompt } from '../../services/gemini.js';
import { searchTracks } from '../../services/youtube.js';

export async function POST({ request }) {
    let prompt = '';
    let artist = '';
    let count = 5;
    let allowDuplicateArtists = false;
    try {
        const body = await request.text();
        if (body) {
            const json = JSON.parse(body);
            prompt = json.prompt || '';
            artist = json.artist || '';
            count = Number(json.count) || 5;
            allowDuplicateArtists = json.allowDuplicateArtists || false;
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
            { order: 'relevance', allowDuplicateArtists: true } // Easter egg siempre permite duplicados
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
        // Búsqueda simple por artista como funcionaba antes
        // Si hay artista, buscar en el canal oficial o Topic
        keywords = [artist + ' official music video'];
        tracks = await searchTracks(keywords, artist, { order: 'viewCount' });
        console.log('Búsqueda inicial tracks encontrados:', tracks.length);
        if (tracks.length === 0) {
            // Si no hay resultados, buscar solo por el nombre del artista
            keywords = [artist];
            tracks = await searchTracks(keywords, artist, { order: 'viewCount' });
            console.log('Búsqueda fallback tracks encontrados:', tracks.length);
        }
        // Limitar la cantidad de tracks a la cantidad solicitada
        tracks = tracks.slice(0, count);
        console.log('Búsqueda por artista:', artist, 'Keywords:', keywords, 'Tracks finales:', tracks.length);
    } else {
        // 1. Obtener keywords estructuradas desde Gemini, pasando el count
        const gemini = await getKeywordsFromPrompt(`${prompt} (máximo ${count} resultados)`);
        console.log('Prompt recibido:', prompt);
        console.log('Gemini estructurado:', gemini);
        let searchKeywords = [];

        // Estrategia de diversidad mejorada: buscar por artista individual para garantizar variedad

        // 1. Priorizar artistas únicos - uno por uno para asegurar diversidad
        if (gemini.artists && gemini.artists.length > 0) {
            // Tomar hasta 'count' artistas diferentes para asegurar variedad
            const artistsToUse = gemini.artists.slice(0, Math.min(count, gemini.artists.length));
            searchKeywords.push(...artistsToUse.map(a => `${a} best songs official`));
        }

        // 2. Si tenemos canciones específicas, buscarlas también
        if (gemini.songs && gemini.songs.length > 0 && searchKeywords.length < count) {
            const songsNeeded = count - searchKeywords.length;
            searchKeywords.push(...gemini.songs.slice(0, songsNeeded).map(s => `${s} official video`));
        }

        // 3. Si aún necesitamos más variedad, combinar artistas con sus canciones más populares
        if (searchKeywords.length < count && gemini.artists && gemini.songs) {
            const remaining = count - searchKeywords.length;
            for (let i = 0; i < remaining && i < gemini.artists.length && i < gemini.songs.length; i++) {
                searchKeywords.push(`${gemini.artists[i]} ${gemini.songs[i]} official`);
            }
        }

        // 4. Backup: búsquedas por género solo si no tenemos suficientes artistas
        if (searchKeywords.length < count && gemini.genres && gemini.genres.length > 0) {
            const remaining = count - searchKeywords.length;
            for (let i = 0; i < remaining && i < gemini.genres.length; i++) {
                searchKeywords.push(`${gemini.genres[i]} top songs 2024`);
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
        keywords = [...new Set(searchKeywords)].slice(0, Math.min(count * 2, 10)); // Menos keywords, más calidad

        // 2. Buscar tracks en YouTube usando relevancia
        // Para búsquedas por género/prompt general, usar la configuración del usuario
        tracks = await searchTracks(keywords, '', { order: 'relevance', allowDuplicateArtists });

        // 3. Tomar exactamente el número solicitado (ya filtrado por diversidad en YouTube service)
        tracks = tracks.slice(0, count);
        console.log('Tracks YouTube:', tracks);
    }
    // 3. Retornar la lista de tracks exacta
    return new Response(
        JSON.stringify({ tracks }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
}

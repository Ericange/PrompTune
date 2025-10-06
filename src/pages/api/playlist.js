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

    // 🎵 Easter Egg: Palabra secreta "Exitoso" → Solo Peso Pluma (La Patrulla primero)
    if (prompt.trim() === 'Exitoso') {
        console.log('🎵 Easter Egg activado: Exitoso → Peso Pluma');

        // "La Patrulla" directamente con el enlace específico
        const laPatrullaTrack = {
            url: 'https://www.youtube.com/watch?v=NhNyMeEnOLs',
            title: 'Peso Pluma - LA PATRULLA',
            channelTitle: 'Peso Pluma',
            channelId: 'UCzrM_068Odho89mTRrrxqbA',
            description: 'LA PATRULLA - Peso Pluma',
            keyword: 'Easter Egg'
        };

        // Buscar otras canciones de Peso Pluma para completar (excluyendo La Patrulla)
        const otherTracks = await searchTracks(
            ['Peso Pluma El Belicon', 'Peso Pluma corridos tumbados', 'Peso Pluma hits', 'Peso Pluma popular songs'],
            'Peso Pluma',
            { order: 'relevance', allowDuplicateArtists: true, maxTracks: count - 1 }
        );

        // Combinar con "La Patrulla" primero
        const pesoPlumaTracks = [laPatrullaTrack, ...otherTracks].slice(0, count);

        return new Response(
            JSON.stringify({ tracks: pesoPlumaTracks }),
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
        // Búsqueda mejorada por artista con múltiples keywords priorizando audio oficial
        keywords = [
            artist + ' official audio',
            artist + ' audio',
            artist + ' best songs',
            artist + ' hits',
            artist
        ];
        tracks = await searchTracks(keywords, artist, { order: 'viewCount', maxTracks: count });
        console.log('Búsqueda inicial tracks encontrados:', tracks.length);

        // El límite ya se maneja en searchTracks
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
            searchKeywords.push(...artistsToUse.map(a => `${a} official audio`));
        }

        // 2. Si tenemos canciones específicas, buscarlas también priorizando audio
        if (gemini.songs && gemini.songs.length > 0 && searchKeywords.length < count) {
            const songsNeeded = count - searchKeywords.length;
            searchKeywords.push(...gemini.songs.slice(0, songsNeeded).map(s => `${s} official audio`));
        }

        // 3. Si aún necesitamos más variedad, combinar artistas con audio oficial
        if (searchKeywords.length < count && gemini.artists && gemini.songs) {
            const remaining = count - searchKeywords.length;
            for (let i = 0; i < remaining && i < gemini.artists.length && i < gemini.songs.length; i++) {
                searchKeywords.push(`${gemini.artists[i]} ${gemini.songs[i]} audio`);
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
            // Fallback: prompt + music más específico con variedad de búsquedas
            let promptMusic = prompt.trim();
            if (!/music/i.test(promptMusic)) {
                promptMusic += ' music';
            }

            // Generar múltiples keywords priorizando audio oficial
            searchKeywords = [
                `${promptMusic} official audio`,
                `${promptMusic} audio`,
                promptMusic,
                `${promptMusic} songs`,
                `${promptMusic} hits`,
                `popular ${promptMusic}`,
                `${promptMusic} 2024`
            ];
        }

        // Limitar keywords pero asegurar variedad
        // Para playlists grandes (15-20), usar más keywords
        const maxKeywords = count <= 10 ? Math.min(count * 2, 10) : Math.min(count, 15);
        keywords = [...new Set(searchKeywords)].slice(0, maxKeywords);

        // 2. Buscar tracks en YouTube usando relevancia
        // Para búsquedas por género/prompt general, usar la configuración del usuario
        tracks = await searchTracks(keywords, '', { order: 'relevance', allowDuplicateArtists, maxTracks: count });

        // Si no tenemos suficientes tracks y no permitimos duplicados, intentar con más keywords
        if (tracks.length < count && !allowDuplicateArtists && gemini.artists && gemini.artists.length > 0) {
            console.log(`Insufficient tracks (${tracks.length}/${count}), expanding search with more artists...`);

            // Generar más keywords con artistas adicionales
            const additionalKeywords = [];
            const remainingArtists = gemini.artists.slice(keywords.length);

            for (let i = 0; i < remainingArtists.length && additionalKeywords.length < count; i++) {
                additionalKeywords.push(`${remainingArtists[i]} popular songs`);
                additionalKeywords.push(`${remainingArtists[i]} greatest hits`);
            }

            if (additionalKeywords.length > 0) {
                const expandedKeywords = [...keywords, ...additionalKeywords];
                tracks = await searchTracks(expandedKeywords, '', { order: 'relevance', allowDuplicateArtists, maxTracks: count });
            }
        }

        // El límite ya se maneja en searchTracks
        console.log('Tracks YouTube:', tracks);
    }
    // 3. Retornar la lista de tracks exacta
    return new Response(
        JSON.stringify({ tracks }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
}

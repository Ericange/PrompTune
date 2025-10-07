import dotenv from 'dotenv';
export { renderers } from '../../renderers.mjs';

// src/services/gemini.js
// Servicio para interactuar con la API de Gemini

dotenv.config();

function parseGeminiResponse(rawText) {
    try {
        if (!rawText || typeof rawText !== 'string' || rawText.trim() === '') {
            return { artists: [], songs: [], genres: [] };
        }
        // Extraer solo el JSON del bloque
        const match = rawText.match(/```json([\s\S]*?)```/);
        const jsonString = match ? match[1].trim() : rawText;
        return JSON.parse(jsonString);
    } catch (err) {
        console.error("Error parseando Gemini:", err);
        return { artists: [], songs: [], genres: [] };
    }
}

async function getKeywordsFromPrompt(prompt) {
    // Llama a la API de Gemini para obtener artistas, canciones y géneros desde el prompt
    const apiKey = process.env.GEMINI_API_KEY;
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=' + apiKey;
    const body = {
        contents: [{
            parts: [{
                text: `Extrae una lista VARIADA de hasta 10 artistas DIFERENTES, canciones y géneros musicales reales que correspondan a este prompt: "${prompt}". 

IMPORTANTE: 
- Prioriza DIVERSIDAD de artistas (no repetir el mismo artista)
- Incluye artistas de diferentes épocas y estilos dentro del género
- Asegúrate de que sean canciones reales y populares
- Si es un género específico, incluye varios artistas representativos

Devuelve un JSON con la forma { "artists": ["..."], "songs": ["..."], "genres": ["..."] }. Si no hay coincidencias, devuelve solo géneros musicales. No incluyas explicaciones ni texto adicional.`
            }]
        }]
    };
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        if (data.error) {
            console.error('Error Gemini API:', data.error);
            return { artists: [], songs: [], genres: [] };
        }
        console.log('Gemini respuesta cruda:', JSON.stringify(data));
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return parseGeminiResponse(text);
    } catch (e) {
        console.log('Error Gemini:', e);
        return { artists: [], songs: [], genres: [] };
    }
}

// src/services/youtube.js
// Servicio para buscar canciones en YouTube usando la API pública de búsqueda

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
async function searchTracks(keywords, artist = '', options = {}) {
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

const prerender = false;

async function POST({ request }) {
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
    normalize(prompt);
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

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST,
    prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

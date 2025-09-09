// src/services/gemini.js
// Servicio para interactuar con la API de Gemini

import dotenv from 'dotenv';
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

export async function getKeywordsFromPrompt(prompt) {
    // Llama a la API de Gemini para obtener artistas, canciones y géneros desde el prompt
    const apiKey = process.env.GEMINI_API_KEY;
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey;
    const body = {
        contents: [{
            parts: [{
                text: `Extrae una lista de hasta 10 artistas, canciones y géneros musicales reales que correspondan a este prompt: "${prompt}". Devuelve un JSON con la forma { "artists": ["..."], "songs": ["..."], "genres": ["..."] }. Si no hay coincidencias, devuelve solo géneros musicales. No incluyas explicaciones ni texto adicional.`
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


# PrompTune: Generador de Playlists Inteligente

PrompTune es una aplicación web construida con Astro y React que genera playlists de YouTube basadas en prompts de usuario, géneros, artistas o estados de ánimo. Utiliza IA (Gemini) para interpretar el prompt y APIs externas para obtener resultados musicales relevantes.

## 🚀 Características principales

- Generación de playlists a partir de descripciones, géneros, artistas o moods.
- Campo opcional para especificar artista y filtrar por canal oficial.
- Integración con Gemini para extraer artistas, canciones y géneros del prompt.
- Búsqueda avanzada en YouTube con ranking de resultados.
- Seguridad: las API keys se gestionan mediante variables de entorno y no se exponen en el repositorio.

## 📦 Estructura del proyecto

```text
/ (raíz)
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── db/
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   ├── services/
│   └── styles/
├── .env (no se sube a git)
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```


## 🧑‍💻 Uso

1. Escribe un género, mood o descripción en el primer campo.
2. (Opcional) Especifica un artista para filtrar por su canal oficial.
3. Selecciona la cantidad de canciones y haz clic en "Generar Playlist".
4. Se mostrarán los videos de YouTube más relevantes según tu prompt.

## 📝 Scripts útiles

| Comando              | Acción                                         |
|----------------------|-----------------------------------------------|
| `npm install`        | Instala dependencias                          |
| `npm run dev`        | Inicia el servidor local en `localhost:4321`  |
| `npm run build`      | Compila el sitio para producción en `./dist/` |
| `npm run preview`    | Previsualiza el build localmente              |

---

Desarrollado con Astro, React y mucho ritmo 🎵
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

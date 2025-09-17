# 🔑 Configuración de YouTube API para mostrar títulos

## ¿Por qué no veo los títulos de las canciones?

Para mostrar los títulos reales de los videos de YouTube, necesitas configurar una clave de API de YouTube Data API v3.

## 📋 Pasos para configurar:

### 1. Obtener clave de YouTube API
1. Ve a [Google Cloud Console](https://console.developers.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita **YouTube Data API v3**
4. Ve a "Credenciales" → "Crear credenciales" → "Clave de API"
5. Copia la clave generada

### 2. Configurar en tu proyecto
1. Crea un archivo `.env.local` en la raíz del proyecto
2. Agrega tu clave:
```
VITE_YOUTUBE_API_KEY=tu_clave_aqui
```
3. Reinicia el servidor de desarrollo (`npm run dev`)

### 3. Verificar funcionamiento
- Abre la consola del navegador (F12)
- Genera una nueva playlist
- Deberías ver mensajes como "🔑 API Key encontrada, cargando metadatos..."

## 🎯 ¿Qué pasa sin la API?
- La aplicación funciona normalmente
- Los videos se reproducen sin problemas
- Solo verás IDs de video en lugar de títulos
- No afecta la funcionalidad de reproducción

## 💰 Costos
La YouTube Data API tiene cuotas gratuitas generosas:
- 10,000 unidades por día gratis
- Obtener metadatos de video = 1 unidad
- Suficiente para uso personal normal

## 🔒 Seguridad
- La clave se usa solo en el frontend
- Considera restringir la clave a tu dominio en Google Cloud Console
- No subas el archivo `.env.local` a repositorios públicos
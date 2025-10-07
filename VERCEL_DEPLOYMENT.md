# 🚀 Guía de Despliegue en Vercel

## Configuración Completada ✅

El proyecto ya está configurado para desplegarse en Vercel con las siguientes actualizaciones:

### Cambios Realizados

1. **Adaptador de Vercel Instalado** (`@astrojs/vercel`)
2. **Configuración de Astro actualizada** (`astro.config.mjs`)
   - `output: 'server'` para SSR
   - `adapter: vercel()` para despliegue en Vercel

## 📋 Pasos para Desplegar

### 1. Configurar Variables de Entorno en Vercel

En tu proyecto de Vercel, ve a **Settings → Environment Variables** y agrega:

```
GEMINI_API_KEY=tu_gemini_api_key
YOUTUBE_API_KEY=tu_youtube_api_key
```

⚠️ **IMPORTANTE**: Asegúrate de agregar estas variables para los tres entornos:
- ✅ Production
- ✅ Preview
- ✅ Development

### 2. Hacer Push de los Cambios

```bash
git add .
git commit -m "Configurar adaptador de Vercel para despliegue"
git push origin main
```

### 3. Desplegar en Vercel

Vercel detectará automáticamente los cambios y comenzará el despliegue.

## 🔧 Configuración de Build (Opcional)

Si Vercel no detecta automáticamente la configuración, asegúrate de que tenga:

- **Framework Preset**: Astro
- **Build Command**: `npm run build`
- **Output Directory**: `.vercel/output/static`
- **Install Command**: `npm install`

## 🌐 Verificar Despliegue

Una vez desplegado, verifica:

1. ✅ La página principal carga correctamente
2. ✅ El formulario funciona
3. ✅ Las playlists se generan correctamente
4. ✅ El reproductor de YouTube funciona
5. ✅ Las animaciones se ven correctamente

## 🐛 Solución de Problemas

### Error: "Cannot use server-rendered pages without an adapter"
- **Solución**: Ya está resuelto con la configuración actual

### Error: Variables de entorno no definidas
- **Solución**: Verifica que las variables estén configuradas en Vercel Settings

### Error de API de Gemini o YouTube
- **Solución**: Verifica que las API keys sean válidas y tengan los permisos correctos

## 📝 Notas

- El proyecto usa **SSR (Server-Side Rendering)** para los endpoints API
- Las páginas estáticas se generan automáticamente
- El endpoint `/api/playlist` funciona como serverless function en Vercel

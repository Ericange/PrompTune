# 🚀 Guía de Despliegue en Vercel

## Configuración Completada ✅

El proyecto ya está configurado para desplegarse en Vercel con las siguientes actualizaciones:

### Cambios Realizados

1. **Adaptador de Vercel Instalado** (`@astrojs/vercel@^8.2.8`)
2. **Configuración de Astro actualizada** (`astro.config.mjs`)
   - `output: 'server'` para SSR
   - `adapter: vercel()` para despliegue en Vercel
   - Web Analytics habilitado

## 🐛 Error Resuelto

**Error anterior:**
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/var/task/dist/server/entry.mjs'
```

**Soluciones aplicadas:**
1. ✅ Actualizado `@astrojs/vercel` a la versión `8.2.8` (compatible con Astro 5.x)
2. ✅ Cambiado `output: 'static'` con SSR selectivo para la API
3. ✅ Añadido `vercel.json` para configuración explícita
4. ✅ API endpoint marcado con `export const prerender = false`

### 🔧 Pasos para Resolver el Error en Vercel

**IMPORTANTE**: Este error es causado por un problema de caché persistente en Vercel.

**Opción 1: Limpiar caché (Recomendado)**
1. Ve a tu proyecto en Vercel Dashboard
2. **Settings** → **General**  
3. Scroll down hasta "Build & Development Settings"
4. Click en **"Clear Build Cache & Redeploy"** ← MUY IMPORTANTE

**Opción 2: Si la Opción 1 no funciona**
1. Ve a tu proyecto en Vercel Dashboard
2. **Settings** → **General**
3. Click en **"Delete Project"** (Sí, eliminarlo)
4. Vuelve a importar el repositorio desde GitHub
5. Configura las variables de entorno de nuevo:
   - `GEMINI_API_KEY`
   - `YOUTUBE_API_KEY`

**Opción 3: Forzar un redespliegue completo**
```bash
# Crear un cambio vacío para forzar rebuild
git commit --allow-empty -m "Force rebuild with clean cache"
git push origin main

# En Vercel Dashboard, ve a Deployments
# Click en los "..." del último deployment
# Selecciona "Redeploy" y marca "Use existing Build Cache: NO"
```

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

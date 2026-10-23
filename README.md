# TIBOX Mercado

Aplicación de planificación y gestión de Mercado y Marketing para TIBOX.

## Stack

- React 19.3
- Vite 8
- JavaScript / JSX
- Tailwind CSS 4
- SheetJS (`xlsx`) para plantillas e importación Excel
- Persistencia local mediante `localStorage` en esta etapa de prototipo

## Desarrollo local

```bash
npm install
npm run dev
```

Vite mostrará la URL local de desarrollo, normalmente `http://localhost:5173`.

## Build de producción

```bash
npm run build
npm run preview
```

El resultado compilado se genera en `dist/`.

## Docker

```bash
docker build -t tibox-marketing .
docker run -p 8080:80 tibox-marketing
```

## Estructura principal

```text
src/
  components/          UI reutilizable y layout
  context/             Estado global y persistencia
  data/                Datos semilla, mantenedores y checklist base
  lib/                 Utilidades
  pages/               Módulos funcionales
    events/             Eventos, Live y Checklist
```

## Módulos

- Dashboard Ejecutivo
- Plan de Mercado
- RRSS & Mailing
- Blog / SEO
- Ads
- Eventos
  - Resumen
  - Asistentes
  - Checklist Antes / Post evento
  - Live en lista
  - Operación
  - Costos
  - Seguimiento
- Webinars
- Rutas
- Acciones puntuales
- Cobertura / Visitas
- Resultados
- Metas & Mantenedores

## Migración desde la versión anterior

La app React usa la clave `tibox_marketing_react_v4`. Si no existe, intenta leer automáticamente `tibox_marketing_v3` y normalizar los datos al nuevo modelo, de modo que la migración conserve los datos cargados en el navegador.

## Roles del prototipo

- Paula · Edición
- Priscila · Edición
- Gerencia · Consulta
- Comercial · Consulta
- Visor Eventos · Promotora

> Nota: el selector de roles es una simulación de interfaz. Todavía no constituye autenticación ni autorización segura. Para producción se debe conectar a un backend con usuarios, permisos y base de datos central.

## Archivos legacy

Los archivos `v3-*.js`, `v3-*.css`, `app.js`, `plan-v2.*` y similares pertenecen a la maqueta JavaScript anterior y ya no son cargados por `index.html`. Se mantienen temporalmente como referencia histórica durante la migración.

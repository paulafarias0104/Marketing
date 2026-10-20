# Tibox · App de Mercado

MVP funcional para planificar, ejecutar y medir la estrategia de Mercado de Tibox.

## Alcance incluido

- Dashboard ejecutivo con filtros por año, trimestre, línea y objetivo.
- Matriz de presión de mercado por línea/canal.
- Plan de Mercado e iniciativas/campañas.
- Estados: Idea, Planificada, En ejecución, En pausa, Ejecutada, En seguimiento y Cerrada.
- Objetivos: Captación, Desarrollo de cartera y Fidelización.
- Audiencias: Masivo, Prospectos, Clientes · todos los usuarios y Clientes · contactos clave.
- Eventos integrados con asistentes, checklist pre/post, Live, itinerario, regalos y seguimiento comercial.
- La antigua vista **Anfitriona** se simplifica como filtro **Viene llegando** en Asistentes.
- Rutas IA con histórico 2025–2026 cargado como base.
- Webinars con inscritos, asistencia, seguimiento y resultados.
- Historial transversal por persona y empresa.
- Carga manual mensual de resultados/negocios comisionados.
- Metas trimestrales y mantenedores de canales/accionables.
- Exportación CSV desde cualquier módulo respetando la vista actual.
- Perfiles de edición (Paula / Priscila) y consulta (Gerencia / Comercial) para validar UX.

## Uso local

Es una SPA estática. Puede abrirse directamente o servirse con cualquier servidor web.

```bash
python -m http.server 8080
```

Luego abrir `http://localhost:8080`.

## Persistencia del MVP

Esta primera versión guarda los cambios en `localStorage` del navegador. Esto permite validar funcionalidad y flujo sin depender aún de una base de datos.

Para operación multiusuario real, el siguiente paso es conectar el front a una API/base central y reemplazar el selector de perfil por autenticación corporativa. Los módulos y el modelo visual ya quedan preparados para esa evolución.

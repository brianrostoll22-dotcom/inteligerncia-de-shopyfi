# PRD — Criadero Especializado en Pastor Alemán (Vigo)

## Problema original
El usuario quiere una web que simule la venta de cachorros de Pastor Alemán como un criadero especializado en la raza: información completa de los cachorros, precio de 450 €, compra/redirección a WhatsApp, fotos y vídeos de cachorros y camadas, diseño muy profesional. Debe incluir: visita presencial al centro especializado (Vigo), envío a domicilio acompañado por un miembro del equipo (conforme a la legislación española de bienestar animal) que explica todo antes de la entrega, entrega con microchip y vacunas obligatorias, y plazo de entrega de 24/48 h según zona (a consultar por WhatsApp).

## Decisiones del usuario (turno 1)
- Nombre del criadero: literal "Criadero especializado en pastor alemán" (sin marca comercial).
- WhatsApp: número pendiente → placeholder +34 600 000 000 (cambiar en `frontend/src/lib/site.js`: `WHATSAPP_NUMBER_RAW` y `WHATSAPP_NUMBER_DISPLAY`).
- Ubicación: Vigo (Pontevedra, España).
- Estilo: moderno y simplificado, fácil de ver y consultar.

## Arquitectura
- Frontend: React (CRA+craco) + Tailwind + framer-motion + lenis (scroll suave). Single-page landing en `/`.
- Backend: FastAPI de plantilla intacto (health `GET /api/`). No requiere DB para esta landing.
- Datos: `frontend/src/lib/site.js` centraliza WhatsApp, precio, cachorros, galería, vídeos y FAQ.
- Diseño: `/app/design_guidelines.json` (crema/bone + tinta + cobre; Cormorant Garamond + Plus Jakarta Sans + JetBrains Mono).

## Secciones implementadas (2026-09-21)
1. Nav fijo con menú móvil a pantalla completa + CTA WhatsApp.
2. Hero: revelado cinético por líneas enmascaradas, imagen con parallax + kenburns, precio 450 €, CTAs (WhatsApp / visitar), banda de stats.
3. Marquee editorial lento (raza, microchip, vacunas, 24–48 h, Vigo).
4. Manifiesto numerado 01–03 (crianza, raza, garantía).
5. Catálogo de cachorros: 6 fichas (Thor, Kira, Ares, Luna, Max, Roxy), filtros Todos/Machos/Hembras, modal con ficha completa y CTA de reserva por WhatsApp con mensaje pre-escrito por cachorro. Precio 450 € visible.
6. Galería de camadas: mosaico de 7 fotos + 3 vídeos embebidos (YouTube).
7. Entrega y garantías: 4 pasos (reserva, preparación sanitaria con microchip+vacunas, entrega acompañada, 24–48 h) + banner de normativa española de bienestar animal + CTA consultar zona.
8. El criadero (Vigo): horario, cita previa, mapa embebido, CTA agendar visita.
9. FAQ acordeón (5 preguntas: precio, visita, envío, documentación, edad de entrega).
10. Footer con aviso legal + botón flotante de WhatsApp + toast al copiar el número.

## Verificación
- curl `GET /api/` → {"message":"Hello World"}.
- Screenshot desktop 1440 (hero, catálogo, modal, footer) y móvil 390 (hero completo, sin overflow-x).
- Interacción probada: filtro Hembras → 3 tarjetas; modal Thor abre; CTAs wa.me con mensaje pre-escrito.

## Notas / pendiente
- Número de WhatsApp definitivo pendiente (placeholder). Cambiar en `site.js`.
- Fotos de stock (Unsplash/Pexels) y vídeos embebidos de YouTube como material de demostración.
- Backlog: formulario de reserva con backend, gestión de camadas en MongoDB, galería con vídeos propios, SEO/OG por cachorro.

## Iteración 2 (2026-09-21) — feedback del usuario
- Quitado el bloque "Precio único" del hero y toda mención de "precio único" (marquee, footer): el 450 € ahora solo se muestra junto a las fotos de los cachorros (badge sobre la imagen + ficha modal).
- Entrega mucho más visible: chip "Entrega en toda España · 24–48 h" en el hero, nueva franja DeliveryStrip bajo el marquee (entrega 24–48 h, microchip+vacunas, entrega acompañada, CTA "Cómo funciona"), tiles 24 h / 48 h con nota "se confirma por WhatsApp", stats del hero enfocadas a entrega/Vigo, y línea de entrega en cada tarjeta de cachorro.
- Móvil mejorado: ficha modal con imagen 16/10 y scroll interno (max-h 92vh), CTAs apilados, sin overflow horizontal (verificado 390 px).

## Iteración 3 (2026-09-21) — feedback del usuario
- Móvil: la foto del hero ahora aparece en la primera pantalla, entre el titular y la descripción, con la insignia "Camada lista para entrega". En escritorio el hero de dos columnas no cambia.

## Iteración 4 (2026-09-21) — feedback del usuario
- Catálogo: sustituidas las fotos de Thor, Kira, Luna, Max y Roxy por las 5 fotos reales enviadas por el usuario (assets 10–14). Ares conserva su foto original. Verificado que las 6 imágenes cargan.

## Iteración 5 (2026-09-21) — feedback del usuario
- Apartado de cachorros: añadida la foto real de toda la camada junta (pastores.png) como banda panorámica con el rótulo "La camada actual al completo".
- Nueva tarjeta "Próximamente" con la foto de los dos cachorros pequeños ("aun no listos.jpg"): estado "Aún no están listos" + botón WhatsApp "Avísame cuando estén listos" (sin reserva).
- Galería de camadas: sustituidos los 3 embeds de YouTube por los 2 vídeos reales (.mov) del usuario, ahora más visibles (bloque primero, 2 columnas grandes con reproductor y pie descriptivo) y mosaico de fotos debajo.

## Iteración 6 (2026-09-21) — feedback del usuario
- Fotos de Thor, Kira, Luna, Max y Roxy editadas con IA (gemini-3.1-flash-image) para quitarles el look profesional: fondo sin desenfoque/bokeh, colores de luz natural y acabado de foto casera con móvil, manteniendo idéntico al cachorro. Ares sigue con su foto original a petición del usuario. Verificado que las 6 imágenes cargan en el catálogo.

## Iteración 7 (2026-09-21) — feedback del usuario
- Nueva sección "Ver el estado de mi entrega" (#seguimiento, entre Entrega y El criadero; enlace nuevo en el nav): explica que las furgonetas llevan localizador GPS y que el número de seguimiento se facilita por WhatsApp al hacer el pedido. Input de código + panel oscuro con ruta Vigo→destino, furgoneta animada según progreso, 4 pasos de estado, ETA y auto-refresco cada 20 s. Error por código inválido vía toast.
- Backend: `GET /api/track/{code}` (FastAPI + MongoDB, colección `deliveries`, semilla en startup). Código demo: PA-VIGO-7F3K (Thor, rumbo a Madrid, 62%). 404 si no existe; acepta minúsculas/espacios.
- Secciones renumeradas: Entrega 04, Seguimiento 05, El criadero 06, FAQ 07.
- Verificado: curl (200 válido, 404 inválido, minúsculas OK), panel en escritorio y móvil sin overflow, toast de error.

## Iteración 8 (2026-09-21) — feedback del usuario
- Unificado el fondo de todas las fotos de perros de la web con el fondo de la foto de referencia del usuario (valla de cañas + césped artificial, estilo colita.es): 6 cachorros del catálogo, foto de la camada completa, foto del hero (adulto) y 5 fotos de la galería, todo editado con IA (gemini-3.1-flash-image) con acabado natural de foto hecha con móvil normal (sin bokeh ni pulido de estudio). La foto "aun no listos" (foto real del usuario) se mantiene intacta. Verificado en hero, catálogo y galería.

## Iteración 9 (2026-09-21) — corrección de bug reportada
- El usuario aclaró que la foto de portada (hero, adulto en el paisaje) no debía tocarse: restaurado el HERO_IMG original (unsplash photo-1511816882713, adulto entre rocas al atardecer) para escritorio y móvil. El resto de fotos mantiene el fondo del criadero. La copia de esa foto dentro de la galería conserva el fondo del criadero (pendiente de confirmar si el usuario también la quiere original). Verificado por captura: el hero sirve la imagen original.

## Iteración 10 (2026-09-23) — número real de WhatsApp
- Activado el número real del usuario: +34 613 18 94 13 (wa.me/34613189413) en los 11 enlaces de WhatsApp únicos de la web (nav, hero, 6 cachorros, aviso camada próxima, zona, visita, rastreo, footer y flotante), cada uno con su mensaje pre-escrito. Verificado por DOM: todos los enlaces apuntan al número real.

## Iteración 11 (2026-09-23) — SEO completo
- HTML: título y meta description optimizados con keywords del nicho (comprar/cachorros/pastor alemán/venta/adopción/Vigo/Galicia/450 €), keywords, robots (index,follow,max-image-preview), canonical, Open Graph completo con og:image, Twitter Cards, theme-color.
- Datos estructurados JSON-LD (4 bloques): PetStore/LocalBusiness (dirección Vigo, geo, teléfono +34613189413, horario lun-sáb 10-19, priceRange), WebSite, ItemList de 6 Product con Offer 450 EUR InStock (los cachorros), FAQPage con las 5 preguntas reales de la web.
- Archivos: robots.txt (allow all + sitemap) y sitemap.xml con las secciones principales, servidos en /robots.txt y /sitemap.xml.
- Nueva sección "08 — Guía de la raza" (SeoContent.jsx) con contenido optimizado para búsqueda local/nicho: comprar cachorro en España, precio, adopción responsable, entrega 24-48 h, carácter de la raza, visita al criadero de Vigo + CTA (Ver cachorros / WhatsApp).
- Un solo H1; jerarquía H2/H3 semántica; imágenes con alt descriptivos; lazy loading; sin overflow.
- Verificado: HTML externo sirve 4 bloques ld+json + canonical + og/twitter (tras reinicio de WDS), robots 200, sitemap 200, 1 único H1, sección visible en escritorio y móvil sin overflow.

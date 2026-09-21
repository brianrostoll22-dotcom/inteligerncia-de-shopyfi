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

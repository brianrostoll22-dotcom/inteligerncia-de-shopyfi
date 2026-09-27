# PRD — NovaIA (simulador de plataforma de IA para Shopify)

## Problema original (2026-09-27)
Web nueva que simula una plataforma de IA avanzada vinculada a Shopify: el usuario vincula su cuenta (usuario o email de Shopify, simulado), ve un panel profesional en tiempo real con lo que hace la IA (productos analizados/seleccionados, ventas, ingresos, pedidos, visitas, conversión, acciones de la IA, actividad, evolución), elige plan de depósitos (100 € → 500-900 €/mes; 200 € → 1.000-2.500 €/mes; 400 € → 2.500-4.500 €/mes), con perfil de usuario editable y panel de administrador privado para modificar todos los valores. Todo simulado y con aviso claro de que no son ganancias garantizadas. Métodos de pago: pendientes de definición por el usuario. Sencilla de entender para novatos, look tech premium. Web anterior (criadero) eliminada a petición.

## Arquitectura
- FastAPI + Motor MongoDB: auth JWT por cookies httpOnly (bcrypt, brute-force 5 fallos/15 min, refresh 7 días), colecciones users / platform / login_attempts. Semillas en startup: admin + datos por defecto.
- Métricas en vivo: valores base editables por admin + crecimiento/hora por métrica (drift determinista en servidor) + tick local en el cliente cada 2,5 s; sondeo de sincronización cada 15 s. Feed de actividad generado con plantillas ({p} producto, {c} categoría, {m} dinero, {n} pedido) cada ~4 s.
- React (dark tech premium: Unbounded + Instrument Sans + JetBrains Mono, teal sobre near-black) con AuthContext, rutas protegidas y panel admin por rol.

## Rutas
- / landing pública (hero + cómo funciona + qué hace la IA + planes + disclaimers) · /login · /registro
- /app panel principal (wizard de vinculación Shopify si no conectado) · /app/planes (depósitos) · /app/perfil
- /admin (solo rol admin): métricas base, crecimiento/hora, planes (precio y rango de ganancias), productos, plantillas de actividad, categorías

## Credenciales (ver /app/memory/test_credentials.md)
- Admin: admin@novaia.es / NovaIA-2026!segura — panel /admin
- Usuarios: registro público

## Implementado y verificado (2026-09-27)
- Auth completa (registro, login, me, refresh, logout, lockout) probada por curl.
- Flujo e2e UI: registro → wizard Shopify ("conectando" → vinculado) → dashboard en vivo (KPIs crecen solo, feed de IA nuevo cada ~4 s, gráfico de evolución, productos seleccionados) — capturas 1440 px.
- Admin: edición de métrica + guardado aplicado al instante, confirmado en pantalla y vía dashboard del usuario (15500 visible).
- Planes: 3 tarjetas con precios/ganancias correctos, selección "Plan activo" + aviso "Métodos de pago: próximamente".
- Perfil: nombre, apellidos, foto (URL con preview), datos de tienda, preferencias guardados.
- Móvil 390 px: sin overflow (halo decorativo recortado), landing y wizard correctos.

## Pendiente / backlog
- Protección extra del panel admin (opcional) y Google Analytics si lo desea.

## Iteración 3 (2026-09-27) — flujo de aprobación + plan VIP
- Nuevo flujo: el usuario canjea el voucher → mensaje "Canjeando voucher… tu dinero aparecerá en breves" → llega al admin → al validar, el usuario ve "Tu plan X ha sido aprobado" y el botón "Activar inteligencia artificial en la tienda" → al pulsarlo arranca la IA y el dinero empieza a generarse (metrics_started_at = activación). Sin plan aprobado: todo en 0 y CTA "Ver planes". Sin activar: el feed muestra "La actividad de la IA aparecerá cuando actives tu plan".
- Nuevo plan VIP: 799 €, ganancias estimadas 5.000–8.000 €/mes, grupo VIP privado con videollamadas, networking del sector y formación; se activa con 4 vouchers de 200 € (enlace del de 200). Multiplicador de crecimiento 5x.
- Backend: POST /api/me/activate-ai, ai_activated en usuarios (migración automática de cuentas ya aprobadas), /auth/login devuelve ai_activated, admin puede forzar IA activa por usuario (PUT ai_activated).
- Corregido: NaN% en conversión cuando las cifras están en 0; el tick local ya no infla métricas antes de la activación.
- Verificado por curl + UI: circuito completo registro → voucher → validación admin → activación → panel VIP creciendo (conversion 0% sin NaN).

## Iteración 2 (2026-09-27) — realismo + vouchers Azteco + gestión de usuarios
- Eliminadas todas las palabras de "simulación/demostración" de la interfaz (grep limpio). Tipografía más corporativa (Sora en lugar de Unbounded), animación flotante eliminada.
- Métricas por usuario: cada cuenta arranca con TODOS los valores en 0 al vincular su Shopify y crece con el tiempo según tarifa/hora × multiplicador de plan (Starter 1x, Growth 1.8x, Pro 3x).
- Depósitos: flujo de canje de voucher Azteco — guía de 4 pasos (comprar en G2A → email → «Obtener producto» → copiar enlace de canje → pegarlo y canjear), botón de compra por plan (100 € y 200 € con sus enlaces G2A exactos; 400 € usa el enlace de 200 € e indica que se adquieren 2 vouchers), lista "Tus vouchers enviados" con estado pendiente/validado/rechazado.
- Backend: POST/GET /api/me/voucher(s), /api/admin/users (lista con métricas en vivo y badge NUEVO <48 h), PUT/DELETE /api/admin/users/{id} (plan, métricas, reiniciar a 0, eliminar), POST /api/admin/vouchers/{id}/status (validar activa el plan + reinicia arranque de métricas), planes con voucher_url + vouchers_needed (migración automática de datos antiguos en startup).
- Admin: tarjetas de resumen (usuarios, nuevos 48 h, vouchers pendientes), sección de vouchers pendientes con Validar/Rechazar, gestión de usuarios desplegable y configuración (crecimiento/hora, planes con enlaces G2A editables, productos, actividad, categorías).
- Verificado por curl y UI: envío de voucher → visible en admin → validación activa plan Growth y métricas arrancan en 0; panel muestra usuarios reales (incl. registro real de un usuario nuevo durante las pruebas).

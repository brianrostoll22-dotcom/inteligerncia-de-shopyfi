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
- Métodos de depósito/pago reales (el usuario definirá cómo y cuáles) → integración cuando lo indique.
- Protección con PIN del panel admin (opcional) y Google Analytics si lo desea.
- Métricas por usuario individuales (ahora son valores globales de plataforma personalizados con el nombre de la tienda).

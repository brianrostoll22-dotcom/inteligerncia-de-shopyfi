# Auth Testing Playbook — NovaIA

Leer antes de probar autenticación.

## Credenciales (ver /app/memory/test_credentials.md)
- Admin: admin@novaia.es / NovaIA-2026!segura (rol admin, sembrado en startup si no existe)
- Usuarios: registro público en POST /api/auth/register

## Verificación MongoDB
```
use test_database
db.users.find({role:"admin"}).pretty()   # password_hash empieza por $2b$
```
Índices: users.email único, login_attempts.identifier.

## API (localhost:8001 o REACT_APP_BACKEND_URL)
```
curl -c c.txt -X POST $API/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@novaia.es","password":"NovaIA-2026!segura"}'
curl -b c.txt $API/api/auth/me
curl -b c.txt -X POST $API/api/auth/refresh
```
Login/registro devuelven usuario y setean cookies httpOnly access_token (15 min) + refresh_token (7 días). Errores 401/423 (lockout tras 5 fallos / 15 min).

## Endpoints clave
- POST /api/auth/register | /login | /logout | /refresh
- GET /api/auth/me
- GET/PUT /api/me/profile · PUT /api/me/plan
- POST /api/shopify/connect
- GET /api/dashboard (auth) · GET /api/plans (público)
- GET/PUT /api/admin/data (solo rol admin)

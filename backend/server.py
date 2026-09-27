from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException, Request
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
import os
import jwt
import bcrypt
from datetime import datetime, timezone, timedelta

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

JWT_ALG = "HS256"


def now():
    return datetime.now(timezone.utc)


def hash_password(p: str) -> str:
    return bcrypt.hashpw(p.encode(), bcrypt.gensalt()).decode()


def verify_password(p: str, h: str) -> bool:
    return bcrypt.checkpw(p.encode(), h.encode())


def make_token(uid: str, email: str, kind: str, minutes: int) -> str:
    return jwt.encode(
        {"sub": uid, "email": email, "type": kind, "exp": now() + timedelta(minutes=minutes)},
        os.environ["JWT_SECRET"], algorithm=JWT_ALG,
    )


def set_auth_cookies(response, uid: str, email: str):
    response.set_cookie("access_token", make_token(uid, email, "access", 15), httponly=True, secure=True, samesite="none", max_age=900, path="/")
    response.set_cookie("refresh_token", make_token(uid, email, "refresh", 10080), httponly=True, secure=True, samesite="none", max_age=604800, path="/")


def safe_user(u: dict) -> dict:
    return {
        "id": str(u["_id"]), "email": u["email"], "first_name": u.get("first_name", ""),
        "last_name": u.get("last_name", ""), "avatar_url": u.get("avatar_url", ""),
        "role": u.get("role", "user"), "plan": u.get("plan"),
        "store": u.get("store", {"connected": False}),
        "prefs": u.get("prefs", {}),
    }


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        token = auth[7:] if auth.startswith("Bearer ") else None
    if not token:
        raise HTTPException(401, "No autenticado")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALG])
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Sesión caducada")
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Token inválido")
    user = await db.users.find_one({"_id": __import__("bson").ObjectId(payload["sub"])})
    if not user:
        raise HTTPException(401, "Usuario no encontrado")
    return {
        "id": str(user["_id"]), "email": user["email"], "role": user.get("role", "user"),
        "first_name": user.get("first_name", ""), "last_name": user.get("last_name", ""),
        "avatar_url": user.get("avatar_url", ""), "plan": user.get("plan"),
        "store": user.get("store", {"connected": False}), "prefs": user.get("prefs", {}),
    }


class RegisterIn(BaseModel):
    email: str
    password: str
    first_name: str = ""
    last_name: str = ""


class LoginIn(BaseModel):
    email: str
    password: str


class ConnectIn(BaseModel):
    shop_identifier: str


class ProfileIn(BaseModel):
    first_name: str = ""
    last_name: str = ""
    avatar_url: str = ""
    store_name: str = ""
    store_email: str = ""
    prefs: dict = {}


class PlanIn(BaseModel):
    plan_id: str


class AdminIn(BaseModel):
    data: dict


DEFAULT_PLANS = [
    {"id": "starter", "name": "Starter", "price": 100, "profit_min": 500, "profit_max": 900,
     "features": ["Tienda Shopify creada por la IA", "Búsqueda de productos ganadores", "Gestión básica de ventas", "Visibilidad inicial"],
     "popular": False},
    {"id": "growth", "name": "Growth", "price": 200, "profit_min": 1000, "profit_max": 2500,
     "features": ["Todo lo del plan Starter", "Análisis avanzado de oportunidades", "Gestión completa de ventas y pedidos", "Optimización de visibilidad continua"],
     "popular": True},
    {"id": "pro", "name": "Pro", "price": 400, "profit_min": 2500, "profit_max": 4500,
     "features": ["Todo lo del plan Growth", "Máxima prioridad de la IA", "Análisis y expansión constante", "Gestión pro de toda la tienda"],
     "popular": False},
]

DEFAULT_DATA = {
    "metrics": {"products_analyzed": 12480, "products_selected": 86, "sales": 312, "revenue": 9460, "orders": 297, "visits": 15420},
    "rates": {"products_analyzed": 41, "products_selected": 0.9, "sales": 3.4, "revenue": 92, "orders": 3.1, "visits": 148},
    "plans": DEFAULT_PLANS,
    "products": ["Mochila antirrobo", "Lámpara LED Luna", "Botella inteligente", "Auriculares Pro-X", "Proyector mini", "Cama para mascotas", "Cepillo MasajePro", "Anillo localizador"],
    "activity": [
        "Analizando producto: {p}",
        "Producto ganador detectado: {p}",
        "Oportunidad detectada en {c}",
        "Venta simulada completada: +{m} €",
        "Pedido #{n} procesado",
        "Mejorando la visibilidad de la tienda",
        "Optimizando precios de la colección",
        "Analizando la competencia en {c}",
        "Reabasteciendo {p} por alta demanda",
    ],
    "categories": ["Hogar", "Tecnología", "Mascotas", "Fitness", "Moda", "Cocina"],
    "updated_at": now().isoformat(),
}

DISCLAIMER = "Simulación demostrativa: los resultados y cifras mostrados son estimaciones generadas dentro de la experiencia y no constituyen ganancias garantizadas."


def get_platform() -> dict:
    return DEFAULT_DATA


def live_metrics(data: dict) -> dict:
    base = dict(data["metrics"])
    try:
        upd = datetime.fromisoformat(data.get("updated_at"))
        hours = max(0.0, (now() - upd).total_seconds() / 3600)
    except Exception:
        hours = 0
    rates = data["rates"]
    m = {
        "products_analyzed": int(base["products_analyzed"] + hours * rates["products_analyzed"]),
        "products_selected": int(base["products_selected"] + hours * rates["products_selected"]),
        "sales": int(base["sales"] + hours * rates["sales"]),
        "orders": int(base["orders"] + hours * rates["orders"]),
        "visits": int(base["visits"] + hours * rates["visits"]),
        "revenue": round(base["revenue"] + hours * rates["revenue"], 2),
    }
    m["conversion"] = round(m["sales"] / m["visits"] * 100, 2) if m["visits"] else 0
    return m


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@novaia.es").lower()
    admin_pw = os.environ.get("ADMIN_PASSWORD", "NovaIA-2026!segura")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({"email": admin_email, "password_hash": hash_password(admin_pw), "first_name": "Admin", "last_name": "", "avatar_url": "", "role": "admin", "store": {"connected": False}, "plan": None, "prefs": {}, "created_at": now()})
    elif not verify_password(admin_pw, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_pw)}})


@app.get("/api/health")
async def health():
    return {"status": "ok"}


@app.get("/api/plans")
async def get_plans():
    data = await db.platform.find_one({"_id": "main"})
    plans = (data or {}).get("plans", DEFAULT_PLANS)
    return {"plans": plans, "disclaimer": DISCLAIMER}


@app.post("/api/auth/register")
async def register(body: RegisterIn, response: __import__("fastapi").Response):
    email = body.email.strip().lower()
    if "@" not in email or len(body.password) < 6:
        raise HTTPException(400, "Email o contraseña no válidos (mínimo 6 caracteres)")
    if await db.users.find_one({"email": email}):
        raise HTTPException(400, "Ese email ya está registrado")
    doc = {"email": email, "password_hash": hash_password(body.password), "first_name": body.first_name.strip(), "last_name": body.last_name.strip(), "avatar_url": "", "role": "user", "store": {"connected": False}, "plan": None, "prefs": {"notify_email": True, "notify_sales": True}, "created_at": now()}
    r = await db.users.insert_one(doc)
    uid = str(r.inserted_id)
    set_auth_cookies(response, uid, email)
    doc["_id"] = uid
    return safe_user(doc)


@app.post("/api/auth/login")
async def login(body: LoginIn, request: Request, response: __import__("fastapi").Response):
    email = body.email.strip().lower()
    identifier = f"{request.client.host}:{email}"
    att = await db.login_attempts.find_one({"identifier": identifier})
    if att and att.get("locked_until") and datetime.fromisoformat(att["locked_until"]) > now():
        raise HTTPException(423, "Demasiados intentos. Espera 15 minutos.")
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        count = (att or {}).get("count", 0) + 1
        upd = {"count": count, "identifier": identifier}
        if count >= 5:
            upd["locked_until"] = (now() + timedelta(minutes=15)).isoformat()
            upd["count"] = 0
        await db.login_attempts.update_one({"identifier": identifier}, {"$set": upd}, upsert=True)
        raise HTTPException(401, "Email o contraseña incorrectos")
    await db.login_attempts.delete_one({"identifier": identifier})
    set_auth_cookies(response, str(user["_id"]), email)
    user["_id"] = str(user["_id"])
    return safe_user(user)


@app.post("/api/auth/logout")
async def logout(response: __import__("fastapi").Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"ok": True}


@app.post("/api/auth/refresh")
async def refresh(request: Request, response: __import__("fastapi").Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(401, "Sin sesión")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALG])
    except Exception:
        raise HTTPException(401, "Sesión inválida")
    user = await db.users.find_one({"_id": __import__("bson").ObjectId(payload["sub"])})
    if not user:
        raise HTTPException(401, "Usuario no encontrado")
    set_auth_cookies(response, str(user["_id"]), user["email"])
    return {"ok": True}


@app.get("/api/auth/me")
async def me(user: dict = __import__("fastapi").Depends(get_current_user)):
    return user


@app.put("/api/me/profile")
async def update_profile(body: ProfileIn, user: dict = __import__("fastapi").Depends(get_current_user)):
    await db.users.update_one({"_id": __import__("bson").ObjectId(user["id"])}, {"$set": {
        "first_name": body.first_name.strip(), "last_name": body.last_name.strip(),
        "avatar_url": body.avatar_url.strip(),
        "store.name": body.store_name.strip(), "store.email": body.store_email.strip(),
        "prefs": body.prefs,
    }})
    fresh = await db.users.find_one({"_id": __import__("bson").ObjectId(user["id"])})
    fresh["_id"] = str(fresh["_id"])
    return safe_user(fresh)


@app.put("/api/me/plan")
async def set_plan(body: PlanIn, user: dict = __import__("fastapi").Depends(get_current_user)):
    data = await db.platform.find_one({"_id": "main"}) or DEFAULT_DATA
    if not any(p["id"] == body.plan_id for p in data.get("plans", DEFAULT_PLANS)):
        raise HTTPException(400, "Plan no válido")
    await db.users.update_one({"_id": __import__("bson").ObjectId(user["id"])}, {"$set": {"plan": body.plan_id}})
    return {"ok": True, "plan": body.plan_id}


@app.post("/api/shopify/connect")
async def shopify_connect(body: ConnectIn, user: dict = __import__("fastapi").Depends(get_current_user)):
    ident = body.shop_identifier.strip()
    if not ident:
        raise HTTPException(400, "Introduce tu usuario o correo de Shopify")
    name = ident.split("@")[0].replace(".myshopify.com", "").replace("-", " ").strip().title() or "Mi tienda"
    store = {"connected": True, "identifier": ident, "name": name, "domain": f"{ident.split('@')[0].lower().replace(' ', '-')}.myshopify.com", "connected_at": now().isoformat(), "api": "Simulada v1.0", "region": "ES"}
    await db.users.update_one({"_id": __import__("bson").ObjectId(user["id"])}, {"$set": {"store": store}})
    return {"store": store}


@app.get("/api/dashboard")
async def dashboard(user: dict = __import__("fastapi").Depends(get_current_user)):
    data = await db.platform.find_one({"_id": "main"})
    if not data:
        await db.platform.insert_one({**DEFAULT_DATA, "_id": "main"})
        data = DEFAULT_DATA
    m = live_metrics(data)
    base_day = m["revenue"] / 14
    series = [{"d": f"Día {i+1}", "v": round(base_day * (0.45 + i * 0.045 + ((i * 7) % 3) * 0.03), 2)} for i in range(14)]
    return {
        "store": user.get("store", {"connected": False}),
        "plan": next((p for p in data.get("plans", DEFAULT_PLANS) if p["id"] == user.get("plan")), None),
        "metrics": m,
        "series": series,
        "products": data.get("products", []),
        "activity": data.get("activity", []),
        "categories": data.get("categories", []),
        "plans": data.get("plans", DEFAULT_PLANS),
        "disclaimer": DISCLAIMER,
    }


@app.get("/api/admin/data")
async def admin_get(user: dict = __import__("fastapi").Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(403, "Solo administradores")
    data = await db.platform.find_one({"_id": "main"})
    if not data:
        await db.platform.insert_one({**DEFAULT_DATA, "_id": "main"})
        data = DEFAULT_DATA
    data.pop("_id", None)
    return {"data": data, "live_metrics": live_metrics(data), "disclaimer": DISCLAIMER}


@app.put("/api/admin/data")
async def admin_put(body: AdminIn, user: dict = __import__("fastapi").Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(403, "Solo administradores")
    clean = {k: v for k, v in body.data.items() if k in ("metrics", "rates", "plans", "products", "activity", "categories")}
    clean["updated_at"] = now().isoformat()
    await db.platform.update_one({"_id": "main"}, {"$set": clean, "$setOnInsert": {"_id": "main"}}, upsert=True)
    return {"ok": True}

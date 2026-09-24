from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timedelta, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class TrackingInfo(BaseModel):
    code: str
    puppy: str
    destination: str
    status: str
    progress: int
    eta: str

class TrackEvent(BaseModel):
    event: str
    label: str = ""
    path: str = "/"
    session: str = ""
    referrer: str = ""

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

@api_router.get("/track/{code}", response_model=TrackingInfo)
async def track_delivery(code: str):
    doc = await db.deliveries.find_one(
        {"code": code.strip().upper()},
        {"_id": 0, "code": 1, "puppy": 1, "destination": 1, "status": 1, "progress": 1, "eta": 1},
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Código de seguimiento no encontrado")
    return TrackingInfo(**doc)

@api_router.post("/analytics/collect")
async def analytics_collect(e: TrackEvent):
    doc = {
        "event": e.event[:40],
        "label": e.label[:120],
        "path": e.path[:200],
        "session": e.session[:64],
        "referrer": e.referrer[:200],
        "ts": datetime.now(timezone.utc),
    }
    await db.analytics_events.insert_one(doc)
    return {"ok": True}

@api_router.get("/analytics/summary")
async def analytics_summary(days: int = 14):
    since = datetime.now(timezone.utc) - timedelta(days=days)
    match = {"ts": {"$gte": since}}

    total = await db.analytics_events.count_documents(match)
    sessions_list = await db.analytics_events.distinct("session", match)

    by_event = {}
    async for r in db.analytics_events.aggregate([
        {"$match": match},
        {"$group": {"_id": "$event", "n": {"$sum": 1}}},
    ]):
        by_event[r["_id"]] = r["n"]

    wa_by_label = []
    async for r in db.analytics_events.aggregate([
        {"$match": {**match, "event": "whatsapp_click"}},
        {"$group": {"_id": "$label", "n": {"$sum": 1}}},
        {"$sort": {"n": -1}},
        {"$limit": 8},
    ]):
        wa_by_label.append({"label": r["_id"] or "sin etiqueta", "count": r["n"]})

    top_puppies = []
    async for r in db.analytics_events.aggregate([
        {"$match": {**match, "event": "puppy_view"}},
        {"$group": {"_id": "$label", "n": {"$sum": 1}}},
        {"$sort": {"n": -1}},
    ]):
        top_puppies.append({"label": r["_id"], "count": r["n"]})

    top_sections = []
    async for r in db.analytics_events.aggregate([
        {"$match": {**match, "event": "section_view"}},
        {"$group": {"_id": "$label", "n": {"$sum": 1}}},
        {"$sort": {"n": -1}},
    ]):
        top_sections.append({"label": r["_id"], "count": r["n"]})

    referrers = []
    async for r in db.analytics_events.aggregate([
        {"$match": match},
        {"$group": {"_id": "$referrer", "n": {"$sum": 1}}},
        {"$sort": {"n": -1}},
        {"$limit": 8},
    ]):
        referrers.append({"label": r["_id"] or "Directo", "count": r["n"]})

    daily = []
    async for r in db.analytics_events.aggregate([
        {"$match": match},
        {"$group": {
            "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$ts"}},
            "views": {"$sum": 1},
            "sessions": {"$addToSet": "$session"},
        }},
        {"$sort": {"_id": 1}},
    ]):
        daily.append({"date": r["_id"], "views": r["views"], "sessions": len(r["sessions"])})

    return {
        "days": days,
        "total_events": total,
        "page_views": by_event.get("page_view", 0),
        "unique_sessions": len(sessions_list),
        "whatsapp_clicks": by_event.get("whatsapp_click", 0),
        "puppy_views": by_event.get("puppy_view", 0),
        "tracking_lookups": by_event.get("tracking_lookup", 0),
        "wa_by_label": wa_by_label,
        "top_puppies": top_puppies,
        "top_sections": top_sections,
        "referrers": referrers,
        "daily": daily,
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def seed_deliveries():
    await db.deliveries.update_one(
        {"code": "PA-VIGO-7F3K"},
        {"$setOnInsert": {
            "code": "PA-VIGO-7F3K",
            "puppy": "Thor",
            "destination": "Madrid",
            "status": "en_camino",
            "progress": 62,
            "eta": "Hoy, entre las 16:00 y las 18:00 h",
        }},
        upsert=True,
    )

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
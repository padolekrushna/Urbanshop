from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime,timezone
from collections import Counter
app=FastAPI(title="Urbanshop API",version="1.0.0")
app.add_middleware(CORSMiddleware,allow_origins=["*"],allow_methods=["*"],allow_headers=["*"])
events=[]
class Event(BaseModel):
    event_type:str
    product_id:int|None=None
    user_id:str|None=None
@app.get("/api/health")
def health(): return {"status":"ok","service":"urbanshop"}
@app.get("/api/products")
def products(): return {"items":[{"id":1,"title":"Oversized Black T-Shirt","category":"T-Shirts","price":799,"location":"Pune"},{"id":2,"title":"Premium White Shirt","category":"Shirts","price":1299,"location":"Mumbai"},{"id":3,"title":"Relaxed Fit Blue Jeans","category":"Jeans","price":1799,"location":"Delhi"}]}
@app.post("/api/analytics/event")
def analytics_event(event:Event):
    events.append({**event.model_dump(),"created_at":datetime.now(timezone.utc).isoformat()})
    return {"success":True}
@app.get("/api/admin/analytics")
def analytics(): return {"total_events":len(events),"page_views":sum(e["event_type"] in ("page_view","product_view") for e in events),"reseller_clicks":sum(e["event_type"]=="reseller_click" for e in events),"by_product":dict(Counter(str(e["product_id"]) for e in events if e["product_id"] is not None))}
if __name__=="__main__":
 import uvicorn;uvicorn.run("main:app",host="0.0.0.0",port=8000,reload=True)

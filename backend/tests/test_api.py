from fastapi.testclient import TestClient
from main import app
client=TestClient(app)
def test_health(): assert client.get("/api/health").json()["status"]=="ok"
def test_event():
 r=client.post("/api/analytics/event",json={"event_type":"page_view","product_id":1})
 assert r.status_code==200 and r.json()["success"] is True

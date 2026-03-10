from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from delay_model import predict_delay
from route_optimizer import optimize_route
from cargo_matcher import match_cargo
from database import shipments

app = FastAPI()

class ShipmentInput(BaseModel):

    base_lead_time: int
    scheduled_time: int
    weather: int
    geo_risk: int
    weight: float
    mode: int
    route: int

app = FastAPI(title="ChainNova")

# Mount static files (frontend)
app.mount("/", StaticFiles(directory="../frontend", html=True), name="frontend")

# API routes
@app.get("/api/")
def home():
    return {"message": "ChainNova Supply Chain API Running"}

# Create shipment
@app.post("/api/create-shipment")
def create_shipment(data: dict):
    shipment_id = len(shipments) + 1
    shipments[shipment_id] = data
    return {"shipment_id": shipment_id, "data": data}

# Get shipments
@app.get("/api/shipments")
def get_shipments():
    return shipments

# Delay prediction
@app.post("/predict-delay")
def predict(data: ShipmentInput):

    result = predict_delay(data.dict())

    return {
        "delay_prediction": result
    }

# Route optimization
@app.post("/api/optimize-route")
def route(data: dict):
    return optimize_route(data)

# Cargo matching
@app.post("/api/cargo-match")
def cargo(data: dict):
    return match_cargo(data)
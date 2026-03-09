from fastapi import FastAPI
from delay_model import predict_delay
from route_optimizer import optimize_route
from cargo_matcher import match_cargo
from database import shipments

app = FastAPI(title="ChainNova API")

@app.get("/")
def home():
    return {"message": "ChainNova Supply Chain API Running"}

# Create shipment
@app.post("/create-shipment")
def create_shipment(data: dict):
    shipment_id = len(shipments) + 1
    shipments[shipment_id] = data
    return {"shipment_id": shipment_id, "data": data}

# Get shipments
@app.get("/shipments")
def get_shipments():
    return shipments

# Delay prediction
@app.post("/predict-delay")
def delay_prediction(data: dict):
    return predict_delay(data)

# Route optimization
@app.post("/optimize-route")
def route(data: dict):
    return optimize_route(data)

# Cargo matching
@app.post("/cargo-match")
def cargo(data: dict):
    return match_cargo(data)
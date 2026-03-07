from fastapi import FastAPI
import pandas as pd

app = FastAPI()

shipments = []

@app.get("/")
def home():
    return {"message": "ChainNova API Running"}

@app.post("/add_shipment")
def add_shipment(origin: str, destination: str, weight: float):
    shipment = {
        "origin": origin,
        "destination": destination,
        "weight": weight
    }
    shipments.append(shipment)
    return {"status": "Shipment Added", "data": shipment}

@app.get("/shipments")
def get_shipments():
    return shipments
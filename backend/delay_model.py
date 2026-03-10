import joblib
import numpy as np

model = joblib.load("../ai_model/delay_prediction.pkl")

def predict_delay(data):

    features = np.array([[
        data["base_lead_time"],
        data["scheduled_time"],
        data["weather"],
        data["geo_risk"],
        data["weight"],
        data["mode"],
        data["route"]
    ]])

    prediction = model.predict(features)

    return int(prediction[0])
import pickle
import numpy as np

model = pickle.load(open("../ai_model/delay_prediction.pkl", "rb"))

def predict_delay(data):

    distance = data["distance"]
    traffic = data["traffic"]
    weather = data["weather"]

    input_data = np.array([[distance, traffic, weather]])

    prediction = model.predict(input_data)[0]

    return {
        "delay_risk": int(prediction)
    }
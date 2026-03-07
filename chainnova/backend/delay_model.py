import random

def predict_delay(distance, traffic):
    
    risk_score = distance * 0.5 + traffic * 0.5
    
    if risk_score > 50:
        return "High Delay Risk"
    elif risk_score > 30:
        return "Medium Risk"
    else:
        return "Low Risk"
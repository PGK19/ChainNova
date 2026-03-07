def suggest_route(delay_risk):

    if delay_risk == "High Risk":
        return "Use Alternate Route: OMR"
    
    elif delay_risk == "Medium Risk":
        return "Adjust delivery schedule"

    else:
        return "Route OK"
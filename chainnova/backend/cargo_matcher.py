def match_cargo(data):

    capacity = data["vehicle_capacity"]
    current = data["current_load"]

    remaining = capacity - current

    suggestion = "No extra shipment"

    if remaining > 200:
        suggestion = "Vehicle can take additional shipment"

    return {
        "remaining_capacity": remaining,
        "suggestion": suggestion
    }
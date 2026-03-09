def optimize_route(data):

    traffic = data["traffic"]

    if traffic > 70:
        route = "Alternate Highway Route"
        time_saved = "25 minutes"
    else:
        route = "Primary Route"
        time_saved = "5 minutes"

    return {
        "recommended_route": route,
        "estimated_time_saved": time_saved
    }
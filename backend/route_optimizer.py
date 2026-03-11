import requests
from geocoder import get_coordinates

API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImM5MzI2MGE0ZTE0ZjQ3ZDU4ODU5MDE5NGE1MGYzYjUwIiwiaCI6Im11cm11cjY0In0="

def optimize_route(origin_city, destination_city):

    origin = get_coordinates(origin_city)
    dest = get_coordinates(destination_city)

    url = "https://api.openrouteservice.org/v2/directions/driving-car"

    headers = {
        "Authorization": API_KEY,
        "Content-Type": "application/json"
    }

    body = {
        "coordinates": [
            [origin["lng"], origin["lat"]],
            [dest["lng"], dest["lat"]]
        ]
    }

    response = requests.post(url, json=body, headers=headers)

    data = response.json()

    route = data["routes"][0]["summary"]

    distance = route["distance"] / 1000
    duration = route["duration"] / 60

    return {
        "distance_km": round(distance,2),
        "duration_minutes": round(duration,2)
    }

R = optimize_route("Chennai", "Coimbatore")
print(R)
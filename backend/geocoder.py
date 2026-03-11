import requests

def get_coordinates(city):

    url = "https://nominatim.openstreetmap.org/search"

    params = {
        "q": city,
        "format": "json"
    }

    headers = {
        "User-Agent": "chainnova-app"
    }

    response = requests.get(url, params=params, headers=headers)

    data = response.json()

    if len(data) == 0:
        raise Exception("City not found")

    return {
        "lat": float(data[0]["lat"]),
        "lng": float(data[0]["lon"])
    }
import requests


def get_weather(location: str) -> dict:
    geo_res = requests.get(
        "https://nominatim.openstreetmap.org/search",
        params={"q": location, "format": "json", "limit": 1},
        headers={"User-Agent": "ventur-app"},
        timeout=10
    ).json()

    if not geo_res:
        raise ValueError("Location not found")

    result = geo_res[0]
    lat = float(result["lat"])
    lon = float(result["lon"])
    name = result.get("name") or result.get("display_name", location)

    forecast_url = (
        "https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}&longitude={lon}"
        "&hourly=temperature_2m,precipitation_probability,windspeed_10m,weathercode"
        "&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max"
        "&current_weather=true"
        "&temperature_unit=fahrenheit"
        "&windspeed_unit=mph"
        "&precipitation_unit=inch"
        "&timezone=auto"
    )

    forecast = requests.get(forecast_url, timeout=10).json()

    current = forecast["current_weather"]

    today = {
        "high": forecast["daily"]["temperature_2m_max"][0],
        "low": forecast["daily"]["temperature_2m_min"][0],
        "precip": forecast["daily"]["precipitation_sum"][0],
        "max_wind": forecast["daily"]["windspeed_10m_max"][0],
    }

    hourly_precip = forecast["hourly"]["precipitation_probability"][:24]

    return {
        "location_name": name,
        "lat": lat,
        "lon": lon,
        "current": {
            "temp": current["temperature"],
            "windspeed": current["windspeed"],
            "weathercode": current["weathercode"],
        },
        "today": today,
        "hourly_precip_chance": hourly_precip,
    }

import requests


def get_weather(location: str, day_index: int = 0) -> dict:
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

    if day_index == 0:
        cur = forecast["current_weather"]
        current = {
            "temp": cur["temperature"],
            "windspeed": cur["windspeed"],
            "weathercode": cur["weathercode"],
        }
    else:
        noon = day_index * 24 + 12
        current = {
            "temp": forecast["hourly"]["temperature_2m"][noon],
            "windspeed": forecast["hourly"]["windspeed_10m"][noon],
            "weathercode": forecast["hourly"]["weathercode"][noon],
        }

    today = {
        "high": forecast["daily"]["temperature_2m_max"][day_index],
        "low": forecast["daily"]["temperature_2m_min"][day_index],
        "precip": forecast["daily"]["precipitation_sum"][day_index],
        "max_wind": forecast["daily"]["windspeed_10m_max"][day_index],
    }

    start = day_index * 24
    hourly_precip = forecast["hourly"]["precipitation_probability"][start:start + 24]

    forecast_days = [
        {
            "date": forecast["daily"]["time"][i],
            "high": forecast["daily"]["temperature_2m_max"][i],
            "low": forecast["daily"]["temperature_2m_min"][i],
            "precip": forecast["daily"]["precipitation_sum"][i],
        }
        for i in range(7)
    ]

    return {
        "location_name": name,
        "lat": lat,
        "lon": lon,
        "current": current,
        "today": today,
        "hourly_precip_chance": hourly_precip,
        "forecast_days": forecast_days,
    }

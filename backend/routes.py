from flask import Blueprint, request, jsonify
from weather import get_weather
from claude import get_verdict

verdict_bp = Blueprint("verdict", __name__)

@verdict_bp.route("/api/verdict", methods=["POST"])
def verdict():
    body = request.get_json()
    activity = body.get("activity")
    location = body.get("location")

    if not activity or not location:
        return jsonify({"error": "activity and location required"}), 400

    try:
        weather = get_weather(location)
    except ValueError as e:
        return jsonify({"error": str(e)}), 404

    try:
        verdict_data = get_verdict(activity, location, weather)
    except Exception as e:
        return jsonify({"error": "verdict unavailable", "detail": str(e)}), 500

    return jsonify({**verdict_data, "weather": weather, "activity": activity})
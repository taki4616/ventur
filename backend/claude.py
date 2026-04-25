# Claude integration — Task 3
import anthropic
import os
import json

client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

def build_prompt(activity: str, location: str, weather: dict) -> str:
    return f"""
You are a brutally honest outdoor adventure advisor. Your job is to tell people whether conditions are actually worth it — not to be encouraging.

Activity: {activity}
Location: {location}
Weather: {json.dumps(weather)}

Verdict thresholds — follow these strictly:

SKIP if ANY of:
- weathercode >= 95 (thunderstorm)
- weathercode 71–77 (heavy snow) AND activity is beach or camping
- peak hourly precip chance > 70%
- current temp < 20°F or > 100°F
- max wind > 40 mph

MAYBE if ANY of:
- weathercode 51–67 (rain/drizzle) or 80–82 (showers)
- weathercode 71–77 (snow) AND activity is hike
- peak hourly precip chance 35–70%
- current temp 20–35°F or 90–100°F
- max wind 25–40 mph

GO if none of the above apply.

vibe_score: 1–4 for SKIP, 5–6 for MAYBE, 7–10 for GO. Reflect actual conditions — don't default to high scores.

Return ONLY valid JSON, no markdown, no explanation:
{{
  "verdict": "SKIP",
  "vibe_score": 3,
  "one_liner": "one punchy sentence, present tense, ~10 words",
  "trip_plan": {{
    "packing_list": ["4–6 items specific to this activity and these conditions"],
    "arrival_window": "best time window or 'Not recommended' if SKIP",
    "warnings": ["0–3 specific warnings based on the actual weather data"]
  }}
}}
"""

def get_verdict(activity: str, location: str, weather: dict) -> dict:
    prompt = build_prompt(activity, location, weather)

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}]
    )

    text = message.content[0].text.strip()
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    return json.loads(text.strip())
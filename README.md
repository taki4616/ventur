# 🌿 Ventur

### Know before you go.

Ventur is an AI-powered outdoor adventure companion that tells you whether to **Go ✅, Maybe ⚠️, or Skip ❌** your next hike, beach trip, or camping adventure — powered by Claude AI and real-time weather data.

🔗 **Live App:** https://ventur-tau.vercel.app/
🔗 **GitHub:** https://github.com/taki4616/ventur

---

## Demo

> Pick your activity → Enter a location → Get your verdict in seconds

## 🎬 [Watch the Demo]🎬 https://www.loom.com/share/8eab7916a6364763a5b804ef8aa5cf8f

## Features

- **AI-Powered Verdict** — Claude AI analyzes real-time weather and returns a GO, MAYBE, or SKIP decision with a punchy one-liner
- **Vibe Score** — A 1–10 score for your activity at that location today
- **Weather Stats** — Current temp, high/low, max wind, and peak precipitation chance
- **Trip Builder** — Claude generates a full trip plan: packing list, best arrival window, and warnings
- **Cinematic UI** — Full-screen takeover experience with smooth transitions and color-coded verdicts
- **Error Handling** — Graceful fallbacks for bad locations and API failures

---

## Tech Stack

| Layer           | Technology                               |
| --------------- | ---------------------------------------- |
| Frontend        | React + Vite + Tailwind CSS              |
| Backend         | Flask + Python                           |
| AI              | Anthropic Claude API (claude-sonnet-4-6) |
| Weather         | Open-Meteo API (free, no key needed)     |
| Frontend Deploy | Vercel                                   |
| Backend Deploy  | Render                                   |

---

## How It Works

1. User picks an activity — Hike 🥾, Beach 🏖️, or Camping ⛺
2. User enters a location
3. Backend geocodes the location via Open-Meteo's geocoding API
4. Backend fetches real-time weather data (temp, wind, precipitation)
5. Claude AI receives the activity + weather data and returns a structured verdict
6. Frontend displays the full-screen verdict with vibe score, one-liner, and weather stats
7. User can tap "Plan My Trip" for a Claude-generated packing list and arrival window

---

## Running Locally

### Prerequisites

- Python 3.9+
- Node.js 18+
- Anthropic API key

### Backend

```bash
cd backend
pip install -r requirements.txt
export ANTHROPIC_API_KEY=your_key_here
python app.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

---

## API Endpoints

### `POST /api/verdict`

Accepts activity and location, returns Claude's verdict with weather data.

**Request:**

```json
{
  "activity": "hike",
  "location": "Yosemite"
}
```

**Response:**

```json
{
  "verdict": "GO",
  "vibe_score": 8,
  "one_liner": "Crisp air, clear skies — your boots were made for today.",
  "trip_plan": {
    "packing_list": [
      "trail snacks",
      "rain jacket",
      "sunscreen",
      "water bottle"
    ],
    "arrival_window": "7am–10am for best conditions",
    "warnings": ["afternoon thunderstorm risk after 3pm"]
  },
  "weather": {
    "current": { "temp": 62, "windspeed": 6.5, "weathercode": 1 },
    "today": { "high": 68, "low": 44, "precip": 0.0, "max_wind": 12 }
  }
}
```

---

## Built By

**Nataki Skinner** — Built at the Blackathon 2026 (Coding with AI track)

Pursuing software engineering apprenticeships and building real products along the way.

🔗 [LinkedIn](https://linkedin.com/in/natakiskinner) | 🔗 [GitHub](https://github.com/taki4616)

---

## Acknowledgements

- [Anthropic Claude API](https://anthropic.com) — AI verdict generation
- [Open-Meteo](https://open-meteo.com) — Free weather API
- [BlackWPT](https://blackwpt.com) — Blackathon organizers

---

_Built in one day at the Blackathon 2026 🖤_

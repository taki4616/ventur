import { useState, useEffect } from "react";
import ActivityCard from "./ActivityCard";
import LocationInput from "./LocationInput";

function HomeScreen({ onSubmit }) {
  const [activity, setActivity] = useState("hike");
  const [location, setLocation] = useState("");
  const [location2, setLocation2] = useState("");
  const [dayIndex, setDayIndex] = useState(0);
  const [compareMode, setCompareMode] = useState(false);
  const [recent, setRecent] = useState([]);

  const dayLabels = Array.from({ length: 7 }, (_, i) => {
    if (i === 0) return "Today";
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toLocaleDateString("en-US", { weekday: "short" });
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("ventur_recent") || "[]");
    setRecent(saved);
  }, []);

  function handleSubmit() {
    if (!location.trim()) return;
    if (compareMode && !location2.trim()) return;
    onSubmit(activity, location, dayIndex, compareMode ? location2 : null);
  }

  return (
    <div className="bg-zinc-950 text-white min-h-screen flex flex-col items-center justify-center px-6">
      <h1 className="text-4xl font-bold mb-10">Ventur</h1>

      <div className="grid grid-cols-3 gap-4 mb-8 w-full max-w-xl">
        <ActivityCard activity="hike" label="Hike" emoji="🥾" selected={activity === "hike"} onSelect={setActivity} />
        <ActivityCard activity="beach" label="Beach" emoji="🏖️" selected={activity === "beach"} onSelect={setActivity} />
        <ActivityCard activity="camping" label="Camping" emoji="⛺" selected={activity === "camping"} onSelect={setActivity} />
      </div>

      <div className="flex gap-2 mb-4 w-full max-w-xl overflow-x-auto">
        {dayLabels.map((label, i) => (
          <button
            key={i}
            onClick={() => setDayIndex(i)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition ${
              dayIndex === i
                ? "bg-white text-black"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="w-full max-w-xl mb-4 flex justify-end">
        <button
          onClick={() => { setCompareMode((m) => !m); setLocation2(""); }}
          className="text-xs text-zinc-500 hover:text-white transition"
        >
          {compareMode ? "✕ Single spot" : "+ Compare two spots"}
        </button>
      </div>

      {recent.length > 0 && (
        <div className="w-full max-w-xl mb-4">
          <div className="text-xs text-zinc-500 mb-2">Recent</div>
          <div className="flex flex-wrap gap-2">
            {recent.map((r, i) => (
              <button
                key={i}
                onClick={() => { setActivity(r.activity); setLocation(r.location); }}
                className="px-3 py-1 rounded-full bg-zinc-800 text-sm text-zinc-300 hover:bg-zinc-700 transition"
              >
                {r.activity === "hike" ? "🥾" : r.activity === "beach" ? "🏖️" : "⛺"} {r.location}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="w-full max-w-xl mb-6">
        <LocationInput
          value={location}
          onChange={setLocation}
          onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
          placeholder="Where are you headed?"
          recent={recent}
        />
      </div>

      {compareMode && (
        <div className="w-full max-w-xl mb-6">
          <LocationInput
            value={location2}
            onChange={setLocation2}
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
            placeholder="Compare with..."
            recent={recent}
          />
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!location.trim() || (compareMode && !location2.trim())}
        className={`w-full max-w-xl py-3 rounded-lg font-semibold transition ${
          location.trim() && (!compareMode || location2.trim())
            ? "bg-white text-black hover:bg-gray-200"
            : "bg-zinc-700 text-zinc-400 cursor-not-allowed"
        }`}
      >
        {compareMode ? "Compare →" : "Get Verdict →"}
      </button>
    </div>
  );
}

export default HomeScreen;

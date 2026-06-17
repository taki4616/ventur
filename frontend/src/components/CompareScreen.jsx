import { useState, useEffect } from "react";

function VerdictCard({ d, isBetter }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 50);
    return () => clearTimeout(t);
  }, []);

  const verdictColor =
    d.verdict === "GO" ? "text-emerald-400" : d.verdict === "MAYBE" ? "text-yellow-400" : "text-red-400";
  const borderColor =
    d.verdict === "GO" ? "border-emerald-700" : d.verdict === "MAYBE" ? "border-yellow-700" : "border-red-700";
  const bgColor =
    d.verdict === "GO" ? "bg-emerald-950" : d.verdict === "MAYBE" ? "bg-yellow-950" : "bg-red-950";

  const peakPrecip = Math.max(...d.weather.hourly_precip_chance);

  return (
    <div className={`${bgColor} border ${borderColor} rounded-2xl p-6 relative`}>
      {isBetter && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
          Better Pick
        </div>
      )}
      <div className="text-xs text-zinc-400 uppercase tracking-widest mb-1">
        {d.weather.location_name}
      </div>
      <div
        className={`text-4xl font-extrabold mb-1 transition-all duration-500 ${verdictColor} ${
          revealed ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
      >
        {d.verdict}
      </div>
      <div className="text-sm text-zinc-400 mb-2">Vibe {d.vibe_score}/10</div>
      <div className="italic text-zinc-300 text-sm mb-5">{d.one_liner}</div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-zinc-800 rounded-lg p-3">
          <div className="text-xs text-zinc-400">Temp</div>
          <div className="font-semibold">{Math.round(d.weather.current.temp)}°F</div>
        </div>
        <div className="bg-zinc-800 rounded-lg p-3">
          <div className="text-xs text-zinc-400">High / Low</div>
          <div className="font-semibold">
            {Math.round(d.weather.today.high)}° / {Math.round(d.weather.today.low)}°
          </div>
        </div>
        <div className="bg-zinc-800 rounded-lg p-3">
          <div className="text-xs text-zinc-400">Max Wind</div>
          <div className="font-semibold">{d.weather.today.max_wind} mph</div>
        </div>
        <div className="bg-zinc-800 rounded-lg p-3">
          <div className="text-xs text-zinc-400">Peak Precip</div>
          <div className="font-semibold">{peakPrecip}%</div>
        </div>
      </div>
    </div>
  );
}

function CompareScreen({ data, onReset }) {
  const [d1, d2] = data;

  const rank = { GO: 3, MAYBE: 2, SKIP: 1 };
  const s1 = rank[d1.verdict] * 10 + d1.vibe_score;
  const s2 = rank[d2.verdict] * 10 + d2.vibe_score;
  const winner = s1 > s2 ? 0 : s2 > s1 ? 1 : null;

  return (
    <div className="bg-zinc-950 text-white min-h-screen flex flex-col items-center px-4 py-10">
      <h2 className="text-2xl font-bold mb-2">Head to Head</h2>
      <p className="text-zinc-400 text-sm mb-8">
        {d1.activity.charAt(0).toUpperCase() + d1.activity.slice(1)} conditions compared
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mb-10">
        <VerdictCard d={d1} isBetter={winner === 0} />
        <VerdictCard d={d2} isBetter={winner === 1} />
      </div>

      <button
        onClick={onReset}
        className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition"
      >
        Start Over
      </button>
    </div>
  );
}

export default CompareScreen;

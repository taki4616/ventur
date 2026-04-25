import { useState } from "react";
import TripBuilder from "./TripBuilder";

function VerdictScreen({ data, onReset }) {
  const [showTrip, setShowTrip] = useState(false);

  const verdictColor =
    data.verdict === "GO"
      ? "text-emerald-400"
      : data.verdict === "MAYBE"
      ? "text-yellow-400"
      : "text-red-400";

  const peakPrecip = Math.max(...data.weather.hourly_precip_chance);

  return (
    <div className="bg-zinc-950 text-white min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="text-sm uppercase tracking-widest text-zinc-400 mb-4">
        {data.weather.location_name}
      </div>

      <div className={`text-6xl font-extrabold mb-4 ${verdictColor}`}>
        {data.verdict}
      </div>

      <div className="text-lg mb-2">Vibe: {data.vibe_score}/10</div>

      <div className="italic text-zinc-300 mb-8">{data.one_liner}</div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 w-full max-w-2xl">
        <div className="bg-zinc-800 rounded-lg p-4">
          <div className="text-sm text-zinc-400">Current Temp</div>
          <div className="text-xl font-semibold">
            {data.weather.current.temp}°F
          </div>
        </div>
        <div className="bg-zinc-800 rounded-lg p-4">
          <div className="text-sm text-zinc-400">High / Low</div>
          <div className="text-xl font-semibold">
            {data.weather.today.high} / {data.weather.today.low}
          </div>
        </div>
        <div className="bg-zinc-800 rounded-lg p-4">
          <div className="text-sm text-zinc-400">Max Wind</div>
          <div className="text-xl font-semibold">
            {data.weather.today.max_wind} mph
          </div>
        </div>
        <div className="bg-zinc-800 rounded-lg p-4">
          <div className="text-sm text-zinc-400">Peak Precip</div>
          <div className="text-xl font-semibold">{peakPrecip}%</div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setShowTrip(true)}
          className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200"
        >
          Plan My Trip →
        </button>
        <button
          onClick={onReset}
          className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition"
        >
          Start Over
        </button>
      </div>

      <TripBuilder
        tripPlan={data.trip_plan}
        activity={data.activity}
        onClose={() => setShowTrip(false)}
        visible={showTrip}
      />
    </div>
  );
}

export default VerdictScreen;

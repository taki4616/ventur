import { useState } from "react";
import ActivityCard from "./ActivityCard";

function HomeScreen({ onSubmit }) {
  const [activity, setActivity] = useState("hike");
  const [location, setLocation] = useState("");

  return (
    <div className="bg-zinc-950 text-white min-h-screen flex flex-col items-center justify-center px-6">
      <h1 className="text-4xl font-bold mb-10">Ventur</h1>

      <div className="grid grid-cols-3 gap-4 mb-8 w-full max-w-xl">
        <ActivityCard
          activity="hike"
          label="Hike"
          emoji="🥾"
          selected={activity === "hike"}
          onSelect={setActivity}
        />
        <ActivityCard
          activity="beach"
          label="Beach"
          emoji="🏖️"
          selected={activity === "beach"}
          onSelect={setActivity}
        />
        <ActivityCard
          activity="camping"
          label="Camping"
          emoji="⛺"
          selected={activity === "camping"}
          onSelect={setActivity}
        />
      </div>

      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Where are you headed?"
        className="w-full max-w-xl mb-6 px-4 py-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none"
      />

      <button
        onClick={() => onSubmit(activity, location)}
        disabled={!location.trim()}
        className={`w-full max-w-xl py-3 rounded-lg font-semibold transition
          ${
            location.trim()
              ? "bg-white text-black hover:bg-gray-200"
              : "bg-zinc-700 text-zinc-400 cursor-not-allowed"
          }`}
      >
        Get Verdict →
      </button>
    </div>
  );
}

export default HomeScreen;

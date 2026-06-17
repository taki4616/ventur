import { useState, useEffect } from "react";
import HomeScreen from "./components/HomeScreen";
import VerdictScreen from "./components/VerdictScreen";
import CompareScreen from "./components/CompareScreen";

const LOADING_MESSAGES = [
  "Reading the skies...",
  "Asking the weather gods...",
  "Consulting the clouds...",
  "Crunching the conditions...",
  "Checking the forecast...",
];

function App() {
  const [screen, setScreen] = useState("home");
  const [verdictData, setVerdictData] = useState(null);
  const [compareData, setCompareData] = useState(null);
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (screen !== "loading") return;
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [screen]);

  async function handleSubmit(activity, location, dayIndex = 0, location2 = null) {
    setScreen("loading");
    try {
      if (location2) {
        const [res1, res2] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/verdict`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ activity, location, day_index: dayIndex }),
          }),
          fetch(`${import.meta.env.VITE_API_URL}/api/verdict`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ activity, location: location2, day_index: dayIndex }),
          }),
        ]);
        const [data1, data2] = await Promise.all([res1.json(), res2.json()]);
        if (data1.error || data2.error) { setScreen("error"); return; }
        setCompareData([data1, data2]);
        setScreen("compare");
      } else {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/verdict`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ activity, location, day_index: dayIndex }),
        });
        const data = await res.json();
        if (data.error) { setScreen("error"); return; }
        setVerdictData(data);
        const recent = JSON.parse(localStorage.getItem("ventur_recent") || "[]");
        const entry = { activity, location, verdict: data.verdict, vibe: data.vibe_score };
        const updated = [entry, ...recent.filter((r) => r.location !== location)].slice(0, 5);
        localStorage.setItem("ventur_recent", JSON.stringify(updated));
        setScreen("verdict");
      }
    } catch (e) {
      setScreen("error");
    }
  }

  if (screen === "loading") {
    return (
      <div className="bg-zinc-950 text-white min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg transition-opacity duration-300">{LOADING_MESSAGES[msgIndex]}</p>
        </div>
      </div>
    );
  }

  if (screen === "error") {
    return (
      <div className="bg-zinc-950 text-white min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl">Couldn't read the skies. Try again.</p>
        <button
          onClick={() => setScreen("home")}
          className="border border-white px-6 py-3 rounded-lg"
        >
          Start Over
        </button>
      </div>
    );
  }

  if (screen === "verdict") {
    return <VerdictScreen data={verdictData} onReset={() => setScreen("home")} />;
  }

  if (screen === "compare") {
    return <CompareScreen data={compareData} onReset={() => setScreen("home")} />;
  }

  return <HomeScreen onSubmit={handleSubmit} />;
}

export default App;

import { useState } from "react";
import HomeScreen from "./components/HomeScreen";
import VerdictScreen from "./components/VerdictScreen";

function App() {
  const [screen, setScreen] = useState("home");
  const [verdictData, setVerdictData] = useState(null);

  async function handleSubmit(activity, location) {
    setScreen("loading");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/verdict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activity, location }),
      });
      const data = await res.json();
      if (data.error) {
        setScreen("error");
        return;
      }
      setVerdictData(data);
      setScreen("verdict");
    } catch (e) {
      setScreen("error");
    }
  }

  if (screen === "loading") {
    return (
      <div className="bg-zinc-950 text-white min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg">Reading the skies...</p>
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

  return <HomeScreen onSubmit={handleSubmit} />;
}

export default App;

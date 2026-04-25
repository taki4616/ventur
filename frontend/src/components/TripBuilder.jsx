import { useState } from "react";

function TripBuilder({ tripPlan, activity, onClose, visible }) {
  const [checked, setChecked] = useState({});

  function toggleItem(item) {
    setChecked((prev) => ({ ...prev, [item]: !prev[item] }));
  }

  return (
    <div
      className={`fixed bottom-0 left-0 w-full flex justify-center transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-zinc-900 w-full max-w-2xl rounded-t-2xl p-6">
        <div className="w-12 h-1 bg-zinc-600 rounded-full mx-auto mb-4"></div>

        <div className="text-lg font-semibold mb-4 text-center text-white">
          Your {activity.charAt(0).toUpperCase() + activity.slice(1)} Plan
        </div>

        <div className="mb-4">
          <div className="text-sm text-zinc-400 mb-1">Arrival Window</div>
          <div className="text-white">{tripPlan.arrival_window}</div>
        </div>

        <div className="mb-4">
          <div className="text-sm text-zinc-400 mb-2">Packing List</div>
          <ul className="space-y-2">
            {tripPlan.packing_list.map((item) => (
              <li key={item} className="flex items-center gap-2 text-white">
                <input
                  type="checkbox"
                  checked={!!checked[item]}
                  onChange={() => toggleItem(item)}
                  className="accent-white"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {tripPlan.warnings.length > 0 && (
          <div className="mb-4 text-yellow-400">
            <div className="font-semibold mb-1">⚠ Warnings</div>
            <ul className="list-disc list-inside space-y-1">
              {tripPlan.warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-4 bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Got It
        </button>
      </div>
    </div>
  );
}

export default TripBuilder;

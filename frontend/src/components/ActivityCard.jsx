function ActivityCard({ activity, label, emoji, selected, onSelect }) {
  return (
    <div
      onClick={() => onSelect(activity)}
      className={`cursor-pointer rounded-xl p-6 text-center transition-all border
        ${
          selected
            ? "bg-white text-black border-white"
            : "bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700"
        }`}
    >
      <div className="text-3xl mb-2">{emoji}</div>
      <div className="font-semibold">{label}</div>
    </div>
  );
}

export default ActivityCard;

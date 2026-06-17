import { useState, useEffect, useRef } from "react";

function LocationInput({ value, onChange, onKeyDown, placeholder, recent = [] }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (value.trim().length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const matchingRecent = recent
      .filter((r) => r.location.toLowerCase().includes(value.toLowerCase()))
      .map((r) => ({ display_name: r.location, isRecent: true }));

    if (value.trim().length < 3) {
      setSuggestions(matchingRecent);
      setShowSuggestions(matchingRecent.length > 0);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=5`,
          { headers: { "User-Agent": "ventur-app" } }
        );
        const data = await res.json();
        const filtered = data.filter(
          (r) => !["road", "house", "building", "postcode", "path", "footway"].includes(r.type)
        );
        const combined = [
          ...matchingRecent,
          ...filtered.filter((f) => !matchingRecent.some((r) => r.display_name === f.display_name)),
        ];
        setSuggestions(combined);
        setShowSuggestions(combined.length > 0);
      } catch {
        setSuggestions(matchingRecent);
        setShowSuggestions(matchingRecent.length > 0);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value, recent]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        inputRef.current && !inputRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(result) {
    onChange(result.display_name);
    setSuggestions([]);
    setShowSuggestions(false);
  }

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setShowSuggestions(false);
          if (onKeyDown) onKeyDown(e);
        }}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none"
      />
      {showSuggestions && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden z-10"
        >
          {suggestions.map((s, i) => (
            <button
              key={i}
              onMouseDown={() => handleSelect(s)}
              className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition truncate"
            >
              {s.isRecent ? "🕐 " : ""}{s.display_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LocationInput;

import { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "../Components/langSelection";

const API_KEY = import.meta.env.VITE_TMDB_API;

export default function FilterBar({ onSearch, onFilter, onReset, searchLoading }) {
  const [showFilters, setShowFilters] = useState(false);
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState("");
  const [language, setLanguage] = useState("en");
  const [upcoming, setUpcoming] = useState(false);
  const [message, setMessage] = useState("");

  // Holds filters that were present before user turned on "upcoming"
  const [savedFiltersOnUpcoming, setSavedFiltersOnUpcoming] = useState(null);

  // For LanguageSelector save/cancel flow
  const [editingLang, setEditingLang] = useState(false);
  const [prevLanguage, setPrevLanguage] = useState(language);

  // 🔹 NEW: TMDB autocomplete state
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedFilters = (() => {
      try {
        return JSON.parse(sessionStorage.getItem("movieFilters") || "null");
      } catch {
        return null;
      }
    })();
    const savedQuery = sessionStorage.getItem("searchQuery");

    if (savedFilters) {
      if (savedFilters.upcoming) {
        setSavedFiltersOnUpcoming({
          year: savedFilters.year || "",
          rating: savedFilters.rating || "",
          language: savedFilters.language || "en",
        });
        setLanguage(savedFilters.language || "en");
        setYear("");
        setRating("");
        setUpcoming(true);
      } else {
        setYear(savedFilters.year || "");
        setRating(savedFilters.rating || "");
        setLanguage(savedFilters.language || "en");
        setUpcoming(Boolean(savedFilters.upcoming));
      }
    }

    if (savedQuery) {
      setQuery(savedQuery);
    }
  }, []);

  useEffect(() => {
    setPrevLanguage(language);
  }, []); // only on mount

  // 🔹 NEW: autocomplete fetching, debounced
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      try {
        setSuggestLoading(true);
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
            query.trim()
          )}&page=1&include_adult=false`,
          { signal: controller.signal }
        );
        const data = await res.json();
        setSuggestions(data.results ? data.results.slice(0, 8) : []);
        setShowSuggestions(true);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Search autocomplete error:", err);
        }
      } finally {
        setSuggestLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || query.trim().length < 3) {
      setMessage("Type at least 3 char to search");
      sessionStorage.removeItem("searchQuery");
      return;
    }
    setMessage("");
    sessionStorage.setItem("searchQuery", query.trim());
    setShowSuggestions(false);
    await onSearch(query.trim());
  };

  const handleClearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    sessionStorage.removeItem("searchQuery");
    onReset();
  };

  // 🔹 NEW: when user picks a suggestion, go straight to movie details
  const handleSelectSuggestion = (movieId) => {
    setShowSuggestions(false);
    setSuggestions([]);
    setQuery("");
    sessionStorage.removeItem("searchQuery");
    navigate(`/movie/${movieId}`);
  };

  // Toggle upcoming with save/restore behavior
  const toggleUpcoming = () => {
    if (!upcoming) {
      setSavedFiltersOnUpcoming({
        year: year || "",
        rating: rating || "",
        language: language || "en",
      });
      setYear("");
      setRating("");
      setUpcoming(true);
    } else {
      if (savedFiltersOnUpcoming) {
        setYear(savedFiltersOnUpcoming.year || "");
        setRating(savedFiltersOnUpcoming.rating || "");
        setLanguage(savedFiltersOnUpcoming.language || "en");
      }
      setSavedFiltersOnUpcoming(null);
      setUpcoming(false);
    }
  };

  const handleApply = () => {
    const filters = {
      year: upcoming ? "" : year,
      rating: upcoming ? "" : rating,
      language,
      upcoming,
    };

    sessionStorage.setItem("movieFilters", JSON.stringify(filters));
    sessionStorage.removeItem("searchQuery");
    setShowSuggestions(false);
    onFilter(filters);
  };

  const handleReset = () => {
    sessionStorage.removeItem("movieFilters");
    sessionStorage.removeItem("searchQuery");
    setQuery("");
    setYear("");
    setRating("");
    setLanguage("en");
    setUpcoming(false);
    setSavedFiltersOnUpcoming(null);
    setShowFilters(false);
    setEditingLang(false);
    setPrevLanguage("en");
    setSuggestions([]);
    setShowSuggestions(false);
    onReset();
  };

  const handleSaveLanguage = () => {
    setEditingLang(false);
    setPrevLanguage(language);
  };

  const handleCancelLanguage = () => {
    setLanguage(prevLanguage || "en");
    setEditingLang(false);
  };

  const disabledInputClasses = "cursor-not-allowed opacity-50 pointer-events-none";

  return (
    <div className="bg-[#121212] p-4 rounded-xl shadow-lg border border-gray-800 mb-6">
      {/* Search bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-col md:flex-row items-center gap-3"
      >
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder={`${message || "Search movies..."}`}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setMessage("");
            }}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            className={`w-full px-4 py-2 rounded-lg bg-[#1c1c1c] ${
              message ? "text-rose-500" : "text-white"
            }
                         focus:outline-none focus:ring-2 focus:ring-[#A00000]`}
            autoComplete="off"
          />
          {query && (
            <FaTimes
              className="absolute right-3 top-3 text-gray-400 hover:text-red-500 cursor-pointer transition"
              onClick={handleClearSearch}
            />
          )}

          {/* 🔹 Autocomplete dropdown */}
          {showSuggestions && (suggestions.length > 0 || suggestLoading) && (
            <div
              className="absolute mt-1 w-full max-h-80 overflow-y-auto bg-[#111] border border-gray-700 rounded-lg shadow-lg z-40"
              onMouseDown={(e) => e.preventDefault()} // keep input focus
            >
              {suggestLoading && (
                <div className="px-3 py-2 text-xs text-gray-400">
                  Searching...
                </div>
              )}

              {!suggestLoading &&
                suggestions.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectSuggestion(m.id)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-red-900/20 text-sm text-gray-200"
                  >
                    {m.poster_path && (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${m.poster_path}`}
                        alt={m.title}
                        className="w-8 h-12 object-cover rounded"
                        loading="lazy"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium line-clamp-1">{m.title}</p>
                      {m.release_date && (
                        <p className="text-[11px] text-gray-400">
                          {m.release_date.slice(0, 4)}
                        </p>
                      )}
                    </div>
                  </button>
                ))}

              {!suggestLoading && suggestions.length === 0 && (
                <div className="px-3 py-2 text-xs text-gray-400">
                  No results.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex w-full sm:w-max gap-2 justify-between sm:justify-start">
          <button
            type="submit"
            disabled={searchLoading}
            className="cursor-pointer bg-gradient-to-r from-[#7A0000] to-[#A00000]
                        hover:from-[#A00000] hover:to-[#C00000]
                        shadow-md hover:shadow-[0_0_10px_#FF0000]
                        px-5 py-2 rounded-lg text-white font-medium transition flex items-center gap-2 disabled:opacity-60"
          >
            <FaSearch /> Search
          </button>

          <button
            type="button"
            onClick={() => setShowFilters((p) => !p)}
            className="cursor-pointer bg-gradient-to-r from-[#232323] to-[#2E2E2E]
                        hover:from-[#383838] hover:to-[#444444]
                        shadow-sm hover:shadow-[0_0_8px_#555]
                        px-5 py-2 rounded-lg text-gray-200 font-medium transition"
          >
            {showFilters ? "Close Filters" : "Filter"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="cursor-pointer bg-gradient-to-r from-[#2E2E2E] to-[#3A3A3A]
                        hover:from-[#444] hover:to-[#555]
                        shadow-sm hover:shadow-[0_0_8px_#555]
                        px-5 py-2 rounded-lg text-gray-300 font-medium transition"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Filters */}
      {showFilters && (
        <div className="mt-5 grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4 animate-fadeIn items-end">
          {/* Year */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Release Year
            </label>
            <input
              type="number"
              placeholder="e.g. 2024"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              disabled={upcoming}
              className={`w-full px-3 py-2 rounded-lg bg-[#1c1c1c] text-white
                         focus:outline-none focus:ring-2 focus:ring-[#A00000]
                         appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                         ${upcoming ? disabledInputClasses : ""}`}
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Minimum Rating
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              placeholder="e.g. 7.5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              disabled={upcoming}
              className={`w-full px-3 py-2 rounded-lg bg-[#1c1c1c] text-white
                         focus:outline-none focus:ring-2 focus:ring-[#A00000]
                         appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                         ${upcoming ? disabledInputClasses : ""}`}
            />
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Language</label>
            <div className="inline-block w-full">
              <div
                onClick={() => {
                  setPrevLanguage(language);
                }}
              >
                <LanguageSelector
                  selectedLanguage={language}
                  setSelectedLanguage={setLanguage}
                  setEditingLang={setEditingLang}
                />
              </div>
            </div>
          </div>

          {/* Upcoming + Apply */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between w-full">
              <div>
                <label className="block text-sm text-gray-300">
                  Upcoming movies
                </label>
                <p className="text-xs text-gray-500">
                  In the selected language
                </p>
              </div>

              <button
                type="button"
                onClick={toggleUpcoming}
                aria-pressed={upcoming}
                className={`relative w-14 h-8 rounded-full p-1 transition-transform focus:outline-none focus:ring-2 focus:ring-[#A00000]
                           ${
                             upcoming
                               ? "bg-gradient-to-r from-[#7A0000] to-[#A00000]"
                               : "bg-[#2a2a2a]"
                           }`}
              >
                <span
                  className={`block w-6 h-6 bg-white rounded-full shadow transform transition-transform
                              ${upcoming ? "translate-x-6" : "translate-x-0"}`}
                />
              </button>
            </div>

            <button
              onClick={handleApply}
              className="cursor-pointer w-full bg-gradient-to-r from-[#7A0000] to-[#A00000]
                         hover:from-[#A00000] hover:to-[#C00000]
                         hover:shadow-[0_0_12px_#FF0000]
                         py-2 rounded-lg text-white font-semibold transition"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

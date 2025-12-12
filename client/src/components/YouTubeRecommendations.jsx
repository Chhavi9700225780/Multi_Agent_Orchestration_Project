import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config.js";
import { Play , Youtube} from "lucide-react";

/*
  YouTubeRecommendations.jsx
  - Debounced fetch
  - Clean cards, emerald accents
*/

function YouTubeRecommendations({ symptom }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debounceRef = useRef(null);

  const renderCard = (v, i, extra = "") => (
    <a
      key={i}
      href={v.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block rounded-2xl overflow-hidden border-2 border-gray-100 bg-white hover:shadow-xl hover:border-emerald-300 hover:scale-105 transition-all duration-300 group ${extra}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="relative">
        <img
          src={v.thumbnail || "/src/assets/arogya-logo.jpeg"}
          alt={v.title || "Wellness video"}
          className="w-full h-40 object-cover"
          onError={(e) => {
            if (e.currentTarget.src !== "/src/assets/arogya-logo.jpeg") {
              e.currentTarget.src = "/src/assets/arogya-logo.jpeg";
            }
          }}
        />
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <div className="text-center">
            <div className="bg-emerald-600 rounded-full p-3 shadow-lg mx-auto mb-3 w-fit">
              <Play className="text-white" size={20} />
            </div>
            <p className="text-white text-sm font-semibold line-clamp-3 drop-shadow-lg">
              {v.title}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <p className="font-semibold text-gray-900 text-sm line-clamp-2 leading-snug">
          {v.title}
        </p>
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-xs text-gray-600 font-medium">
            {v.channelTitle || "YouTube"}
          </p>
        </div>
        {v.description && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {v.description}
          </p>
        )}
      </div>
    </a>
  );

  useEffect(() => {
    if (!symptom || !symptom.trim()) {
      setVideos([]);
      setError("");
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchRecommendations(), 650);
  }, [symptom]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API_BASE_URL}/youtube-recommendations`, {
        symptom,
        max_videos: 6,
      });
      const list = res.data?.videos || [];
      setVideos(list.slice(0, 6));
      if (list.length === 0) setError("No relevant videos found.");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch videos.");
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-6 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-white border border-emerald-100">
        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
          
         <Youtube size={28} className="text-red-600" />
          
          <div className="leading-tight">
            <h4 className="text-sm sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              YouTube videos
            </h4>
            <p className="text-[11px] sm:text-xs text-gray-600 mt-0.5 break-words">
              Curated wellness content matched to your plan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {!loading && videos.length > 0 && (
            <span className="text-[11px] sm:text-xs px-3 py-1.5 rounded-full bg-emerald-600 text-white font-semibold shadow-sm flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
              {videos.length} videos
            </span>
          )}
          {!loading && (
            <button
              onClick={fetchRecommendations}
              className="text-xs sm:text-sm px-3 py-1.5 rounded-lg bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition font-medium flex items-center gap-1.5"
            >
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="py-6 text-center text-gray-500">
          <div className="inline-flex items-center gap-3">
            <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-emerald-600 animate-spin" />
            <span>Searching videos…</span>
          </div>
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-100 bg-gray-50 h-44 animate-pulse"
              />
            ))}
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && videos.length > 0 && (
        <>
          {/* Mobile horizontal scroll */}
          <div className="sm:hidden -mx-1 px-1 pb-3 flex gap-3 overflow-x-auto snap-x snap-mandatory">
            {videos.map((v, i) =>
              renderCard(
                v,
                i,
                "min-w-[240px] max-w-[300px] snap-start flex-shrink-0"
              )
            )}
          </div>

          {/* Tablet/Desktop grid */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {videos.map((v, i) => renderCard(v, i))}
          </div>
        </>
      )}

      {!loading && videos.length === 0 && !error && (
        <p className="text-sm text-gray-500">
          Videos will appear after you generate a plan.
        </p>
      )}
    </div>
  );
}

export default YouTubeRecommendations;



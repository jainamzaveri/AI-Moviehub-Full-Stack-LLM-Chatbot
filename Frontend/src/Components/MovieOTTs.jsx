import { providerSearchUrls } from "../utils/OttProviders";

function getProviderUrl(providerName, title) {
  // 1) Direct match from your mapping
  if (providerSearchUrls[providerName]) {
    return providerSearchUrls[providerName](title);
  }

  // 2) Normalize and handle common aliases
  const normalized = providerName.trim().toLowerCase();

  // Prime Video aliases
  if (normalized === "prime video" || normalized === "amazon prime video") {
    return providerSearchUrls["Amazon Prime Video"]?.(title);
  }

  // Disney / Hotstar aliases
  if (
    normalized === "disney plus" ||
    normalized === "disney+" ||
    normalized === "disney+ hotstar" ||
    normalized === "hotstar"
  ) {
    return providerSearchUrls["Disney+ Hotstar"]?.(title);
  }

  // Apple TV aliases
  if (normalized === "apple tv+" || normalized === "apple tv plus") {
    return providerSearchUrls["Apple TV Plus"]?.(title);
  }

  // 3) Fallback → Google search with provider name + movie title
  return `https://www.google.com/search?q=${encodeURIComponent(
    `${title} ${providerName}`.trim()
  )}`;
}

function MovieOTTs({ providers, movie }) {
  const hasProviders = providers && providers.length > 0;

  // Fallback providers to show even when TMDB does not return any OTT data
  const fallbackProviders = ["Netflix", "Amazon Prime Video", "Disney+ Hotstar"];

  if (!movie) return null;

  return (
    <div className="mt-4">
      {hasProviders ? (
        <div className="flex flex-wrap justify-center lg:justify-start gap-5">
          {providers.map((p) => {
            const providerName = p.provider_name;
            const url = getProviderUrl(providerName, movie.title);

            return (
              <div
                key={p.provider_id}
                onClick={() => window.open(url, "_blank")}
                className="flex flex-col items-center gap-2 bg-[#1a1a1a]/80 hover:bg-[#222] rounded-xl p-3 transition cursor-pointer"
                title={`Search on ${providerName}`}
              >
                {p.logo_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${p.logo_path}`}
                    alt={providerName}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}
                <p className="text-xs text-gray-300">{providerName}</p>
              </div>
            );
          })}
        </div>
      ) : (
        // No providers from TMDB → show helpful fallback chips
        <div className="flex flex-col gap-3">
          <p className="text-sm text-gray-400">
            This movie is not listed on any streaming providers for your region.
            You can still try searching on:
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-3">
            {fallbackProviders.map((name) => {
              const baseUrl = providerSearchUrls[name]
                ? providerSearchUrls[name](movie.title)
                : `https://www.google.com/search?q=${encodeURIComponent(
                    `${movie.title} ${name}`
                  )}`;

              return (
                <button
                  key={name}
                  onClick={() => window.open(baseUrl, "_blank")}
                  className="px-4 py-2 rounded-full bg-[#1a1a1a]/80 hover:bg-[#222] border border-gray-700 hover:border-red-500 text-xs text-gray-200 transition cursor-pointer"
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieOTTs;

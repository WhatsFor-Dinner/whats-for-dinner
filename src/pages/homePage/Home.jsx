import { useState, useEffect, useRef } from "react";
import "./home.css";

const Home = ({ searchTerm = "", onSearchChange = () => {} }) => {
  const [topRecipes, setTopRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topError, setTopError] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const overlayRef = useRef(null);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const raw = localStorage.getItem("recentSearches");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  // Fetch initial top recipes from backend (top 10)
  useEffect(() => {
    let cancelled = false;
    const fetchTopRecipes = async () => {
      try {
        setLoading(true);
        setTopError(null);
        const response = await fetch("/api/top-ten");
        if (!response.ok) {
          throw new Error(`Failed to fetch top recipes: ${response.statusText}`);
        }
        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          const text = await response.text();
          console.error("Top recipes fetch returned non-JSON", {
            url: response.url,
            status: response.status,
            contentSnippet: text.slice(0, 500),
          });
          throw new Error(
            `Failed to fetch top recipes: ${response.statusText}`
          );
        }
        const data = await response.json();
        const rows = Array.isArray(data) ? data : data.recipes || [];
        if (!cancelled) {
          setTopRecipes(rows);
          // Keep search results separate from Top Recipes.
          // Do not populate `filteredRecipes` with top recipes by default.
        }
      } catch (err) {
        console.error("Error fetching top recipes:", err);
        if (!cancelled) {
          setTopError(err.message);
          setTopRecipes([]);
          setFilteredRecipes([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchTopRecipes();
    return () => {
      cancelled = true;
    };
  }, []);

  // Server-driven search: when searchTerm changes, request backend search endpoint (debounced)
  useEffect(() => {
    let isCancelled = false;
    // If no search term, do not show top recipes in the sidebar.
    // Keep the sidebar empty until the user types a query.
    if (searchTerm.trim() === "") {
      setFilteredRecipes([]);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const t = setTimeout(async () => {
      try {
        setLoading(true);
        setSearchError(null);
        const q = encodeURIComponent(searchTerm.trim());
        const res = await fetch(`/api/recipes?query=${q}`, { signal });
        if (!res.ok) {
          throw new Error(`Search failed: ${res.statusText}`);
        }
        const results = await res.json();
        if (!isCancelled) {
          const rows = Array.isArray(results) ? results : results.recipes || [];
          setFilteredRecipes(rows);

          // If we successfully returned results for a query, save the query as a recent search.
          try {
            const q = searchTerm.trim();
            if (q.length > 0) {
              setRecentSearches((prev) => {
                const deduped = [q, ...prev.filter((s) => s !== q)].slice(0, 8);
                try {
                  localStorage.setItem("recentSearches", JSON.stringify(deduped));
                } catch (e) {
                  // ignore localStorage errors
                }
                return deduped;
              });
            }
          } catch (e) {
            /* ignore */
          }
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Search error:", err);
        if (!isCancelled) {
          setSearchError(err.message);
          setFilteredRecipes([]);
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => {
      isCancelled = true;
      controller.abort();
      clearTimeout(t);
    };
  }, [searchTerm]);

  const handleRecipeClick = () => {
    // Clear search bar when user clicks on a recipe
    onSearchChange("");
    // close drawer on mobile when a recipe is selected
    setIsSidebarOpen(false);
  };

  return (
    <div className="home site-layout">
      <aside className={`left-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-inner">
          <div className="sidebar-search">
            <label htmlFor="sidebar-search-input" className="visually-hidden">
              Search recipes
            </label>
            <input
              id="sidebar-search-input"
              className="search-input"
              type="text"
              placeholder="Search all recipes..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <div className="sidebar-results">
            {loading && (
              <div className="loading-state small">
                <div className="spinner"></div>
                <p>Loading...</p>
              </div>
            )}

            {searchError && (
              <div className="error-state small">
                <p>⚠️ {searchError}</p>
              </div>
            )}

            {!loading && !searchError && filteredRecipes.length > 0 ? (
              <div className="recipes-grid sidebar-grid">
                {filteredRecipes.map((r, i) => (
                  <div
                    key={`s-${r.id || i}`}
                    className="recipe-card small-card"
                    onClick={handleRecipeClick}
                  >
                    <div className="recipe-content">
                      <h3 className="recipe-title-small">
                        {r.recipe_name || r.name}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            ) : (searchTerm.trim() === "" && recentSearches.length > 0) ? (
              <div className="recent-searches small">
                <h4>Recent searches</h4>
                <ul className="suggestion-list">
                  {recentSearches.map((s, idx) => (
                    <li key={`recent-${idx}`} className="suggestion-item">
                      <button
                        type="button"
                        onClick={() => onSearchChange(s)}
                        className="suggestion-button"
                      >
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="search-prompt small">
                <p className="prompt-text">Search recipes to see results here.</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* overlay for mobile drawer */}
      <div
        ref={overlayRef}
        className={`sidebar-overlay ${isSidebarOpen ? "open" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden={!isSidebarOpen}
      />

      <main className="center-content">
        <header className="header-center">
          <button
            className="sidebar-toggle"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            aria-expanded={isSidebarOpen}
            onClick={() => setIsSidebarOpen((s) => !s)}
          >
            <span className={`hamburger ${isSidebarOpen ? "open" : ""}`} />
          </button>
          <h1 className="home-title">Welcome to What's for Dinner?</h1>
          <div className="about-section">
            <h2>About Us</h2>
            <p>
              Welcome to What's For Dinner, do you ever wonder what to cook?
              Look no further! This application will show you our top recipes to
              cook. You can also search for recipes based on your appetite.
            </p>
          </div>
        </header>

        <section className="top-recipes-section">
          <h2>Top Recipes</h2>

          {loading && topRecipes.length === 0 && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading delicious recipes...</p>
            </div>
          )}

          {topError && topRecipes.length === 0 && (
            <div className="error-state">
              <p>⚠️ {topError}</p>
              <p className="error-hint">
                Please make sure the backend server is running on port 3000
              </p>
            </div>
          )}

          {!loading && !topError && topRecipes.length > 0 ? (
            <div className="recipes-grid">
              {topRecipes.map((recipe, index) => (
                <div
                  key={`top-${recipe.id}-${index}`}
                  className="recipe-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={handleRecipeClick}
                >
                  <div className="recipe-image-placeholder">
                    {recipe.picture_url ? (
                      <img
                        src={recipe.picture_url}
                        alt={recipe.recipe_name || recipe.name}
                      />
                    ) : (
                      <div className="image-fallback">🍽️</div>
                    )}
                  </div>
                  <div className="recipe-content">
                    <h3 className="recipe-title">
                      {recipe.recipe_name || recipe.name}
                    </h3>
                    {recipe.description && (
                      <p className="recipe-description">{recipe.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : !loading && !topError && topRecipes.length === 0 ? (
            <div className="no-results-state">
              <p className="no-results-icon">🍽️</p>
              <p>No top recipes available</p>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
};

export default Home;

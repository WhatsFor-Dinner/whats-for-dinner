import { useState, useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import "./home.css";

const Home = ({ searchTerm = "", onSearchChange = () => {} }) => {
  const [topRecipes, setTopRecipes] = useState([]);
  const [exploreRecipes, setExploreRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 12;
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
        const response = await fetch("/top-ten");
        if (!response.ok) {
          throw new Error(
            `Failed to fetch top recipes: ${response.statusText}`
          );
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

  // Fetch all recipes for explore section
  useEffect(() => {
    let cancelled = false;
    const fetchAllRecipes = async () => {
      try {
        // Fetch with empty query and limit set to 50 to get more recipes
        const response = await fetch("/recipes?query=&limit=50");
        if (!response.ok) {
          console.error(
            "Failed to fetch explore recipes:",
            response.statusText
          );
          return;
        }
        const data = await response.json();

        const rows =
          data.items || (Array.isArray(data) ? data : data.recipes || []);
        if (!cancelled) {
          setExploreRecipes(rows);
        }
      } catch (err) {
        console.error("Error fetching explore recipes:", err);
      }
    };

    fetchAllRecipes();
    return () => {
      cancelled = true;
    };
  }, []);

  // Server-driven search: when searchTerm changes, request backend search endpoint (debounced)
  useEffect(() => {
    let isCancelled = false;

    if (searchTerm.trim() === "") {
      setFilteredRecipes([]);
      return;
    }

    const controller = new AbortController();

    const t = setTimeout(async () => {
      try {
        setLoading(true);
        setSearchError(null);

        const q = encodeURIComponent(searchTerm.trim());
        const limit = 15;
        const offset = 0;

        const res = await fetch(
          `/recipes?query=${q}&limit=${limit}&offset=${offset}`,
          {
            signal: controller.signal,
          }
        );

        // handle non-OK BEFORE reading the body
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(
            `Search failed (${res.status}): ${text || res.statusText}`
          );
        }

        const payload = await res.json();
        const rows = Array.isArray(payload)
          ? payload
          : payload.items || payload.recipes || [];

        if (!isCancelled) {
          setFilteredRecipes(rows);

          const qClean = searchTerm.trim();
          if (qClean) {
            setRecentSearches((prev) => {
              const deduped = [
                qClean,
                ...prev.filter((s) => s !== qClean),
              ].slice(0, 8);
              try {
                localStorage.setItem("recentSearches", JSON.stringify(deduped));
              } catch {}
              return deduped;
            });
          }
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Search error:", err);
          if (!isCancelled) {
            setSearchError(err.message);
            setFilteredRecipes([]);
          }
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }, 300);

    return () => {
      isCancelled = true;
      controller.abort();
      clearTimeout(t);
    };
  }, [searchTerm]);

  const handleRecipeClick = (recipeId) => {
    // Navigate to recipe detail page
    window.location.href = `/recipe/${recipeId}`;
  };

  const handleClearSearch = () => {
    onSearchChange("");
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem("recentSearches");
    } catch (e) {}
  };

  return (
    <div className="home site-layout">
      <aside className={`left-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-inner">
          <div className="sidebar-search">
            <label htmlFor="sidebar-search-input" className="visually-hidden">
              Search recipes
            </label>
            <div className="search-input-wrapper">
              <input
                id="sidebar-search-input"
                className="search-input"
                type="text"
                placeholder="Search all recipes..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              {searchTerm.trim() && (
                <button
                  type="button"
                  className="clear-search-button"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                >
                  <FaTimes />
                </button>
              )}
            </div>
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
                    onClick={() => handleRecipeClick(r.id)}
                  >
                    <div className="recipe-content">
                      <h3 className="recipe-title-small">
                        {r.recipe_name || r.name}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchTerm.trim() === "" && recentSearches.length > 0 ? (
              <div className="recent-searches small">
                <div className="recent-searches-header">
                  <h4>Recent searches</h4>
                  <button
                    type="button"
                    className="clear-recent-searches-button"
                    onClick={handleClearRecentSearches}
                    aria-label="Clear recent searches"
                    title="Clear recent searches"
                  >
                    <FaTimes />
                  </button>
                </div>
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
                <p className="prompt-text">
                  Search recipes to see results here.
                </p>
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
          <div className="about-section">
            <h2>About Us</h2>
            <p>
              Do you ever wonder what to cook? Look no further! This application
              will show you our top recipes to cook. You can also search for
              recipes based on your appetite.
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
                  onClick={() => handleRecipeClick(recipe.id)}
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

        <section className="explore-section">
          <h2>Explore Recipes</h2>
          {exploreRecipes.length > 0 ? (
            <>
              <div className="explore-grid">
                {exploreRecipes
                  .slice(
                    (currentPage - 1) * recipesPerPage,
                    currentPage * recipesPerPage
                  )
                  .map((recipe, index) => (
                    <div
                      key={`explore-${recipe.id}-${index}`}
                      className="recipe-card"
                      onClick={() => handleRecipeClick(recipe.id)}
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
                          <p className="recipe-description">
                            {recipe.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              {exploreRecipes.length > recipesPerPage && (
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    ← Previous
                  </button>
                  <span className="pagination-info">
                    Page {currentPage} of{" "}
                    {Math.ceil(exploreRecipes.length / recipesPerPage)}
                  </span>
                  <button
                    className="pagination-btn"
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(
                          prev + 1,
                          Math.ceil(exploreRecipes.length / recipesPerPage)
                        )
                      )
                    }
                    disabled={
                      currentPage ===
                      Math.ceil(exploreRecipes.length / recipesPerPage)
                    }
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-results-state">
              <p className="no-results-icon">🍽️</p>
              <p>No recipes to explore yet</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;

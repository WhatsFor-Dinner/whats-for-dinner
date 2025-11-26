import { useState, useEffect } from "react";
import "./home.css";

const Home = ({ searchTerm = "", onSearchChange = () => {} }) => {
  const [topRecipes, setTopRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  // Fetch initial top recipes from backend (top 10)
  useEffect(() => {
    let cancelled = false;
    const fetchTopRecipes = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/top-ten");
        if (!response.ok) {
          throw new Error(
            `Failed to fetch top recipes: ${response.statusText}`
          );
        }
        const data = await response.json();
        const rows = Array.isArray(data) ? data : data.recipes || [];
        if (!cancelled) {
          setTopRecipes(rows);
          setFilteredRecipes(rows);
        }
      } catch (err) {
        console.error("Error fetching top recipes:", err);
        if (!cancelled) {
          setError(err.message);
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
    // if no search term, show topRecipes (already set)
    if (searchTerm.trim() === "") {
      setFilteredRecipes(topRecipes);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const t = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        const q = encodeURIComponent(searchTerm.trim());
        const res = await fetch(`/api/recipes?query=${q}`, { signal });
        if (!res.ok) {
          throw new Error(`Search failed: ${res.statusText}`);
        }
        const results = await res.json();
        if (!isCancelled) {
          const rows = Array.isArray(results) ? results : results.recipes || [];
          setFilteredRecipes(rows);
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Search error:", err);
        if (!isCancelled) {
          setError(err.message);
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
  };

  return (
    <div className="home">
      <h1 className="home-title">Welcome to What's for Dinner?</h1>
      <div className="about-section">
        <h2>About Us</h2>
        <p>
          Welcome to What's For Dinner, do you ever wonder what to cook? Look no
          further! This application will show you our top recipes to cook. You
          can also search for recipes based on your appetite.
        </p>
      </div>

      <div className="top-recipes-section">
        <h2>Top Recipes</h2>

        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading delicious recipes...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <p>⚠️ {error}</p>
            <p className="error-hint">
              Please make sure the backend server is running on port 3000
            </p>
          </div>
        )}

        {!loading && !error && filteredRecipes.length > 0 ? (
          <div className="recipes-grid">
            {filteredRecipes.map((recipe, index) => (
              <div
                key={recipe.id}
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
                  <div className="recipe-meta">
                    {recipe.type_of_cuisine && (
                      <span className="meta-tag cuisine">
                        🌍 {recipe.type_of_cuisine}
                      </span>
                    )}
                    {recipe.difficulty && (
                      <span
                        className={`meta-tag difficulty ${recipe.difficulty.toLowerCase()}`}
                      >
                        📊 {recipe.difficulty}
                      </span>
                    )}
                  </div>
                  {recipe.chef_rating && (
                    <div className="recipe-rating">
                      {"⭐".repeat(Math.round(recipe.chef_rating))}
                      <span className="rating-value">
                        {recipe.chef_rating}/5
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : !loading && !error && filteredRecipes.length === 0 ? (
          <div className="no-results-state">
            <p className="no-results-icon">🔍</p>
            <p>No recipes found matching '{searchTerm}'</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Home;

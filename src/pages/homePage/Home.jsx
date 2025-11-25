import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "./home.css";

const Home = ({ searchTerm = "", onSearchChange = () => {} }) => {
  const navigate = useNavigate();
  const [topRecipes, setTopRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchTopRecipes = async () => {
      try {
        if (isMounted) {
          setLoading(true);
          setError(null);
        }
        const response = await fetch("/top-ten");
        if (!response.ok) {
          throw new Error(`Failed to fetch recipes: ${response.statusText}`);
        }
        const data = await response.json();
        if (isMounted) {
          setTopRecipes(Array.isArray(data) ? data : data.recipes || []);
          setFilteredRecipes(Array.isArray(data) ? data : data.recipes || []);
        }
      } catch (err) {
        console.error("Error fetching recipes:", err);
        if (isMounted) {
          setError(err.message);
          setTopRecipes([]);
          setFilteredRecipes([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTopRecipes();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter recipes based on search term (from navbar)
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredRecipes(topRecipes);
    } else {
      const filtered = topRecipes.filter((recipe) => {
        const name = recipe.recipe_name || recipe.name || "";
        return name.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredRecipes(filtered);
    }
  }, [searchTerm, topRecipes]);

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
                onClick={() => navigate(`/recipe/${recipe.id}`)}
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

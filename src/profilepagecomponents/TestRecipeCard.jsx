import { useState, useEffect } from "react";
import { useAuth } from "../Auth/Auth.jsx";
import StarRating from "./StarRating.jsx";
import "./RecipeCardDetails.css";

function TestRecipeCard() {
  const { token } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sample test data that matches backend structure
  const testRecipeData = {
    id: 1,
    user_id: 1,
    username: "TestChef",
    recipe_name: "Test Chocolate Chip Cookies",
    description:
      "Delicious homemade chocolate chip cookies that are crispy on the outside and chewy on the inside.",
    cuisine_type: "American",
    difficulty: "Easy",
    chef_rating: 4.5,
    number_of_servings: 24,
    prep_time_minutes: 15,
    cook_time_minutes: 12,
    calories: 150,
    notes:
      "For extra chewy cookies, slightly underbake them. Store in an airtight container for up to 5 days.",
    instructions: [
      "Preheat oven to 375°F (190°C)",
      "Mix butter and sugars until creamy",
      "Beat in eggs and vanilla",
      "Combine flour, baking soda, and salt",
      "Stir in chocolate chips",
      "Drop spoonfuls onto baking sheet",
      "Bake for 10-12 minutes until golden",
    ],
    picture_url:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500",
    like_count: 42,
    ingredients: [
      {
        ingredientId: 1,
        name: "All-purpose flour",
        quantity: 2.25,
        unit: "cup",
      },
      { ingredientId: 2, name: "Butter", quantity: 1, unit: "cup" },
      { ingredientId: 3, name: "White sugar", quantity: 0.75, unit: "cup" },
      { ingredientId: 4, name: "Brown sugar", quantity: 0.75, unit: "cup" },
      { ingredientId: 5, name: "Eggs", quantity: 2, unit: "piece" },
      { ingredientId: 6, name: "Vanilla extract", quantity: 2, unit: "tsp" },
      { ingredientId: 7, name: "Baking soda", quantity: 1, unit: "tsp" },
      { ingredientId: 8, name: "Salt", quantity: 0.5, unit: "tsp" },
      { ingredientId: 9, name: "Chocolate chips", quantity: 2, unit: "cup" },
    ],
  };

  useEffect(() => {
    // Simulate fetching from backend
    const fetchRecipe = async () => {
      try {
        setLoading(true);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // TODO: Replace with actual API call when backend is ready
        // const response = await fetch('/api/recipes/1', {
        //   headers: token ? { Authorization: `Bearer ${token}` } : {}
        // });
        // const data = await response.json();
        // setRecipe(data);

        // For now, use test data
        setRecipe(testRecipeData);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching recipe:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [token]);

  if (loading) {
    return (
      <div className="test-recipe-card loading">
        <p>Loading test recipe...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="test-recipe-card error">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="test-recipe-card">
        <p>No recipe data available</p>
      </div>
    );
  }

  return (
    <section className="test-recipe-card">
      <div className="recipe-card-header">
        <h2>🧪 Test Recipe Card (Remove when backend is ready)</h2>
      </div>

      <div className="recipe-card-content">
        {/* Recipe Header Section - Image and Info Side by Side */}
        <div className="recipe-header-section">
          {/* Recipe Image */}
          {recipe.picture_url && (
            <div className="recipe-image-container">
              <img src={recipe.picture_url} alt={recipe.recipe_name} />
            </div>
          )}

          {/* Recipe Header Info and Meta Data */}
          <div className="recipe-header-info">
            <h1>{recipe.recipe_name}</h1>
            <p className="recipe-author">By: {recipe.username}</p>
            <p className="recipe-description">{recipe.description}</p>

            {/* Recipe Meta Info - Now inside header section */}
            <div className="recipe-meta">
              <div className="meta-item">
                <span className="meta-label">Cuisine:</span>
                <span className="meta-value">{recipe.cuisine_type}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Difficulty:</span>
                <span className="meta-value">{recipe.difficulty}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Servings:</span>
                <span className="meta-value">{recipe.number_of_servings}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Prep Time:</span>
                <span className="meta-value">
                  {recipe.prep_time_minutes} min
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Cook Time:</span>
                <span className="meta-value">
                  {recipe.cook_time_minutes} min
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Calories:</span>
                <span className="meta-value">
                  {recipe.calories} per serving
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Likes:</span>
                <span className="meta-value">❤️ {recipe.like_count}</span>
              </div>
            </div>

            {/* Rating - Moved to header section */}
            <div className="recipe-rating-inline">
              <span className="rating-label">Rating:</span>
              <StarRating rating={recipe.chef_rating} />
            </div>
          </div>
        </div>

        {/* Ingredients and Instructions Side by Side */}
        <div className="recipe-content-row">
          {/* Ingredients Section */}
          <div className="recipe-section">
            <h3>Ingredients</h3>
            <ul className="ingredients-list">
              {recipe.ingredients && Array.isArray(recipe.ingredients) ? (
                recipe.ingredients.map((ing, index) => (
                  <li key={index}>
                    <span className="ingredient-amount">
                      {ing.quantity} {ing.unit}
                    </span>
                    <span className="ingredient-name">{ing.name}</span>
                  </li>
                ))
              ) : (
                <li>No ingredients available</li>
              )}
            </ul>
          </div>

          {/* Instructions Section */}
          <div className="recipe-section">
            <h3>Instructions</h3>
            <ol className="instructions-list">
              {recipe.instructions && Array.isArray(recipe.instructions) ? (
                recipe.instructions.map((step, index) => (
                  <li key={index}>{step}</li>
                ))
              ) : typeof recipe.instructions === "string" ? (
                <li>{recipe.instructions}</li>
              ) : (
                <li>No instructions available</li>
              )}
            </ol>
          </div>
        </div>

        {/* Chef Notes */}
        {recipe.notes && (
          <div className="recipe-section">
            <h3>Chef's Notes</h3>
            <p className="chef-notes">{recipe.notes}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="recipe-actions">
          <button className="btn btn-primary">❤️ Favorite</button>
          <button className="btn btn-secondary">✏️ Update Recipe</button>
          <button className="btn btn-danger">🗑️ Delete Recipe</button>
        </div>
      </div>
    </section>
  );
}

export default TestRecipeCard;

import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useAuth } from "../Auth/Auth.jsx";
import StarRating from "./StarRating.jsx";
import LikeButton from "./Favorite.jsx";
import "./RecipeCardDetails.css";

function AllRecipeCard() {
  const { id } = useParams();
  const { token } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    // Fetch recipe from backend
    const fetchRecipe = async () => {
      try {
        if (isMounted) setLoading(true);

        const response = await fetch(`/recipes/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch recipe: ${response.statusText}`);
        }

        const data = await response.json();

        if (isMounted) {
          setRecipe(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.warn("Recipe not found", err.message);
          setRecipe(RecipeData);
          setError(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) {
      fetchRecipe();
    }
    return () => {
      isMounted = false;
    };
  }, [id, token]);

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
        <h2></h2>
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
              <div className="recipe-detail-item">
                <span className="recipe-detail-label">Cuisine:</span>
                <span className="recipe-detail-value">
                  {recipe.cuisine_type}
                </span>
              </div>

              <div className="recipe-detail-item">
                <span className="recipe-detail-label">Servings:</span>
                <span className="recipe-detail-value">
                  {recipe.number_of_servings}
                </span>
              </div>
              <div className="recipe-detail-item">
                <span className="recipe-detail-label">Prep Time:</span>
                <span className="recipe-detail-value">
                  {recipe.prep_time_minutes} min
                </span>
              </div>
              <div className="recipe-detail-item">
                <span className="recipe-detail-label">Cook Time:</span>
                <span className="recipe-detail-value">
                  {recipe.cook_time_minutes} min
                </span>
              </div>

              <div className="recipe-detail-item">
                <span className="recipe-detail-label">Likes:</span>
                <span className="recipe-detail-value">
                  ❤️ {recipe.like_count}
                </span>
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

        <div className="recipe-actions">
          <LikeButton
            recipeId={recipe.id}
            initialFavorite={recipe.is_favorited}
          />
        </div>
      </div>
    </section>
  );
}

export default AllRecipeCard;

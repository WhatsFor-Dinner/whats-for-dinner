import { useNavigate } from "react-router";

export default function RecipeCard({ recipe, from }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/recipe/${recipe.id}`, { state: { from } });
  };

  return (
    <div
      className="recipe-card"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <div className="recipe-image-placeholder">
        {recipe.picture_url ? (
          <img src={recipe.picture_url} alt={recipe.recipe_name} />
        ) : (
          <div className="image-fallback">🍽️</div>
        )}
      </div>
      <div className="recipe-content">
        <h3 className="recipe-title">{recipe.recipe_name}</h3>
        {recipe.description && (
          <p className="recipe-description">{recipe.description}</p>
        )}
        {recipe.username && (
          <p className="recipe-author">By: {recipe.username}</p>
        )}
      </div>
    </div>
  );
}

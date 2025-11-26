import { Link } from "react-router";

export default function RecipeList({ recipes }) {
  return (
    <ul>
      {recipes.map((recipe) => (
        <RecipeListItem key={recipe.id} recipe={recipe} />
      ))}
    </ul>
  );
}

function RecipeListItem({ recipe }) {
  return (
    <li>
      <Link to={"/recipe/" + recipe.id}>
        {recipe.picture_url && (
          <img src={recipe.picture_url} alt={recipe.recipe_name} />
        )}
        <span>{recipe.recipe_name}</span>
      </Link>
    </li>
  );
}

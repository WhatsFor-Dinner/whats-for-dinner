import { Link } from "react-router";

export default function RecipeList({ recipes, from }) {
  return (
    <ul>
      {recipes.map((recipe) => (
        <RecipeListItem key={recipe.id} recipe={recipe} from={from} />
      ))}
    </ul>
  );
}

function RecipeListItem({ recipe, from }) {
  return (
    <li>
      <Link to={"/recipe/" + recipe.id} state={{ from }}>
        {recipe.picture_url && (
          <img src={recipe.picture_url} alt={recipe.recipe_name} />
        )}
        <span>{recipe.recipe_name}</span>
      </Link>
    </li>
  );
}

import RecipeCard from "./RecipeCard.jsx";

export default function RecipeList({ recipes, from }) {
  return (
    <div className="recipes-grid">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} from={from} />
      ))}
    </div>
  );
}
